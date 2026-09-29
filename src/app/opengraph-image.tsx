import { ImageResponse } from "next/og";
import { OgCard } from "@/components/og-card";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — ${profile.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <OgCard eyebrow={profile.jobTitle} title={profile.name} subtitle={profile.pitch} />,
    size,
  );
}
