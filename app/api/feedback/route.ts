import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message } = body;

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.FEEDBACK_FROM_EMAIL ?? "onboarding@resend.dev";
  const toEmail = "auraco.helpdesk@gmail.com";

  // Graceful no-op when key is not configured (e.g. local dev without .env.local)
  if (!apiKey) {
    console.warn(
      "[feedback] RESEND_API_KEY not set — message logged to console only:\n",
      { name, email, message }
    );
    return NextResponse.json({ ok: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const bodyText = [
      `Name: ${name ?? "(not provided)"}`,
      `Email: ${email ?? "(not provided)"}`,
      ``,
      `Message:`,
      message,
    ].join("\n");

    await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: "New TimelineDoc Feedback",
      text: bodyText,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[feedback] Failed to send email:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
