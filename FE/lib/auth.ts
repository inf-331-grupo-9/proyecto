import type { User } from "./types";

const users: User[] = [];

const USERS_URL = "/api/users";
let currentUser: User | null = null;

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  const fetchedUser = await fetch(USERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (fetchedUser.status !== 200) {
    return { success: false, error: "Credenciales invalidas!" };
  }

  const resolvedData = await fetchedUser.json();

  if (!resolvedData) {
    return { success: false, error: "Credenciales invalidas!" };
  }

  currentUser = resolvedData;
  localStorage.setItem("currentUser", JSON.stringify(resolvedData));

  return { success: true, user: resolvedData };
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const fetchedUser = await fetch(USERS_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (fetchedUser.status === 409) {
    return { success: false, error: "Ya existe un usuario con este correo!" };
  }

  if (fetchedUser.status !== 200) {
    return { success: false, error: "Error generando el registro!" };
  }

  const resolvedUser = await fetchedUser.json();

  const newUser: User = {
    id: Date.now().toString(),
    name: resolvedUser.name,
    email: resolvedUser.email,
    password : resolvedUser.password
  };

  users.push(newUser);

  currentUser = newUser;
  localStorage.setItem("currentUser", JSON.stringify(newUser));

  return { success: true, user: newUser };
}

export async function logout(): Promise<void> {
  currentUser = null;
  localStorage.removeItem("currentUser");
}

export function getCurrentUser(): User | null {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      currentUser = JSON.parse(stored);
    }
  }
  return currentUser;
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
