"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO(Sentry): Sentry.captureException(error) once @sentry/nextjs is wired up.
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui",
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          margin: 0,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <button onClick={reset} style={{ marginTop: 16, padding: "8px 20px" }}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
