import { NextRequest } from "next/server";
import { OrderController } from "@/controllers/order.controller";
import { updateOrderSchema } from "@/validations/order.validation";
import { ApiResponse } from "@/utils/api-response";

const controller = new OrderController();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return ApiResponse.error("Vui lòng đăng nhập", 401);
    }

    const { id } = await params;

    const order = await controller.getById(userId, id);

    return ApiResponse.success(order);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}

type ActionBody = {
  action?: "pay" | "cancel";
  status?: string;
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return ApiResponse.error("Vui lòng đăng nhập", 401);
    }

    const { id } = await params;
    const body = (await req.json()) as ActionBody;

    // Khách: thanh toán giả lập / hủy đơn của mình
    if (body.action === "pay") {
      const order = await controller.payMine(userId, id);
      return ApiResponse.success(order);
    }

    if (body.action === "cancel") {
      const order = await controller.cancelMine(userId, id);
      return ApiResponse.success(order);
    }

    // Admin: cập nhật trạng thái
    if (body.status) {
      const data = updateOrderSchema.parse({ status: body.status });
      const order = await controller.updateStatus(userId, id, data.status);
      return ApiResponse.success(order);
    }

    return ApiResponse.error("Thiếu action hoặc status");
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}
