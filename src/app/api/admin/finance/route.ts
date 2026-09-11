import { OrderController } from "@/controllers/order.controller";
import { ApiResponse } from "@/utils/api-response";

const controller = new OrderController();

export async function GET() {
  try {
    const stats = await controller.getFinance();

    return ApiResponse.success(stats);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}
