import { NextResponse } from "next/server";
import { AuthController } from "@/controllers/auth.controller";
import { loginSchema } from "@/validations/login.validation";

const controller = new AuthController();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = loginSchema.parse(body);

    const user = await controller.login(data);

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Đã xảy ra lỗi",
      },
      {
        status: 400,
      }
    );
  }
}