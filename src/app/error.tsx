"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-5 text-center text-white">
      <h1 className="font-display text-3xl font-bold">Something went wrong</h1>
      <p className="mt-3 text-white/70">Sorry about that. Please try again.</p>
      <Button onClick={reset} className="mt-8">
        Try again
      </Button>
    </main>
  );
}
