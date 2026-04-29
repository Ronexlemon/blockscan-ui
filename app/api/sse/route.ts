import { SSE_URL } from "@/app/constant/constant";

export async function GET() {
  const upstream = await fetch(SSE_URL, {
    headers: {
      Accept: "text/event-stream",
      "ngrok-skip-browser-warning": "true",
    },
  });

  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}