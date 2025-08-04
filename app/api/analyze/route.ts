import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { request: userRequest } = await request.json();

    if (!userRequest) {
      return NextResponse.json(
        { error: "Request is required" },
        { status: 400 }
      );
    }

    const response = await fetch("http://0.0.0.0:8000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request: userRequest,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "External API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}