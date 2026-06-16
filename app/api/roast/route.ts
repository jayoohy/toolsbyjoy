import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { url } = body as { url?: string };

  if (!url || typeof url !== "string") {
    return Response.json({ error: "URL is required" }, { status: 400 });
  }

  // Basic URL validation — reject non-HTTP(S) and localhost targets
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return Response.json({ error: "Only http/https URLs are supported" }, { status: 400 });
  }
  if (["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(parsed.hostname)) {
    return Response.json({ error: "Local addresses are not supported" }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json({ error: "Analysis service not configured" }, { status: 503 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok) {
      return Response.json({ error: "Analysis failed — try again" }, { status: 502 });
    }

    const data = await response.json();
    // n8n signals a Gemini-level error (overloaded, rate-limited, etc.)
    if (data.__error) {
      return Response.json({ error: data.error }, { status: 503 });
    }
    return Response.json(data);
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return Response.json({ error: "Analysis timed out — the site may be slow to load" }, { status: 504 });
    }
    return Response.json({ error: "Could not reach analysis service" }, { status: 502 });
  }
}
