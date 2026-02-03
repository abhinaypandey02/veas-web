import { EMAIL_AUTH_ENDPOINT } from "../config";

export type AuthResponse = {
  accessToken?: string;
  refreshToken?: string;
};

export async function signUp(email: string, password: string) {
  const res = await fetch(EMAIL_AUTH_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Signup failed");
  }
  return (await res.json()) as AuthResponse;
}

export async function login(email: string, password: string) {
  const res = await fetch(EMAIL_AUTH_ENDPOINT, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Login failed");
  }
  return (await res.json()) as AuthResponse;
}

export async function logout() {
  await fetch(EMAIL_AUTH_ENDPOINT, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
}

export async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(EMAIL_AUTH_ENDPOINT, {
    method: "GET",
    headers: {
      Cookie: `refresh=${refreshToken}`,
    },
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Refresh failed");
  }
  return (await res.json()) as AuthResponse;
}
