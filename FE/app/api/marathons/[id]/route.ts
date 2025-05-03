import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const fetchedData = await fetch(`http://localhost:3001/races/data/${id}`);
  const racesData = await fetchedData.json();

  if (!racesData) {
    return NextResponse.json({ error: "Marathon not found" }, { status: 404 });
  }

  return NextResponse.json(racesData);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

    const fetchedData = await fetch(`http://localhost:3001/races/data/${id}`);
    const racesData = await fetchedData.json();

    if (racesData == null) {
      return NextResponse.json(
        { error: "Marathon not found" },
        { status: 404 }
      );
    }

    if (!data.name || !data.location || !data.date || !data.organizer) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updatedMarathon = {
      ...racesData,
      name: data.name,
      location: data.location,
      date: data.date,
      organizer: data.organizer,
      description: data.description || "",
      link: data.link || "",
    };

    const updatedData = await fetch(`http://localhost:3001/races/data/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMarathon),
    });

    const retrievedData = await updatedData.json();

    return NextResponse.json(retrievedData);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  const fetchedData = await fetch(`http://localhost:3001/races/data/${id}`, {
    method: "DELETE",
  });

  console.log(fetchedData.status);

  if (fetchedData.status != 204) {
    return NextResponse.json({ error: "Marathon not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
