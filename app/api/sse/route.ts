// import { SSE_URL } from "@/app/constant/constant";

// export async function GET() {
//   const upstream = await fetch(SSE_URL, {
//     headers: {
//       Accept: "text/event-stream",
//      // "ngrok-skip-browser-warning": "true",
//     },
//   });

//   return new Response(upstream.body, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       "Connection": "keep-alive",
//       "Access-Control-Allow-Origin": "*",
//     },
//   });
// }

import { SSE_URL } from "@/app/constant/constant";

export const dynamic = 'force-dynamic'; // Prevent Next.js from caching the stream

export async function GET() {
  try {
    const upstream = await fetch(SSE_URL, {
      headers: {
        Accept: "text/event-stream",
      },
      // Important: Tell Next.js not to cache this fetch request
      cache: 'no-store', 
    });

    if (!upstream.ok) {
      return new Response(`Upstream error: ${upstream.statusText}`, { status: upstream.status });
    }

    return new Response(upstream.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("SSE Fetch Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

