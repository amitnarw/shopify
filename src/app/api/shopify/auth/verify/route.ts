import { NextResponse, type NextRequest } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";

export const GET = async (req: NextRequest, res: Response) => {
  try {
    const cookieStore = await cookies();

    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const hmac = searchParams.get("hmac");
    const host = searchParams.get("host");
    const shop = searchParams.get("shop");
    const timestamp = searchParams.get("timestamp");

    if (!code || !hmac || !host || !shop || !timestamp) {
      return NextResponse.json(
        {
          success: false,
          error:
            "code, hmac, host, shop or timestamp is missing from the redirect link",
        },
        { status: 400 }
      );
    }

    const secret = process.env.SHOPIFY_SECRET_KEY;
    const client_id = process.env.SHOPIFY_CLIENT_ID;
    const secret_key = process.env.SHOPIFY_SECRET_KEY;

    if (!secret || !client_id || !secret_key) {
      return NextResponse.json(
        {
          success: false,
          error: "Secret key or client id or secret key not found",
        },
        { status: 500 }
      );
    }

    const message =
      "code=" +
      code +
      "&" +
      "host=" +
      host +
      "&" +
      "shop=" +
      shop +
      "&" +
      "timestamp=" +
      timestamp;

    const generatedHMAC = crypto
      .createHmac("sha256", secret)
      .update(message)
      .digest("hex");

    if (generatedHMAC !== hmac) {
      return NextResponse.json(
        {
          success: false,
          error: "generated hmac does not match with the hmac from the shopify",
        },
        { status: 400 }
      );
    } else {
      const params = new URLSearchParams();
      params.append("client_id", client_id);
      params.append("client_secret", secret_key);
      params.append("code", code);
      const response = await fetch(
        `${process.env.SHOPIFY_SHOP_LINK}/admin/oauth/access_token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params.toString(),
        }
      );
      const result = await response.json();

      if (!result?.access_token) {
        return NextResponse.json(
          { success: false, error: "Access token not found in the result" },
          { status: 500 }
        );
      }
      cookieStore.set("shopify_access_token", result?.access_token, {
        httpOnly: true,
      });
      return NextResponse.redirect(new URL("/shopify", process.env.NEXT_PUBLIC_FRONTEND_URL));
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err?.message : err },
      { status: 500 }
    );
  }
};
