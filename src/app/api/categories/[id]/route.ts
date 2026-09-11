import { NextResponse } from "next/server";
import { CategoryController } from "@/controllers/category.controller";
import { createCategorySchema } from "@/validations/category.validation";

const controller = new CategoryController();

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const category = await controller.getById(id);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Đã xảy ra lỗi",
      },
      { status: 404 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const data = createCategorySchema.parse(body);

    const category = await controller.update(id, data);

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Đã xảy ra lỗi",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await controller.delete(id);

    return NextResponse.json({
      success: true,
      message: "Xóa thành công",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Đã xảy ra lỗi",
      },
      { status: 400 }
    );
  }
}