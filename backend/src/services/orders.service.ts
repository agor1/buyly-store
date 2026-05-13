import { prisma } from "../lib/prisma.js";
import { OrderData, OrderStatus } from "../types/order.types.js";

interface GetOrdersOptions {
  page: number;
  limit: number;
  search?: string;
}

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

// DELETE order with its items
export const deleteOrder = async (orderId: string) => {
  return await prisma.order.delete({
    where: { id: orderId },
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
