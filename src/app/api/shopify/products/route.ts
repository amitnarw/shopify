import { NextResponse } from "next/server";
import { shopifyClient } from "@/services/shopify";

export const GET = async () => {
  const query = `{
                    products(first: 250) {
                        edges {
                        node {
                            id
                            title
                            createdAt
                            productType
                            totalInventory
                            tracksInventory
                            featuredMedia {
                            mediaContentType
                            preview {
                                image {
                                altText
                                url
                                }
                            }
                            }
                            category {
                            id
                            fullName
                            name
                            }
                            variantsCount {
                            count
                            precision
                            }
                        }
                        }
                    }
                    }
                    `;
  try {
    const { data, errors } = await shopifyClient.request(query);

    if (errors) {
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
