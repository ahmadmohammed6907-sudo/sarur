import { db } from "@/db";
import { payments } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { AppError } from "@/lib/errors";

const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

// ── PayPal Auth ────────────────────────────────────────────────────────────

async function getPayPalToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new AppError(
      "PayPal credentials are not configured. Set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.",
      500,
      "PAYPAL_NOT_CONFIGURED"
    );
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const err = await res.text();
    throw new AppError(`PayPal auth failed: ${err}`, 502, "PAYPAL_AUTH_ERROR");
  }

  const data = await res.json();
  return data.access_token as string;
}

// ── Create Order ───────────────────────────────────────────────────────────

export interface CreatePayPalOrderInput {
  buyerId: string;
  sellerId: string;
  serviceId?: string;
  projectId?: string;
  /** Amount in US dollars (e.g. 49.99) */
  amount: number;
  currency?: string;
  description?: string;
}

export async function createPayPalOrder(input: CreatePayPalOrderInput) {
  const {
    buyerId,
    sellerId,
    serviceId,
    projectId,
    amount,
    currency = "USD",
    description = "SARUR Platform Service",
  } = input;

  const token = await getPayPalToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: currency,
            value: amount.toFixed(2),
          },
          description,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new AppError(`PayPal order creation failed: ${err}`, 502, "PAYPAL_ORDER_ERROR");
  }

  const order = await res.json();

  // Save pending payment record to DB
  const [payment] = await db
    .insert(payments)
    .values({
      buyerId,
      sellerId,
      serviceId: serviceId ?? null,
      projectId: projectId ?? null,
      amount: Math.round(amount * 100), // store in cents
      currency,
      status: "pending",
      provider: "paypal",
      providerOrderId: order.id,
    })
    .returning();

  return { paypalOrderId: order.id, paymentId: payment.id };
}

// ── Capture Order ──────────────────────────────────────────────────────────

export async function capturePayPalOrder(paypalOrderId: string) {
  const token = await getPayPalToken();

  const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const capture = await res.json();

  if (capture.status !== "COMPLETED") {
    // Mark payment as failed
    await db
      .update(payments)
      .set({ status: "failed", updatedAt: new Date() })
      .where(eq(payments.providerOrderId, paypalOrderId));

    throw new AppError("PayPal payment was not completed.", 402, "PAYPAL_CAPTURE_FAILED");
  }

  const captureId = capture.purchase_units?.[0]?.payments?.captures?.[0]?.id ?? null;

  // Mark payment as completed
  const [updated] = await db
    .update(payments)
    .set({
      status: "completed",
      providerCaptureId: captureId,
      updatedAt: new Date(),
    })
    .where(eq(payments.providerOrderId, paypalOrderId))
    .returning();

  return { payment: updated, capture };
}

// ── Admin queries ──────────────────────────────────────────────────────────

export async function listAllPayments(limit = 50) {
  return db
    .select()
    .from(payments)
    .orderBy(desc(payments.createdAt))
    .limit(limit);
}

export async function getPaymentById(id: string) {
  const [payment] = await db
    .select()
    .from(payments)
    .where(eq(payments.id, id))
    .limit(1);
  return payment ?? null;
}
