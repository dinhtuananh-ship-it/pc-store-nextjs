import { NextResponse } from "next/server";
import { DashboardController } from "@/controllers/dashboard.controller";

const controller = new DashboardController();

export async function GET() {
  try {
    const data = await controller.getStatistics();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Lỗi hệ thống",
      },
      {
        status: 500,
      }
    );
  }
}