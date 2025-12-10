import { NextResponse } from "next/server";

export const GET = (req: Request, res: Response) => {
  try {
    const authLink = `${process.env.SHOPIFY_SHOP_LINK}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_CLIENT_ID}&scope=${process.env.SHOPIFY_SCOPES}&redirect_uri=${process.env.SHOPIFY_REDIRECT_URL}`;
    return NextResponse.json(
      { success: true, data: authLink },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err?.message : err },
      { status: 500 }
    );
  }
};
