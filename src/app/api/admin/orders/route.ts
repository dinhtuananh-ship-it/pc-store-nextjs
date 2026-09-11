import { NextRequest } from "next/server";
import { OrderController } from "@/controllers/order.controller";
import { ApiResponse } from "@/utils/api-response";

const controller = new OrderController();

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status") || undefined;

    const orders = await controller.getAllAdmin(status);

    return ApiResponse.success(orders);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}
