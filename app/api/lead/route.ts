import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("[lead] route hit");

  try {
    const body = await req.json();
    console.log("[lead] parsed body:", JSON.stringify(body));

    const { email, use_case } = body as { email?: string; use_case?: string };

    const emailTrimmed = email?.trim() ?? "";
    const useCaseTrimmed = use_case?.trim() ?? "";

    if (!emailTrimmed && !useCaseTrimmed) {
      console.log("[lead] both fields empty — skipping submission");
      return NextResponse.json({ ok: true });
    }

    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;
    console.log("[lead] GOOGLE_APPS_SCRIPT_URL present:", !!scriptUrl);

    if (!scriptUrl) {
      console.warn("[lead] GOOGLE_APPS_SCRIPT_URL is not set — lead not stored.");
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
    console.log("[lead] posting to:", url.toString());
    console.log("[lead] payload:", JSON.stringify(payload));

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log("[lead] apps script status:", response.status);
    console.log("[lead] apps script response:", responseText);

    if (response.ok) {
      console.log("[lead] submission success");
    } else {
      console.warn("[lead] submission failed — non-OK status");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] submission error:", err);
    return NextResponse.json({ ok: true });
  }
}
