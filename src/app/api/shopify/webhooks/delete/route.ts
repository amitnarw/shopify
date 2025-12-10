import { NextResponse, type NextRequest } from "next/server";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_SHOP_LINK!.replace(
  /^https?:\/\//,
  ""
);
const SHOPIFY_TOKEN = "shpua_b532b9dc745df9feae5d22b4626ffd86";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    const response = await fetch(
      `https://${SHOPIFY_DOMAIN}/admin/api/2025-10/webhooks/${id}.json`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_TOKEN,
        },
      }
    );

    const result = await response.json();
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (err) {
    console.error("Shopify API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
};
