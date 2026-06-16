import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { url } = body as { url?: string };

  if (!url || typeof url !== "string") {
    return Response.json({ error: "Drop a URL in there — we need something to roast" }, { status: 400 });
  }

  // Normalize — add https:// if the user didn't include a protocol
  const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;

  // Basic URL validation — reject non-HTTP(S) and localhost targets
  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    return Response.json({ error: "That doesn't look like a real website — double-check the address" }, { status: 400 });
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    return Response.json({ error: "We only roast real websites — http and https only" }, { status: 400 });
  }
  if (["localhost", "127.0.0.1", "0.0.0.0", "::1"].includes(parsed.hostname)) {
    return Response.json({ error: "Nice try — we can't roast your localhost. Deploy it first" }, { status: 400 });
  }

  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    return Response.json({ error: "The roaster isn't plugged in yet — check back soon" }, { status: 503 });
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: normalized }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok) {
      return Response.json({ error: "The roast got burnt — something went wrong on our end. Try again" }, { status: 502 });
    }

    const data = await response.json();
    // n8n signals a Gemini-level error (overloaded, rate-limited, etc.)
    if (data.__error) {
      return Response.json({ error: data.error }, { status: 503 });
    }
    return Response.json(data);
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      return Response.json({ error: "This one's taking forever to load — your site might be the problem. Try again" }, { status: 504 });
    }
    return Response.json({ error: "Our roaster is taking a smoke break — give it a sec and try again" }, { status: 502 });
  }
}
