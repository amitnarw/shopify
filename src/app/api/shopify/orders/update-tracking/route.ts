import { shopifyClient } from "@/services/shopify";
import { type NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { trackingNumber, carrierName, orderId } = await req.json();

    if (!trackingNumber || !carrierName || !orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Please send trackingNumber, carrierName and orderId",
        },
        { status: 400 }
      );
    }

    const query = `
    query {
      order(id: "${orderId}") {
        fulfillmentOrders (first:1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  `;

    const { data, errors } = await shopifyClient.request(query);

    if (errors) {
      return NextResponse.json(
        { success: false, error: errors },
        { status: 500 }
      );
    }
    console.log(JSON.stringify(data), data?.order?.fulfillmentOrders?.edges?.[0]?.node?.id, "1111");
    if (!data?.order?.fulfillmentOrders?.edges?.[0]?.node?.id) {
      return NextResponse.json(
        { success: false, error: "Fulfillment order id not found" },
        { status: 500 }
      );
    }

    const mutation = `
    mutation fulfillmentCreate($fulfillment: FulfillmentInput!, $message: String) {
      fulfillmentCreate(fulfillment: $fulfillment, message: $message) {
        fulfillment {
          id
          status
          trackingInfo {
            company
            number
            url
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

    const variables = {
    fulfillment: {
      lineItemsByFulfillmentOrder: [
        {
          fulfillmentOrderId: data?.order?.fulfillmentOrders?.edges?.[0]?.node?.id,
        },
      ],
      trackingInfo: {
        number: trackingNumber,
        company: carrierName,
      },
      notifyCustomer: true,
    },
    message: "Your order has been shipped!",
  };

    const { data: data2, errors: errors2 } = await shopifyClient.request(
      mutation,
      { variables }
    );

    if (errors2) {
      return NextResponse.json(
        { success: false, error: errors2 },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, data: data2 }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err?.message : err },
      { status: 500 }
    );
  }
};
