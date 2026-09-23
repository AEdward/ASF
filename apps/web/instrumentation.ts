import type { Instrumentation } from "next";

export const onRequestError: Instrumentation.onRequestError = async (err, request) => {
  const strapiUrl = process.env.STRAPI_URL || "http://localhost:1337";
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;

  try {
    await fetch(`${strapiUrl}/api/site-errors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data: {
          source: "server",
          message,
          path: request.path,
          stack,
        },
      }),
    });
  } catch {
    // never let error reporting itself crash the request
  }
};
