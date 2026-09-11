import { OrderService } from "@/services/order.service";
import type { OrderStatus } from "@/constants/order";
import type { CheckoutInput } from "@/validations/order.validation";

export class OrderController {
  private service = new OrderService();

  checkout(userId: string, data: CheckoutInput) {
    return this.service.checkout(userId, data);
  }

  getMyOrders(userId: string) {
    return this.service.getMyOrders(userId);
  }

  getById(userId: string, id: string) {
    return this.service.getById(userId, id);
  }

  payMine(userId: string, id: string) {
    return this.service.payMine(userId, id);
  }

  cancelMine(userId: string, id: string) {
    return this.service.cancelMine(userId, id);
  }

  updateStatus(userId: string, id: string, status: OrderStatus) {
    return this.service.updateStatus(userId, id, status);
  }

  getAllAdmin(status?: string) {
    return this.service.getAllAdmin(status);
  }

  getFinance() {
    return this.service.getFinance();
  }
}
