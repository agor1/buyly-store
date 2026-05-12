import { prisma } from "../lib/prisma.js";
import { OrderData, OrderStatus } from "../types/order.types.js";

// GET all orders with user and product details
export const getOrders = async () => {
  return await prisma.order.findMany({
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
  });
};

// CREATE new order
export const createOrder = async ({
  userId,
  shippingAddress,
  shippingType,
  paymentType,
  items,
}: OrderData) => {
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: items.map((item) => item.productId),
      },
    },
  });

  const totalPrice = items.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + (product?.price.toNumber() || 0) * item.quantity;
  }, 0);

  const order = await prisma.order.create({
    data: {
      user_id: userId,
      total_price: totalPrice,
      shipping_address: shippingAddress,
      shipping_type: shippingType,
      payment_type: paymentType,
      order_items: {
        create: items.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          return {
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: product?.price || 0,
          };
        }),
      },
    },
    include: {
      order_items: {
        include: {
          product: true,
        },
      },
    },
  });

  return order;
};

// UPDATE order status
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
) => {
  return await prisma.order.update({
    where: { id: orderId },
    data: { status },
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
