const SESSION_KEY = "ak-bikes-admin-session";

const ADMIN_EMAIL = "ardhammanikanta763@gmail.com";
const ADMIN_PASSWORD = "9866055387";

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function setAdminLoggedIn(): void {
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function clearAdminSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function verifyAdminCredentials(
  email: string,
  password: string
): boolean {
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}

export function getAdminApiKey(): string {
  return process.env.NEXT_PUBLIC_ADMIN_KEY || "";
}
