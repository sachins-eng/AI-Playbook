import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { intent, type, context, responses } = body;
    
    if (!intent || !type || !context || !responses) {
      return NextResponse.json(
        { error: "Missing required fields: intent, type, context, responses" },
        { status: 400 }
      );
    }

    // Call the external API
    const response = await fetch("http://localhost:8000/context", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent,
        type,
        context,
        responses,
      }),
    });

    if (!response.ok) {
      console.error("External API Error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to process context request" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Context API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}