import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  const fetchedData = await fetch("http://localhost:3001/races/data");
  const racesData = await fetchedData.json();
  return NextResponse.json(racesData);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.location || !data.date || !data.organizer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newMarathon = {
      name: data.name,
      location: data.location,
      date: data.date,
      organizer: data.organizer,
      description: data.description || "",
      link: data.link || "",
    };

    const fetchedData = await fetch("http://localhost:3001/races/data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMarathon),
    });

    const retrievedData = await fetchedData.json();

    return NextResponse.json(retrievedData, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
