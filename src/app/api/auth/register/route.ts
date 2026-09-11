import { NextResponse } from "next/server";
import { AuthController } from "@/controllers/auth.controller";
import { registerSchema } from "@/validations/auth.validation";

const controller = new AuthController();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = registerSchema.parse(body);

    const user = await controller.register(data);

    return NextResponse.json(
      {
        success: true,
        data: user,
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