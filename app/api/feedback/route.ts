import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("[feedback] route hit");

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, message } = body;
  console.log("[feedback] parsed body:", JSON.stringify({ name, email, message }));

  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
  console.log("[feedback] GOOGLE_APPS_SCRIPT_URL present:", !!scriptUrl);

  if (!scriptUrl) {
    console.warn("[feedback] GOOGLE_APPS_SCRIPT_URL is not set — feedback not stored.");
    return NextResponse.json({ ok: true });
  }

  const payload = {
    sheet: "Feedback",
    name: name?.trim() ?? "",
    email: email?.trim() ?? "",
    message: message.trim(),
    source: "footer_feedback",
    created_at: new Date().toISOString(),
  };

  const url = new URL(scriptUrl);
  url.searchParams.set("sheet", "Feedback");
  console.log("[feedback] posting to:", url.toString());
  console.log("[feedback] payload:", JSON.stringify(payload));

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log("[feedback] apps script status:", response.status);
    console.log("[feedback] apps script response:", responseText);

    if (response.ok) {
      console.log("[feedback] submission success");
      return NextResponse.json({ ok: true });
    } else {
      console.warn("[feedback] submission failed — non-OK status");
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }
  } catch (err) {
    console.error("[feedback] submission error:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
