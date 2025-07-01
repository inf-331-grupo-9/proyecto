import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raceId = searchParams.get("raceId");
    const userId = searchParams.get("userId");

    if (!raceId) {
      return NextResponse.json(
        { error: "Race ID is required" },
        { status: 400 }
      );
    }

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
    console.error("Error in ratings GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { raceId, userId, rating } = body;

    if (!raceId || !userId || !rating) {
      return NextResponse.json(
        { error: "Race ID, user ID, and rating are required" },
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
    console.error("Error in ratings POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raceId = searchParams.get("raceId");
    const userId = searchParams.get("userId");

    if (!raceId || !userId) {
      return NextResponse.json(
        { error: "Race ID and user ID are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/ratings/${raceId}/user/${userId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error in ratings DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 