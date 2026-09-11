import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          message: "Không có file",
        },
        { status: 400 }
      );
    }

    // Chuyển File thành Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Chuyển sang Base64
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload lên Cloudinary
    const result = await cloudinary.uploader.upload(base64, {
      folder: "pc-store",
    });

    return NextResponse.json({
      success: true,
      image: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Upload thất bại",
      },
      { status: 500 }
    );
  }
}