import { NextResponse } from "next/server";
import { shopifyClient } from "@/services/shopify";

export const GET = async () => {
  const query = `
            query {
  orders(first: 10, reverse: true) {
    edges {
      node {
        id
        name
        createdAt
        displayFinancialStatus
        displayFulfillmentStatus
        lineItems(first: 1) {
          edges {
            node {
              quantity
              title
              name
              originalTotalSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
        fulfillments {
          status
          trackingInfo {
            number
            company
          }
        }
        shippingAddress {
          address1
          address2
          city
          company
          country
          firstName
          lastName
          phone
          name
          province
          zip
        }
        transactions {
          gateway
        }
        totalShippingPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalTaxSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        subtotalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        totalPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        returns(first: 5) {
          edges {
            node {
              id
              status
              totalQuantity
            }
          }
        }
      }
    }
  }
}
  `;

  try {
    const { data, errors } = await shopifyClient.request(query);

    if (errors) {
      console.log(JSON.stringify(errors), '00000000')
      return NextResponse.json({ errors }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data: data }, { status: 200 });
  } catch (err) {
    console.error("Shopify API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
};





// import shopify from "@/services/shopify";
// import { NextResponse } from "next/server";

// export const GET = async (req: Request, res: Response) => {
//   try {
//     // const sessions = await shopify.session.getCurrentSession(req, res);

//     // const client = new shopify.clients.Graphql({
//     //   session: {
//     //     shop: "example.myshopify.com",
//     //     accessToken: "your-access-token",
//     //     isActive: true,
//     //     scope: "read_products,write_orders",
//     //     id: "session-id",
//     //     expires: null,
//     //     isOnline: false,
//     //   },
//     // });
//     // const graphqlClient = getGraphqlClient(session);
//     // const sessionId = await shopify.session.getCurrentId({
//     //   isOnline: true,
//     //   rawRequest: req,
//     //   rawResponse: res,
//     // });
//     // console.log(sessionId, ";;;;;;");
//     // if (!sessionId) {
//     //   return NextResponse.json({
//     //     success: false,
//     //     error: "Session ID not found",
//     //   });
//     // }

//     // const session: Session | undefined = await shopify.sessionStorage.loadSession(sessionId);
//     // if (!session) {
//     //   return res.status(401).json({ error: "Session not found" });
//     // }
//   } catch (err) {
//     return NextResponse.json({
//       success: true,
//       error: err instanceof Error ? err?.message : err,
//     });
//   }
// };

// export const GET = async (req: Request, res: Response) => {
//   try {
//     // const shop = req.headers.get("x-shopify-shop")!;
//     // const accessToken = req.headers.get("x-shopify-access-token")!;

//     const shop = "prepdevstore.myshopify.com";
//     const accessToken = "shpua_b532b9dc745df9feae5d22b4626ffd86";

//     const query = `
//     {
//       orders(first: 5) {
//         edges {
//           node {
//             id
//             name
//             totalPriceSet {
//               shopMoney {
//                 amount
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//     const response = await fetch(
//       `https://${shop}/admin/api/2025-10/graphql.json`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-Shopify-Access-Token": accessToken,
//         },
//         body: JSON.stringify({ query }),
//       }
//     );

//     const data = await response.json();
//     console.log(data, 'llllll')
//     const returnData = data.body.data.orders.edges[0].node;
//     return new Response(JSON.stringify(returnData), { status: 200 });
//   } catch (err) {
//     return NextResponse.json({
//       success: true,
//       error: err instanceof Error ? err?.message : err,
//     });
//   }
// };
