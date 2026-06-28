import { getCurrentUser, type SessionUser } from "./auth";
import { AuthenticationError, AuthorizationError, AppError, formatErrorResponse } from "./errors";

/**
 * Resolve the authenticated user, throwing 401 error if missing
 */
export async function getUserOr401(): Promise<
  { ok: true; user: SessionUser } | { ok: false; response: Response }
> {
  const user = await getCurrentUser();
  if (!user) {
    return {
      ok: false,
      response: Response.json(
        formatErrorResponse(new AuthenticationError("Unauthorized")),
        { status: 401 }
      ),
    };
  }
  return { ok: true, user };
}

/**
 * Require a specific role, throwing 403 error if insufficient permissions
 */
export async function requireRole(
  role: "freelancer" | "client" | "admin"
): Promise<{ ok: true; user: SessionUser } | { ok: false; response: Response }> {
  const result = await getUserOr401();
  if (!result.ok) return result;
  if (result.user.userType !== role && result.user.userType !== "admin") {
    return {
      ok: false,
      response: Response.json(
        formatErrorResponse(new AuthorizationError("Insufficient permissions")),
        { status: 403 }
      ),
    };
  }
  return result;
}

/**
 * Require any authenticated user
 */
export async function requireAuth(): Promise<
  { ok: true; user: SessionUser } | { ok: false; response: Response }
> {
  return getUserOr401();
}

/**
 * Format error response for API
 */
export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
  return Response.json({ error: message, ...extra }, { status });
}

/**
 * Format success response for API
 */
export function jsonOk(data: unknown, status = 200) {
  return Response.json(data, { status });
}

/**
 * Handle API errors and return appropriate response
 */
export function handleApiError(error: unknown): Response {
  if (error instanceof AppError) {
    return Response.json(error.toJSON(), { status: error.statusCode });
  }

  if (error instanceof Error) {
    const isDevelopment = process.env.NODE_ENV === "development";
    return Response.json(
      {
        error: isDevelopment ? error.message : "Internal server error",
        code: "INTERNAL_ERROR",
        statusCode: 500,
      },
      { status: 500 }
    );
  }

  return Response.json(
    {
      error: "An unknown error occurred",
      code: "UNKNOWN_ERROR",
      statusCode: 500,
    },
    { status: 500 }
  );
}

/**
 * Safely parse JSON request body
 */
export async function parseRequestBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new AppError("Invalid request body", 400, "INVALID_JSON");
  }
}
