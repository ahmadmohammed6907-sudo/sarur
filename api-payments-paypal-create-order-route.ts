import { NextResponse } from "next/server";
import { getUserOr401, handleApiError, parseRequestBody } from "@/lib/api";
import { createPayPalOrder } from "@/services/PaymentService";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  sellerId: z.string().uuid("sellerId must be a valid UUID"),
  serviceId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
  amount: z.number().positive("amount must be positive"),
  currency: z.string().length(3).default("USD"),
  description: z.string().max(255).optional(),
});

export async function POST(request: Request) {
  try {
    const auth = await getUserOr401();
    if (!auth.ok) return auth.response;

    const body = await parseRequestBody(request);
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const result = await createPayPalOrder({
      buyerId: auth.user.id,
      ...parsed.data,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
