import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, use_case } = body as { email?: string; use_case?: string };

    const emailTrimmed = email?.trim() ?? "";
    const useCaseTrimmed = use_case?.trim() ?? "";

    // Skip storage if both fields are empty
    if (!emailTrimmed && !useCaseTrimmed) {
      return NextResponse.json({ ok: true });
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    if (!scriptUrl) {
      console.warn("GOOGLE_APPS_SCRIPT_URL is not set — lead not stored.");
      return NextResponse.json({ ok: true });
    }

    const payload = {
      sheet: "Leads",
      email: emailTrimmed,
      use_case: useCaseTrimmed,
      source: "export_modal",
      created_at: new Date().toISOString(),
    };

    const url = new URL(scriptUrl);
    url.searchParams.set("sheet", "Leads");

    await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Never block the client — log and return OK
    console.error("Lead submission error:", err);
    return NextResponse.json({ ok: true });
  }
}
