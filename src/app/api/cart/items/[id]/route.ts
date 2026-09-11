import { NextRequest } from "next/server";

import { CartController } from "@/controllers/cart.controller";
import {
  updateCartItemSchema,
} from "@/validations/cart.validation";

import { ApiResponse } from "@/utils/api-response";

const controller = new CartController();

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const data = updateCartItemSchema.parse(body);

    const item = await controller.updateQuantity(id, data);

    return ApiResponse.success(item);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await controller.deleteItem(id);

    return ApiResponse.success({
      message: "Đã xóa sản phẩm khỏi giỏ hàng",
    });
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}