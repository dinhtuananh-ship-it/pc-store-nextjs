import { NextRequest } from "next/server";
import { BrandController } from "@/controllers/brand.controller";
import { ApiResponse } from "@/utils/api-response";
import { createBrandSchema } from "@/validations/brand.validation";

const controller = new BrandController();

export async function GET() {
  const brands = await controller.findAll();

  return ApiResponse.success(brands);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data = createBrandSchema.parse(body);

    const brand = await controller.create(data);

    return ApiResponse.success(brand, 201);
  } catch (error) {
    return ApiResponse.error(
      error instanceof Error ? error.message : "Có lỗi xảy ra"
    );
  }
}