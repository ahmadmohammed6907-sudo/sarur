import { NextResponse } from "next/server";
import { getUserOr401, handleApiError, parseRequestBody } from "@/lib/api";
import { capturePayPalOrder } from "@/services/PaymentService";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  paypalOrderId: z.string().min(1, "paypalOrderId is required"),
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

    const result = await capturePayPalOrder(parsed.data.paypalOrderId);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return handleApiError(error);
  }
}
