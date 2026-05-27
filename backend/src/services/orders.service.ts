import { prisma } from "../lib/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import { OrderData, OrderStatus } from "../types/order.types.js";
import { BadRequestError, NotFoundError } from "../errors/app-error.js";
import { getEffectiveProductPrice } from "../utils/product-pricing.js";
import { getShippingOption } from "../constants/checkout-options.js";
import { sendOrderConfirmationEmail } from "./mail.service.js";

interface GetOrdersOptions {
  page: number;
  limit: number;
  search?: string;
}

type OrderItemStockData = {
  product_id: string;
  quantity: number;
};

const restockableStatuses: readonly string[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
];
const fulfilledStatuses: readonly string[] = [
  OrderStatus.SHIPPED,
  OrderStatus.DELIVERED,
];

const canRestoreOrderStock = (status: string) =>
  restockableStatuses.includes(status);

const isFulfilledOrder = (status: string) => fulfilledStatuses.includes(status);

const paymentLabels: Record<string, string> = {
  blik: "BLIK",
  card: "Karta platnicza",
  cash_on_delivery: "Platnosc przy odbiorze",
};

const restoreOrderItemsStock = async (
  tx: Prisma.TransactionClient,
  orderItems: OrderItemStockData[],
) => {
  for (const item of orderItems) {
    await tx.product.update({
      where: { id: item.product_id },
      data: {
        stock: {
          increment: item.quantity,
        },
      },
    });
  }
};

// GET all orders with user and product details
export const getOrders = async ({ page, limit, search }: GetOrdersOptions) => {
  const skip = (page - 1) * limit;
  const where = search
    ? {
        OR: [
          { id: { contains: search, mode: "insensitive" as const } },
          {
            user: {
              email: { contains: search, mode: "insensitive" as const },
            },
          },
        ],
      }
    : {};

  const [data, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
        order_items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
};

const orderDetailsInclude = {
  user: {
    select: {
      id: true,
      email: true,
      name: true,
    },
  },
  order_items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          image_url: true,
        },
      },
    },
  },
} satisfies Prisma.OrderInclude;

export const getOrderDetails = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderDetailsInclude,
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return order;
};

export const getMyOrderDetails = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      user_id: userId,
    },
    include: orderDetailsInclude,
  });

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return order;
};

// CREATE new order
export const createOrder = async ({
  userId,
  shippingAddress,
  shippingType,
  paymentType,
  items,
}: OrderData) => {
  const order = await prisma.$transaction(async (tx) => {
    const productIds = [...new Set(items.map((item) => item.productId))];
    const products = await tx.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestError("Nie znaleziono produktu z koszyka.");
    }

    const inactiveProduct = products.find((product) => !product.is_active);

    if (inactiveProduct) {
      throw new BadRequestError("Produkt nie jest juz dostepny.");
    }

    const productsById = new Map(
      products.map((product) => [product.id, product]),
    );

    const productsTotalPrice = items.reduce((sum, item) => {
      const product = productsById.get(item.productId);
      if (!product) {
        throw new BadRequestError("Nie znaleziono produktu z koszyka.");
      }

      return sum.add(getEffectiveProductPrice(product).mul(item.quantity));
    }, new Prisma.Decimal(0));
    const shippingOption = getShippingOption(shippingType);

    if (!shippingOption) {
      throw new BadRequestError("Nieprawidłowy sposób dostawy.");
    }

    const totalPrice = productsTotalPrice.add(shippingOption.price);

    for (const item of items) {
      const updatedProduct = await tx.product.updateMany({
        where: {
          id: item.productId,
          is_active: true,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updatedProduct.count !== 1) {
        throw new BadRequestError(
          "Brak wystarczającej ilości produktu w magazynie.",
        );
      }
    }

    const order = await tx.order.create({
      data: {
        user_id: userId,
        total_price: totalPrice,
        shipping_address: shippingAddress,
        shipping_type: shippingType,
        payment_type: paymentType,
        order_items: {
          create: items.map((item) => {
            const product = productsById.get(item.productId);
            if (!product) {
              throw new BadRequestError("Nie znaleziono produktu z koszyka.");
            }

            return {
              product_id: item.productId,
              quantity: item.quantity,
              unit_price: getEffectiveProductPrice(product),
            };
          }),
        },
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        user_id: userId,
        product_id: {
          in: productIds,
        },
      },
    });

    return order;
  });

  try {
    const shippingOption = getShippingOption(shippingType);

    await sendOrderConfirmationEmail({
      email: order.user.email,
      customerName: order.user.name,
      orderId: order.id,
      shippingAddress: order.shipping_address,
      shippingLabel: shippingOption?.label ?? order.shipping_type,
      paymentLabel: paymentLabels[order.payment_type] ?? order.payment_type,
      items: order.order_items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unit_price.toString(),
      })),
      totalPrice: order.total_price.toString(),
    });
  } catch (error) {
    console.error("Failed to send order confirmation email", error);
  }

  return order;
};

// UPDATE order status
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        order_items: {
          select: {
            product_id: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (
      order.status === OrderStatus.CANCELLED &&
      status !== OrderStatus.CANCELLED
    ) {
      throw new BadRequestError("Cancelled order cannot be reactivated.");
    }

    if (
      status === OrderStatus.CANCELLED &&
      order.status !== OrderStatus.CANCELLED
    ) {
      if (isFulfilledOrder(order.status)) {
        throw new BadRequestError(
          "Nie można anulować zrealizowanego zamówienia.",
        );
      }

      if (canRestoreOrderStock(order.status)) {
        await restoreOrderItemsStock(tx, order.order_items);
      }
    }

    return tx.order.update({
      where: { id: orderId },
      data: { status },
    });
  });
};

// DELETE order with its items
export const deleteOrder = async (orderId: string) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: {
        order_items: {
          select: {
            product_id: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (isFulfilledOrder(order.status)) {
      throw new BadRequestError("Nie można usunąć zrealizowanego zamówienia.");
    }

    if (canRestoreOrderStock(order.status)) {
      await restoreOrderItemsStock(tx, order.order_items);
    }

    return tx.order.delete({
      where: { id: orderId },
    });
  });
};

// GET my orders
export const getMyOrders = async (userId: string) => {
  return await prisma.order.findMany({
    where: { user_id: userId },
    include: {
      order_items: {
        include: {
          product: true,
        },
      },
    },
  });
};
