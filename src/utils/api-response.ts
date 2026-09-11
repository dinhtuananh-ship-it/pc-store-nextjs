import { NextResponse } from "next/server";

export class ApiResponse {
  static success<T>(data: T, status = 200) {
    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status }
    );
  }

  static error(message: string, status = 400) {
    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status }
    );
  }
}