import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: { raceId: string } }
) {
  try {
    const { raceId } = params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let url = `${BACKEND_URL}/ratings/${raceId}`;
    if (userId) {
      url = `${BACKEND_URL}/ratings/${raceId}/user/${userId}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in race ratings GET:", error);
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
    const { raceId } = await params;
    const body = await request.json();
    const { userId, rating } = body;

    if (!userId || !rating) {
      return NextResponse.json(
        { error: "User ID and rating are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/ratings/${raceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, rating }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in race ratings POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 