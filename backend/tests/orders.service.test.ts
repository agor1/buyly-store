import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Prisma } from "../src/generated/prisma/client.js";
import { OrderStatus } from "../src/types/order.types.js";
import { mockFn } from "./test-utils.js";

const transactionMock = mockFn();
const productFindManyMock = mockFn();
const productUpdateManyMock = mockFn();
const productUpdateMock = mockFn();
const orderCreateMock = mockFn();
const orderFindUniqueMock = mockFn();
const orderUpdateMock = mockFn();
const orderDeleteMock = mockFn();
const cartDeleteManyMock = mockFn();
const sendOrderConfirmationEmailMock = mockFn();

const tx = {
  product: {
    findMany: productFindManyMock,
    updateMany: productUpdateManyMock,
    update: productUpdateMock,
  },
  order: {
    create: orderCreateMock,
    findUnique: orderFindUniqueMock,
    update: orderUpdateMock,
    delete: orderDeleteMock,
  },
  cartItem: {
    deleteMany: cartDeleteManyMock,
  },
};

jest.unstable_mockModule("../src/lib/prisma.js", () => ({
  prisma: {
    $transaction: transactionMock,
  },
}));

jest.unstable_mockModule("../src/services/mail.service.js", () => ({
  sendOrderConfirmationEmail: sendOrderConfirmationEmailMock,
}));

const { createOrder, deleteOrder, updateOrderStatus } = await import(
  "../src/services/orders.service.js"
);

describe("orders.service", () => {
  beforeEach(() => {
    transactionMock.mockReset();
    productFindManyMock.mockReset();
    productUpdateManyMock.mockReset();
    productUpdateMock.mockReset();
    orderCreateMock.mockReset();
    orderFindUniqueMock.mockReset();
    orderUpdateMock.mockReset();
    orderDeleteMock.mockReset();
    cartDeleteManyMock.mockReset();
    sendOrderConfirmationEmailMock.mockReset();
    transactionMock.mockImplementation(async (callback) => callback(tx));
  });

  it("creates order using active promo price and shipping price", async () => {
    productFindManyMock.mockResolvedValue([
      {
        id: "product-1",
        price: new Prisma.Decimal("100"),
        promo_price: new Prisma.Decimal("80"),
        promo_starts_at: new Date(Date.now() - 60_000),
        promo_ends_at: new Date(Date.now() + 60_000),
        is_active: true,
      },
    ]);
    productUpdateManyMock.mockResolvedValue({ count: 1 });
    orderCreateMock.mockImplementation(async ({ data }) => ({
      id: "order-1",
      ...data,
      user: {
        email: "customer@example.com",
        name: "Test Customer",
      },
      order_items: [
        {
          product_id: "product-1",
          quantity: 2,
          unit_price: new Prisma.Decimal("80"),
          product: {
            id: "product-1",
            name: "Test product",
          },
        },
      ],
    }));
    cartDeleteManyMock.mockResolvedValue({ count: 1 });
    sendOrderConfirmationEmailMock.mockResolvedValue(undefined);

    const order = await createOrder({
      userId: "user-1",
      shippingAddress: "Test address",
      shippingType: "courier",
      paymentType: "card",
      items: [{ productId: "product-1", quantity: 2 }],
    });

    expect(order.total_price.toString()).toBe("174.99");
    expect(orderCreateMock).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          order_items: {
            create: [
              {
                product_id: "product-1",
                quantity: 2,
                unit_price: new Prisma.Decimal("80"),
              },
            ],
          },
        }),
      }),
    );
    expect(sendOrderConfirmationEmailMock).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "customer@example.com",
        orderId: "order-1",
        totalPrice: "174.99",
      }),
    );
  });

  it("throws when order product has insufficient stock", async () => {
    productFindManyMock.mockResolvedValue([
      {
        id: "product-1",
        price: new Prisma.Decimal("100"),
        promo_price: null,
        promo_starts_at: null,
        promo_ends_at: null,
        is_active: true,
      },
    ]);
    productUpdateManyMock.mockResolvedValue({ count: 0 });

    await expect(
      createOrder({
        userId: "user-1",
        shippingAddress: "Test address",
        shippingType: "pickup",
        paymentType: "card",
        items: [{ productId: "product-1", quantity: 2 }],
      }),
    ).rejects.toThrow("Brak wystarczającej ilości produktu w magazynie.");
    expect(orderCreateMock).not.toHaveBeenCalled();
    expect(sendOrderConfirmationEmailMock).not.toHaveBeenCalled();
  });

  it("restores stock when cancelling pending order", async () => {
    orderFindUniqueMock.mockResolvedValue({
      id: "order-1",
      status: OrderStatus.PENDING,
      order_items: [{ product_id: "product-1", quantity: 2 }],
    });
    productUpdateMock.mockResolvedValue({});
    orderUpdateMock.mockResolvedValue({
      id: "order-1",
      status: OrderStatus.CANCELLED,
    });

    await expect(
      updateOrderStatus("order-1", OrderStatus.CANCELLED),
    ).resolves.toEqual({ id: "order-1", status: OrderStatus.CANCELLED });
    expect(productUpdateMock).toHaveBeenCalledWith({
      where: { id: "product-1" },
      data: {
        stock: {
          increment: 2,
        },
      },
    });
  });

  it("does not allow cancelling shipped order", async () => {
    orderFindUniqueMock.mockResolvedValue({
      id: "order-1",
      status: OrderStatus.SHIPPED,
      order_items: [{ product_id: "product-1", quantity: 2 }],
    });

    await expect(
      updateOrderStatus("order-1", OrderStatus.CANCELLED),
    ).rejects.toThrow("Nie można anulować zrealizowanego zamówienia.");
    expect(productUpdateMock).not.toHaveBeenCalled();
    expect(orderUpdateMock).not.toHaveBeenCalled();
  });

  it("does not allow deleting delivered order", async () => {
    orderFindUniqueMock.mockResolvedValue({
      id: "order-1",
      status: OrderStatus.DELIVERED,
      order_items: [{ product_id: "product-1", quantity: 2 }],
    });

    await expect(deleteOrder("order-1")).rejects.toThrow(
      "Nie można usunąć zrealizowanego zamówienia.",
    );
    expect(productUpdateMock).not.toHaveBeenCalled();
    expect(orderDeleteMock).not.toHaveBeenCalled();
  });
});
