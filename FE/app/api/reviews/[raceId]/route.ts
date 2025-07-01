import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: { raceId: string } }
) {
  try {
    const { raceId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let url = `${BACKEND_URL}/reviews/${raceId}`;
    if (userId) {
      url = `${BACKEND_URL}/reviews/${raceId}/user/${userId}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in race reviews GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { raceId: string } }
) {
  try {
    const { raceId } = params;
    const body = await request.json();
    const { userId, userName, comment } = body;

    if (!userId || !userName || !comment) {
      return NextResponse.json(
        { error: "User ID, user name, and comment are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/reviews/${raceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, userName, comment }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in race reviews POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 