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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": SHOPIFY_TOKEN,
        },
        // body: JSON.stringify({
        //   webhook: {
        //     topic: "orders/create",
        //     // address: "https://unairily-semiarchitectural-donnette.ngrok-free.dev/api/shopify/webhooks/create-order",
        //     address: "https://9zszm619-8080.inc1.devtunnels.ms/api/auth/shopify/create-order-webhook",
        //     format: "json",
        //   },
        // }),
        body: JSON.stringify({
          webhook: {
            topic: "customers/data_request",
            // address: "https://unairily-semiarchitectural-donnette.ngrok-free.dev/api/shopify/webhooks/create-order",
            address: "https://api.staging.prepvia.com/webhooks/customers_data_request",
            format: "json",
          },
        }),
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
