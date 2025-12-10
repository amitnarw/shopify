import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (req: NextRequest) => {
  try {
    const secret = process.env.SHOPIFY_SECRET_KEY;

    if (!secret) {
      return NextResponse.json(
        {
          success: false,
          error: "Secret key not found",
        },
        { status: 500 }
      );
    }

    const hmacHeader = req.headers.get("x-shopify-hmac-sha256");

    const rawBody = await req.text();

    const generatedHmac = crypto
      .createHmac("sha256", secret)
      .update(rawBody, "utf8")
      .digest("base64");

    if (generatedHmac !== hmacHeader) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid HMAC" },
        { status: 401 }
      );
    }

    const body = JSON.parse(rawBody);
    console.log(body, "------body------");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Shopify API error:", err);
    return NextResponse.json(
      { error: "Error in create/order webhook" },
      { status: 500 }
    );
  }
};
