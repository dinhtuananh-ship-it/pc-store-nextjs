import { NextResponse } from "next/server";
import { CategoryController } from "@/controllers/category.controller";
import { createCategorySchema } from "@/validations/category.validation";

const controller = new CategoryController();

export async function GET() {
  try {
    const data = await controller.getAll();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Đã xảy ra lỗi",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = createCategorySchema.parse(body);

    const category = await controller.create(data);

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 }
    );
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