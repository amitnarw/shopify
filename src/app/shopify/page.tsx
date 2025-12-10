"use client";

import Link from "next/link";
import { useState } from "react";

interface ProductsAttributes {
  node: {
    id: string;
    name: string;
    createdAt: string;
    totalPriceSet: {
      shopMoney: {
        amount: string;
        currencyCode: string;
      };
    };
    displayFinancialStatus: string;
    displayFulfillmentStatus: string;
    lineItems: {
      edges: [
        {
          node: {
            quantity: number;
          };
        }
      ];
    };
    fulfillments: [];
  };
}

export default function Shopify() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState<ProductsAttributes[]>([]);
  const [webhooks, setWebhooks] = useState([]);

  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isLoadingWebhooks, setIsLoadingWebhooks] = useState(false);

  const getAllProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopify/products`
      );
      const result = await response.json();
      if (result?.success) {
        setProducts(result?.data?.products?.edges);
      } else {
        console.error(result?.error);
      }
    } catch (err) {
      console.error(err instanceof Error ? err?.message : err);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const getAllOrders = async () => {
    try {
      setIsLoadingOrders(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopify/orders`
      );
      const result = await response.json();
      if (result?.success) {
        setOrders(result?.data?.orders?.edges);
      } else {
        console.error(result?.error);
      }
    } catch (err) {
      console.error(err instanceof Error ? err?.message : err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const getAllWebhooks = async () => {
    try {
      setIsLoadingWebhooks(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopify/webhooks/list`
      );
      const result = await response.json();
      if (result?.success) {
        setWebhooks(result?.data?.webhooks);
      } else {
        console.error(result?.error);
      }
    } catch (err) {
      console.error(err instanceof Error ? err?.message : err);
    } finally {
      setIsLoadingWebhooks(false);
    }
  };

  const handleOpenOrderDetails = () => {};

  return (
    <div className="h-screen w-full flex flex-col gap-2 items-center justify-center">
      <p>Shopify Authenticated Successfully</p>
      <div className="flex flex-row gap-2">
        <button
          className="bg-black text-white rounded-xl p-2 px-4 cursor-pointer hover:scale-[1.05] hover:bg-black/80 duration-300"
          onClick={getAllProducts}
        >
          Get all Products
        </button>
        <button
          className="bg-black text-white rounded-xl p-2 px-4 cursor-pointer hover:scale-[1.05] hover:bg-black/80 duration-300"
          onClick={getAllOrders}
        >
          Get all Orders
        </button>
        <button
          className="bg-black text-white rounded-xl p-2 px-4 cursor-pointer hover:scale-[1.05] hover:bg-black/80 duration-300"
          onClick={getAllWebhooks}
        >
          Get all Webhooks
        </button>
      </div>
      <div>
        <p>PRODUCTS</p>
        <div className="flex overflow-y-auto">
          {products?.length > 0 ? (
            isLoadingProducts ? (
              <p>Loading ...</p>
            ) : (
              <div>{JSON.stringify(products)}</div>
            )
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
      <div>
        <p>ORDERS</p>
        <div className="flex overflow-y-auto">
          {isLoadingOrders ? (
            <p>Loading ...</p>
          ) : orders?.length > 0 ? (
            <div className="flex flex-col gap-2">
              {orders?.map((item) => {
                return (
                  <Link
                    key={item.node?.id}
                    className="p-2 rounded-xl bg-gray-100 flex flex-row gap-2 hover:bg-gray-200 duration-300 cursor-pointer"
                    href={`/shopify/${
                      item?.node?.id?.split("/")[
                        item?.node?.id?.split("/")?.length - 1
                      ]
                    }`}
                  >
                    <div className="flex flex-col">
                      <span>{item?.node?.name}</span>
                      <span>{item?.node?.id}</span>
                    </div>
                    <div className="flex flex-col">
                      <span>Total item:</span>
                      <span>
                        {item?.node?.lineItems?.edges?.[0]?.node?.quantity}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span>Payment status</span>
                      <span>{item?.node?.displayFinancialStatus}</span>
                    </div>
                    <div className="flex flex-col">
                      <span>Fulfillment status</span>
                      <span>{item?.node?.displayFulfillmentStatus}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
      <div>
        <p>WEBHOOKS</p>
        <div className="flex overflow-y-auto">
          {webhooks?.length > 0 ? (
            isLoadingWebhooks ? (
              <p>Loading ...</p>
            ) : (
              JSON.stringify(webhooks)
            )
          ) : (
            <p>-</p>
          )}
        </div>
      </div>
    </div>
  );
}
