import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { userRequest, intent, type, context, question, placeholder } = await request.json();

    if (!userRequest || !question) {
      return NextResponse.json(
        { error: "User request and question are required" },
        { status: 400 }
      );
    }

    // Call the external API at localhost:8000
    const response = await fetch(`${process.env.EXTERNAL_API_BASE_URL}/answer/draft`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_request: userRequest,
        intent: intent || "",
        context: context || "",
        question: question,
        placeholder: placeholder || "",
      }),
    });

    if (!response.ok) {
      console.error("External API Error:", response.status);
      return NextResponse.json(
        { error: "External API error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      draftAnswer: data.answer,
      success: true
    });
  } catch (error) {
    console.error("Generate Answer API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}