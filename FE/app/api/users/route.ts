import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.email || !data.password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const actualuser = {
      email: data.email,
      password: data.password,
    };

    const fetchedData = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actualuser),
    });

    if (fetchedData.status !== 200) {
      return NextResponse.json(null, { status: 400 });
    }

    const retrievedData = await fetchedData.json();
    return NextResponse.json(retrievedData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.email || !data.password || !data.name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const actualuser = {
      email: data.email,
      password: data.password,
      name: data.name,
    };

    const fetchedData = await fetch("http://localhost:3001/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actualuser),
    });

    if (fetchedData.status === 409) {
      return NextResponse.json(null, { status: 409 });
    } else if (fetchedData.status === 400) {
      return NextResponse.json(null, { status: 400 });
    }

    const retrievedData = await fetchedData.json();
    return NextResponse.json(retrievedData, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}
