import { NextResponse } from "next/server";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_SHOP_LINK!.replace(
  /^https?:\/\//,
  ""
);
const SHOPIFY_TOKEN = "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";

export const GET = async () => {
  try {
    const response = await fetch(
      `https://${SHOPIFY_DOMAIN}/admin/api/2025-10/webhooks.json`,
      {
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
