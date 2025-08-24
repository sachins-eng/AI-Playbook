import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { intent, context, type } = body;
    
    if (!intent || !context || !type) {
      return NextResponse.json(
        { error: "Missing required fields: intent, context, type" },
        { status: 400 }
      );
    }

    // Call the external API
    const response = await fetch(`${process.env.EXTERNAL_API_BASE_URL}/playbook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent,
        context,
        type,
      }),
    });

    if (!response.ok) {
      console.error("External API Error:", response.status, response.statusText);
      return NextResponse.json(
        { error: "Failed to generate playbook" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Playbook API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}