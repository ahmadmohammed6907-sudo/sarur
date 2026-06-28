import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const COOKIE_NAME = "sarur_session";
const TOKEN_TTL = "7d";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      "JWT_SECRET environment variable is required. Generate one with: openssl rand -base64 32"
    );
  }
  return new TextEncoder().encode(secret);
}

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  userType: "freelancer" | "client" | "admin";
  avatarUrl: string | null;
};

export type JWTPayload = SessionUser;

/** Hash a plaintext password. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/** Compare a plaintext password against a hash. */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Create a signed JWT and set it in an httpOnly cookie. */
export async function createSession(user: SessionUser): Promise<void> {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/** Verify the session token from the cookie and return the payload. */
export async function verifySession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/** Read the session token from a raw cookie header (used in middleware / routes). */
export async function verifySessionToken(token: string | undefined): Promise<JWTPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = COOKIE_NAME;

/** Clear the session cookie (logout). */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/** Resolve the current authenticated user from the DB (or null). */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await verifySession();
  if (!session) return null;
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      userType: users.userType,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.id, session.id))
    .limit(1);
  return user ?? null;
}

/** Require an authenticated user, or return null (for optional auth in pages). */
export async function getOptionalUser(): Promise<SessionUser | null> {
  return getCurrentUser();
}
