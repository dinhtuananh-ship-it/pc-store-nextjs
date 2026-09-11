import { NextRequest } from "next/server";

import { ProductImageController } from "@/controllers/product-image.controller";

import { ApiResponse } from "@/utils/api-response";

const controller = new ProductImageController();

export async function GET(req: NextRequest) {
  try {
    const productId = req.nextUrl.searchParams.get("productId");

    if (!productId) {
      return ApiResponse.error("Thiếu productId");
    }

    const images = await controller.getByProduct(productId);

    return ApiResponse.success(images);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { productId, imageUrl, publicId } = body;

    if (!productId) {
      return ApiResponse.error("Thiếu productId");
    }

    if (!imageUrl) {
      return ApiResponse.error("Thiếu imageUrl");
    }

    if (!publicId) {
      return ApiResponse.error("Thiếu publicId");
    }

    const image = await controller.create(
      productId,
      imageUrl,
      publicId
    );

    return ApiResponse.success(image);
  } catch (e) {
    return ApiResponse.error(
      e instanceof Error ? e.message : "Error"
    );
  }
}