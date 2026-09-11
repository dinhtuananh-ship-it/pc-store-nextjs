import { NextRequest } from "next/server";
import { OrderController } from "@/controllers/order.controller";
import { checkoutSchema } from "@/validations/order.validation";
import { ApiResponse } from "@/utils/api-response";

const controller = new OrderController();

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return ApiResponse.error("Vui lòng đăng nhập để đặt hàng", 401);
    }

    const body = await req.json();

    const data = checkoutSchema.parse(body);

    const order = await controller.checkout(userId, data);

    return ApiResponse.success(order, 201);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}
