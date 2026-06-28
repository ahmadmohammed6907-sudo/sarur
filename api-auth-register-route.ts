import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validation";
import { createSession } from "@/lib/auth";
import { handleApiError, parseRequestBody } from "@/lib/api";
import { UserService } from "@/services/UserService";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const userService = new UserService();

export async function POST(request: Request) {
  try {
    const body = await parseRequestBody(request);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 422 }
      );
    }

    const { fullName, email, password, userType } = parsed.data;

    const user = await userService.createUser({
      fullName,
      email,
      password,
      userType,
    });

    await createSession(user);

    logger.logAuthEvent("register", user.id, { userType });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          userType: user.userType,
          avatarUrl: user.avatarUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error("Registration failed", error);
    return handleApiError(error);
  }
}
