import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

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
    
    // Set playbook properties
    if (data.playbook) {
      data.playbook._id = uuidv4();
      data.playbook.type = type;
      data.playbook.context = context;
    }
    
    // Get image URL for the playbook
    try {
      const imageResponse = await fetch(`${process.env.EXTERNAL_API_BASE_URL}/images/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request_type: type,
          context: context,
          count: 3
        }),
      });

      if (imageResponse.ok) {
        const imageData = await imageResponse.json();
        console.log("Image Search API Response:", imageData);
        if (imageData.firstImageUrl && data.playbook) {
          data.playbook.imageUrl = imageData.firstImageUrl;
        }
      } else {
        console.warn("Image search failed, continuing without image");
      }
    } catch (imageError) {
      console.warn("Image search error, continuing without image:", imageError);
    }

    return NextResponse.json(data);
    
  } catch (error) {
    console.error("Playbook API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}