import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";
import { handleApiError, parseRequestBody } from "@/lib/api";
import { UserService } from "@/services/UserService";
import { logger } from "@/lib/logger";
import { AuthenticationError } from "@/lib/errors";

export const runtime = "nodejs";

const userService = new UserService();

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { email, password } = parsed.data;

    const user = await userService.verifyUserPassword(email, password);
    if (!user) {
      logger.warn("Failed login attempt", "AUTH", { email });
      throw new AuthenticationError("Invalid email or password");
    }

    await createSession(user);

    logger.logAuthEvent("login", user.id);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    logger.error("Login failed", error);
    return handleApiError(error);
  }
}
