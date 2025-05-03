import { test, expect } from "@playwright/test";

test.describe("Marathon API", () => {
  test("GET /api/marathons should return all marathons", async ({
    request,
  }) => {
    const response = await request.get("/api/marathons");

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThanOrEqual(3);

    const marathon = data[0];
    expect(marathon).toHaveProperty("_id");
    expect(marathon).toHaveProperty("name");
    expect(marathon).toHaveProperty("location");
    expect(marathon).toHaveProperty("date");
    expect(marathon).toHaveProperty("organizer");
  });

  test("GET /api/marathons/:id should return a single marathon", async ({
    request,
  }) => {
    const allResponse = await request.get("/api/marathons");
    const marathons = await allResponse.json();
    const id = marathons[0]._id;

    const response = await request.get(`/api/marathons/${id}`);

    expect(response.status()).toBe(200);

    const marathon = await response.json();
    expect(marathon).toHaveProperty("_id", id);
    expect(marathon).toHaveProperty("name");
    expect(marathon).toHaveProperty("location");
    expect(marathon).toHaveProperty("date");
    expect(marathon).toHaveProperty("organizer");
  });

  test("POST /api/marathons should create a new marathon", async ({
    request,
  }) => {
    const newMarathon = {
      name: "API Test Marathon",
      location: "API Test Location",
      date: "2023-12-25",
      organizer: "API Test Organizer",
      description: "Created via API test",
    };

    const response = await request.post("/api/marathons", {
      data: newMarathon,
    });

    expect(response.status()).toBe(201);

    const createdMarathon = await response.json();
    expect(createdMarathon).toHaveProperty("_id");
    expect(createdMarathon).toHaveProperty("name", newMarathon.name);
    expect(createdMarathon).toHaveProperty("location", newMarathon.location);
    expect(createdMarathon).toHaveProperty("date", newMarathon.date);
    expect(createdMarathon).toHaveProperty("organizer", newMarathon.organizer);
    expect(createdMarathon).toHaveProperty(
      "description",
      newMarathon.description
    );
  });

  test("PUT /api/marathons/:id should update a marathon", async ({
    request,
  }) => {
    const newMarathon = {
      name: "Update Test Marathon",
      location: "Update Test Location",
      date: "2023-12-26",
      organizer: "Update Test Organizer",
    };

    const createResponse = await request.post("/api/marathons", {
      data: newMarathon,
    });
    const createdMarathon = await createResponse.json();

    const updatedData = {
      ...newMarathon,
      name: "Updated Marathon Name",
      description: "This marathon was updated",
    };

    const updateResponse = await request.put(
      `/api/marathons/${createdMarathon._id}`,
      { data: updatedData }
    );

    expect(updateResponse.status()).toBe(200);

    const updatedMarathon = await updateResponse.json();
    expect(updatedMarathon).toHaveProperty("_id", createdMarathon._id);
    expect(updatedMarathon).toHaveProperty("name", updatedData.name);
    expect(updatedMarathon).toHaveProperty(
      "description",
      updatedData.description
    );
  });

  test("DELETE /api/marathons/:id should delete a marathon", async ({
    request,
  }) => {
    const newMarathon = {
      name: "Delete Test Marathon",
      location: "Delete Test Location",
      date: "2023-12-27",
      organizer: "Delete Test Organizer",
    };

    const createResponse = await request.post("/api/marathons", {
      data: newMarathon,
    });
    const createdMarathon = await createResponse.json();

    const deleteResponse = await request.delete(
      `/api/marathons/${createdMarathon._id}`
    );

    expect(deleteResponse.status()).toBe(200);

    const getResponse = await request.get(
      `/api/marathons/${createdMarathon._id}`
    );
    expect(getResponse.status()).toBe(500);
  });
});
