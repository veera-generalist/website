"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

// Referrers/utm sources that indicate a visit from an AI assistant (SPEC §10.6).
const aiSources = [
  "chatgpt.com",
  "chat.openai.com",
  "perplexity.ai",
  "claude.ai",
  "copilot.microsoft.com",
  "gemini.google.com",
  "you.com",
  "phind.com",
];

function detectAiSource(): string | null {
  const utm = new URLSearchParams(window.location.search).get("utm_source") ?? "";
  let referrer = "";
  try {
    referrer = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    // ignore malformed referrers
  }
  return aiSources.find((s) => utm.includes(s) || referrer.endsWith(s)) ?? null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!key) return;
    posthog.init(key, {
      api_host: host,
      capture_pageview: "history_change",
      person_profiles: "identified_only",
    });
    const aiSource = detectAiSource();
    if (aiSource) {
      // Session-scoped super properties: attached to every event in this visit.
      posthog.register_for_session({ ai_referral: true, ai_source: aiSource });
    }
  }, []);

  return <>{children}</>;
}
