import { NextRequest } from "next/server";
import { BrandController } from "@/controllers/brand.controller";
import { ApiResponse } from "@/utils/api-response";
import { updateBrandSchema } from "@/validations/brand.validation";

const controller = new BrandController();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const brand = await controller.findById(id);

  return ApiResponse.success(brand);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const data = updateBrandSchema.parse(body);

    const brand = await controller.update(id, data);

    return ApiResponse.success(brand);
  } catch (error) {
    return ApiResponse.error(
      error instanceof Error ? error.message : "Có lỗi xảy ra"
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await controller.delete(id);

  return ApiResponse.success({
    message: "Xóa thành công",
  });
}