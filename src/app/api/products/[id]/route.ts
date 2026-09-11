import { NextRequest } from "next/server";

import { ProductController } from "@/controllers/product.controller";

import {
  updateProductSchema,
} from "@/validations/product.validation";

import { ApiResponse } from "@/utils/api-response";

const controller = new ProductController();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const data = await controller.getById(id);

    return ApiResponse.success(data);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const data = updateProductSchema.parse(body);

    const product = await controller.update(id, data);

    return ApiResponse.success(product);
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

    await controller.delete(id);

    return ApiResponse.success({
      message: "Deleted",
    });
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}