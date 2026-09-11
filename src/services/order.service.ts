import { OrderRepository } from "@/repositories/order.repository";
import type { OrderStatus } from "@/constants/order";
import type { CheckoutInput } from "@/validations/order.validation";

export class OrderService {
  private repository = new OrderRepository();

  checkout(userId: string, data: CheckoutInput) {
    return this.repository.createFromCart(userId, data);
  }

  getMyOrders(userId: string) {
    return this.repository.findByUser(userId);
  }

  async getById(userId: string, id: string) {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    const requester = await this.findUserWithRole(userId);
    const isAdmin = requester?.role?.name === "Admin";

    if (!isAdmin && order.userId !== userId) {
      throw new Error("Bạn không có quyền xem đơn hàng này");
    }

    const { user: _user, ...rest } = order;
    void _user;

    return rest;
  }

  // Khách: thanh toán giả lập đơn PENDING của mình
  async payMine(userId: string, id: string) {
    const order = await this.repository.findById(id);

    if (!order || order.userId !== userId) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.status !== "PENDING") {
      throw new Error("Đơn hàng không ở trạng thái chờ thanh toán");
    }

    return this.repository.updateStatus(id, "PAID");
  }

  // Khách: hủy đơn PENDING của mình
  async cancelMine(userId: string, id: string) {
    const order = await this.repository.findById(id);

    if (!order || order.userId !== userId) {
      throw new Error("Không tìm thấy đơn hàng");
    }

    if (order.status !== "PENDING") {
      throw new Error("Chỉ có thể hủy đơn đang chờ xác nhận");
    }

    return this.repository.updateStatus(id, "CANCELLED");
  }

  // Admin: đổi trạng thái bất kỳ
  async updateStatus(userId: string, id: string, status: OrderStatus) {
    const requester = await this.findUserWithRole(userId);

    if (requester?.role?.name !== "Admin") {
      throw new Error("Bạn không có quyền cập nhật đơn hàng");
    }

    return this.repository.updateStatus(id, status);
  }

  private async findUserWithRole(userId: string) {
    const { prisma } = await import("@/lib/prisma");
    return prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });
  }

  getAllAdmin(status?: string) {
    return this.repository.findAllAdmin(status);
  }

  getFinance() {
    return this.repository.financeStats();
  }
}
