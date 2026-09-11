import { NextRequest } from "next/server";

import { CartController } from "@/controllers/cart.controller";
import {
  addToCartSchema,
} from "@/validations/cart.validation";

import { ApiResponse } from "@/utils/api-response";

const controller = new CartController();

export async function GET(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return ApiResponse.error("Thiếu userId");
    }

    const cart = await controller.getCart(userId);

    return ApiResponse.success(cart);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get("x-user-id");

    if (!userId) {
      return ApiResponse.error("Thiếu userId");
    }

    const body = await req.json();

    const data = addToCartSchema.parse(body);

    const cart = await controller.addToCart(userId, data);

    return ApiResponse.success(cart);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}