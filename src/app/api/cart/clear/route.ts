import { NextRequest } from "next/server";

import { CartController } from "@/controllers/cart.controller";

import { ApiResponse } from "@/utils/api-response";

const controller = new CartController();

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return ApiResponse.error("Thiếu userId");
    }

    const cart = await controller.getCart(userId);

    if (!cart) {
      return ApiResponse.success({
        message: "Giỏ hàng không tồn tại",
      });
    }

    await controller.clearCart(cart.id);

    return ApiResponse.success({
      message: "Đã xóa toàn bộ giỏ hàng",
    });
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}