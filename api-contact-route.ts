import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { contactSchema } from "@/lib/validation";
import { jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid request body", 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError("Validation failed", 422, {
      fields: parsed.error.flatten().fieldErrors,
    });
  }

  const { fullName, email, company, interest, message } = parsed.data;

  // Persist message to DB (always, regardless of email delivery)
  const [row] = await db
    .insert(contactMessages)
    .values({
      fullName,
      email,
      company: company || null,
      interest,
      message,
    })
    .returning({ id: contactMessages.id });

  // Send email notification via Resend (if configured)
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "SARUR <noreply@sarur.app>";
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL ?? "admin@sarur.app";

  if (resendKey) {
    try {
      const resend = new Resend(resendKey);

      // Notify admin
      await resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: `[SARUR] New contact message — ${interest}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>From:</strong> ${fullName} &lt;${email}&gt;</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ""}
          <p><strong>Interest:</strong> ${interest}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left:3px solid #2c8a84;padding-left:12px;color:#555;">
            ${message.replace(/\n/g, "<br />")}
          </blockquote>
          <hr />
          <p style="color:#999;font-size:12px;">Message ID: ${row?.id}</p>
        `,
      });

      // Auto-reply to sender
      await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "We received your message — SARUR",
        html: `
          <h2>Hi ${fullName},</h2>
          <p>Thank you for reaching out to SARUR. We received your message and will get back to you within 1–2 business days.</p>
          <p>In the meantime, feel free to explore our <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://sarur.app"}/services">services marketplace</a>.</p>
          <br />
          <p>— The SARUR Team</p>
        `,
      });
    } catch (emailErr) {
      // Log but don't fail the request — message is already saved in DB
      console.error("[contact] Resend email failed:", emailErr);
    }
  } else {
    console.warn("[contact] RESEND_API_KEY not set — email notification skipped. Message saved to DB.");
  }

  return NextResponse.json({ success: true, id: row?.id }, { status: 201 });
}
