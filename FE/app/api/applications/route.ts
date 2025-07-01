import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const raceId = searchParams.get("raceId");
    const runnerId = searchParams.get("runnerId");

    if (!raceId && !runnerId) {
      return NextResponse.json(
        { error: "Either raceId or runnerId is required" },
        { status: 400 }
      );
    }

    let url = "";
    if (raceId) {
      url = `${BACKEND_URL}/applications/race/${raceId}`;
    } else if (runnerId) {
      url = `${BACKEND_URL}/applications/user/${runnerId}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in applications GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { raceId, runnerId, runnerName } = body;

    if (!raceId || !runnerId || !runnerName) {
      return NextResponse.json(
        { error: "Race ID, runner ID, and runner name are required" },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/applications/${raceId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ runnerId, runnerName }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in applications POST:", error);
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
    const runnerId = searchParams.get("runnerId");

    if (!raceId || !runnerId) {
      return NextResponse.json(
        { error: "Race ID and runner ID are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BACKEND_URL}/applications/${raceId}/${runnerId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error in applications DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 