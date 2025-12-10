import { shopifyClient } from "@/services/shopify";
import { type NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const global_id = searchParams.get("global_id");

    const query = `
                {
        order(id: "gid://shopify/Order/${global_id}") {
          id
          name
          email
          createdAt
          totalPriceSet {
          shopMoney {
            amount
            currencyCode
            }
          }
          displayFinancialStatus
          displayFulfillmentStatus
          lineItems(first: 10) {
            edges {
              node {
                title
                quantity
              }
            }
          }
          fulfillments {
            trackingInfo {
              number
              company
              url
            }
          }
        }
      }
`;

    const { data, errors } = await shopifyClient.request(query);

    if (errors) {
      return NextResponse.json({ errors }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err?.message : err },
      { status: 500 }
    );
  }
};
