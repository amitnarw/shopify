import { createAdminApiClient } from "@shopify/admin-api-client";

const SHOPIFY_DOMAIN = process.env.SHOPIFY_SHOP_LINK!.replace(/^https?:\/\//, "");
const SHOPIFY_TOKEN = "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";
const API_VERSION = "2025-10";

if (!SHOPIFY_DOMAIN || !SHOPIFY_TOKEN) {
  throw new Error("Missing Shopify config (domain or token). Check your .env file.");
}

export const shopifyClient = createAdminApiClient({
  storeDomain: SHOPIFY_DOMAIN,
  accessToken: SHOPIFY_TOKEN,
  apiVersion: API_VERSION,
});
