import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    const response = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${email}?truncateResponse=false`,
      {
        headers: {
          "hibp-api-key": `${process.env.HIBP_API}`,
        },
      }
    );
    if (!response.ok) {
      return NextResponse.json([]);
    }
    const breaches = await response.json();
    return NextResponse.json(breaches);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.error();
  }
}
