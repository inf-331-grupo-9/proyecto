import type { User, LoginInput, UserInput } from "./types";
import { login as loginApi, register as registerApi } from "./api";

const USER_KEY = 'marathon_user';

export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const user = await loginApi({ email, password });
    saveUser(user);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Invalid credentials" };
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: 'runner' | 'enterprise' = 'runner'
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const user = await registerApi({ name, email, password, role });
    saveUser(user);
    return { success: true, user };
  } catch (error) {
    return { success: false, error: "Registration failed" };
  }
}

export async function logout(): Promise<void> {
  removeUser();
}

export function getCurrentUser(): User | null {
  return getUser();
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}

export function saveUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getUser(): User | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export function removeUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(USER_KEY);
  }
}

export function isRunner(): boolean {
  const user = getUser();
  return user?.role === 'runner';
}

export function isEnterprise(): boolean {
  const user = getUser();
  return user?.role === 'enterprise';
}

export function getUserId(): string | null {
  const user = getUser();
  return user?._id || null;
}

export function getUserName(): string | null {
  const user = getUser();
  return user?.name || null;
}
