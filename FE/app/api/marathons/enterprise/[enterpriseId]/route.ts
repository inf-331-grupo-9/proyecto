import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { enterpriseId: string } }
) {
  try {
    const { enterpriseId } = params;
    
    const response = await fetch(`http://localhost:3001/races/enterprise/${enterpriseId}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch enterprise marathons" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 