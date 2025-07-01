import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(
  request: NextRequest,
  { params }: { params: { raceId: string; userId: string } }
) {
  try {
    const { raceId, userId } = params;

    const response = await fetch(
      `${BACKEND_URL}/ratings/${raceId}/user/${userId}`
    );
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in user rating GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { raceId: string; userId: string } }
) {
  try {
    const { raceId, userId } = params;

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
    console.error("Error in user rating DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 