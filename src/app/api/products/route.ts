import { NextRequest } from "next/server";

import { ProductController } from "@/controllers/product.controller";

import {
  createProductSchema,
} from "@/validations/product.validation";

import { ApiResponse } from "@/utils/api-response";

const controller = new ProductController();

export async function GET() {
  try {
    const data = await controller.getAll();

    return ApiResponse.success(data);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = createProductSchema.parse(body);

    const product = await controller.create(data);

    return ApiResponse.success(product, 201);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}