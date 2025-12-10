"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface DetailsAttributes {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  displayFinancialStatus: string;
  displayFulfillmentStatus: string;
  totalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  lineItems: {
    edges: [
      {
        node: {
          title: string;
          quantity: number;
        };
      }
    ];
  };
  fulfillments: [];
}

const page = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState<DetailsAttributes>();

  const [trackingDetails, setTrackingDetails] = useState({
    trackingNumber: "",
    carrierName: ""
  });
  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    getId();
  }, []);

  const getId = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopify/orders/single?global_id=${id}`
      );
      const result = await response.json();
      if (result?.success) {
        setDetails(result?.data?.order);
      } else {
        console.error(result?.error);
        setError(result?.error);
      }
    } catch (err) {
      console.error(err instanceof Error ? err?.message : err);
      setError(err instanceof Error ? err?.message : JSON.stringify(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavingTrackingData = async () => {
    try {
      setIsSaving(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopify/orders/update-tracking`,
        {
          method: "POST",
          body: JSON.stringify({...trackingDetails, orderId: details?.id}),
        }
      );
      const result = await response.json();
      if(!result?.success){
        setError(result?.error?.graphQLErrors?.[0]?.message);
      }

      window.alert("Tracking details added")
    } catch (err) {
      console.error(err instanceof Error ? err?.message : err);
      setError(err instanceof Error ? err?.message : JSON.stringify(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="max-w-2xl m-auto h-full flex flex-col gap-2 justify-center">
        {isLoading ? (
          <p>Loading ...</p>
        ) : !details ? (
          <p>No data found</p>
        ) : (
          <div className="flex flex-col gap-2">
            <div>
              <p>Order Id/name: </p>
              <p>{details?.name}</p>
            </div>

            <div>
              <p>Order Global Id: </p>
              <p>{details?.id}</p>
            </div>

            <div>
              <p>Email: </p>
              <p>{details?.email}</p>
            </div>

            <div>
              <p>Email: </p>
              <p>{details?.email}</p>
            </div>

            <div>
              <p>Items: </p>
              <p>{JSON.stringify(details?.lineItems)}</p>
            </div>

            <div>
              <p>Payment status: </p>
              <p>{details?.displayFinancialStatus}</p>
            </div>

            <div>
              <p>Fulfillment status: </p>
              <p>{details?.displayFulfillmentStatus}</p>
            </div>

            <div>
              <p>Total amount: </p>
              <p>
                {details?.totalPriceSet?.shopMoney?.currencyCode}{" "}
                {details?.totalPriceSet?.shopMoney?.amount}
              </p>
            </div>
            <div>
              <label htmlFor="trackingNumber">Tracking number:</label>
              <input
                id="trackingNumber"
                name="trackingNumber"
                className="bg-gray-100 p-2 rounded-xl"
                value={trackingDetails?.trackingNumber}
                onChange={(e) =>
                  setTrackingDetails((prev) => ({
                    ...prev,
                    trackingNumber: e.target.value,
                  }))
                }
              ></input>
            </div>
            <div>
              <label htmlFor="carrierName">Tracking number:</label>
              <input
                id="carrierName"
                name="carrierName"
                className="bg-gray-100 p-2 rounded-xl"
                value={trackingDetails?.carrierName}
                onChange={(e) =>
                  setTrackingDetails((prev) => ({
                    ...prev,
                    carrierName: e.target.value,
                  }))
                }
              ></input>
            </div>
            <div>
              {isSaving ? (
                <p>Saving ...</p>
              ) : (
                <button
                  className="bg-black text-white rounded-xl p-2 px-5 cursor-pointer hover:scale-[1.05] duration-300"
                  onClick={handleSavingTrackingData}
                >
                  Add tracking number and carrier
                </button>
              )}
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
