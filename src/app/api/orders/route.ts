import { NextRequest } from "next/server";
import { OrderController } from "@/controllers/order.controller";
import { ApiResponse } from "@/utils/api-response";

const controller = new OrderController();

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return ApiResponse.error("Vui lòng đăng nhập", 401);
    }

    const orders = await controller.getMyOrders(userId);

    return ApiResponse.success(orders);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}
