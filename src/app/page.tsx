"use client";

export default function App() {
  const handleShopifyConnect = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/shopify/auth/create-url`
      );
      const result = await response.json();
      if (result?.success) {
        window.open(result?.data, "_blank");
      } else {
        console.error("Error: " + result?.error);
      }
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
      <p>Connect with Shopify</p>
      <button
        className="bg-black text-white rounded-xl p-2 px-4 cursor-pointer hover:scale-[1.1] hover:bg-black/80 duration-300"
        onClick={handleShopifyConnect}
      >
        Connect
      </button>
    </div>
  );
}
