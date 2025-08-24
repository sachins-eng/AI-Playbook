import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { request_type, context, count = 3 } = body;

    // Validate required fields
    if (!request_type || !context) {
      return NextResponse.json(
        { error: "Missing required fields: request_type and context" },
        { status: 400 }
      );
    }

    // Call external API
    const response = await fetch(`${process.env.EXTERNAL_API_BASE_URL}/images/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request_type,
        context,
        count,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "External API request failed", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract the first regular URL from images list
    const firstImageUrl = data.images && data.images.length > 0 
      ? data.images[0].urls?.regular 
      : null;
    
    return NextResponse.json({
      ...data,
      firstImageUrl
    });
  } catch (error) {
    console.error("Image search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}