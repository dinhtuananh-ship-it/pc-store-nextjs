import { prisma } from "@/lib/prisma";
import { REVENUE_STATUSES, type OrderStatus } from "@/constants/order";
import type { CheckoutInput } from "@/validations/order.validation";

function generateCode(): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `PC-${time}-${rand}`;
}

export class OrderRepository {
  // Tạo đơn từ giỏ hàng (transaction: tạo đơn + trừ kho + xóa giỏ)
  async createFromCart(userId: string, data: CheckoutInput) {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: { include: { product: { include: { images: true } } } },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Giỏ hàng trống, không thể đặt hàng");
    }

    for (const item of cart.items) {
      if (item.quantity > item.product.stock) {
        throw new Error(
          `Sản phẩm "${item.product.name}" chỉ còn ${item.product.stock} sản phẩm`
        );
      }
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shippingFee = 0;
    const total = subtotal + shippingFee;
    const status = data.paymentMethod === "COD" ? "PENDING" : "PAID";

    // Tạo mã đơn duy nhất (thử lại nếu trùng)
    let code = generateCode();
    for (let i = 0; i < 5; i++) {
      const existed = await prisma.order.findUnique({ where: { code } });
      if (!existed) break;
      code = generateCode();
    }

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          code,
          userId,
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          note: data.note,
          paymentMethod: data.paymentMethod,
          status,
          subtotal,
          shippingFee,
          total,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              imageUrl: item.product.images[0]?.imageUrl ?? null,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    return order;
  }

  findByUser(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: { include: { role: true } },
      },
    });
  }

  findAllAdmin(status?: string) {
    return prisma.order.findMany({
      where: status ? { status } : undefined,
      include: { items: true, user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  // Đổi trạng thái (hủy đơn PENDING/PAID thì hoàn kho)
  async updateStatus(id: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (
      status === "CANCELLED" &&
      (order.status === "PENDING" || order.status === "PAID")
    ) {
      await prisma.$transaction(async (tx) => {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
        await tx.order.update({ where: { id }, data: { status } });
      });
    } else {
      await prisma.order.update({ where: { id }, data: { status } });
    }

    return this.findById(id);
  }

  async financeStats() {
    const [byStatus, revenueAgg, todayAgg, totalOrders] = await Promise.all([
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
        _sum: { total: true },
      }),
      prisma.order.aggregate({
        where: { status: { in: [...REVENUE_STATUSES] } },
        _sum: { total: true },
        _count: { _all: true },
      }),
      prisma.order.aggregate({
        where: {
          status: { in: [...REVENUE_STATUSES] },
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
        _sum: { total: true },
        _count: { _all: true },
      }),
      prisma.order.count(),
    ]);

    return {
      totalOrders,
      totalRevenue: revenueAgg._sum.total ?? 0,
      paidOrders: revenueAgg._count._all,
      todayRevenue: todayAgg._sum.total ?? 0,
      todayOrders: todayAgg._count._all,
      byStatus: byStatus.map((row) => ({
        status: row.status,
        count: row._count._all,
        revenue: row._sum.total ?? 0,
      })),
    };
  }
}
