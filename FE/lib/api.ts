import type { Marathon, MarathonInput } from "./types";

const API_URL = "/api/marathons";

export async function fetchMarathons(): Promise<Marathon[]> {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch marathons: ${response.status}`);
  }

  return response.json();
}

export async function fetchMarathon(id: string): Promise<Marathon> {
  const response = await fetch(`${API_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch marathon: ${response.status}`);
  }

  return response.json();
}

export async function createMarathon(data: MarathonInput): Promise<Marathon> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create marathon: ${response.status}`);
  }

  return response.json();
}

export async function updateMarathon(
  id: string,
  data: MarathonInput
): Promise<Marathon> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update marathon: ${response.status}`);
  }

  return response.json();
}

export async function deleteMarathon(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete marathon: ${response.status}`);
  }
}
