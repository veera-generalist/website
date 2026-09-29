import { profile } from "@/data/profile";

// Shared layout for generated Open Graph images (rendered by next/og, inline styles only).
export function OgCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#16213A",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 28, color: "#F2C94C", textTransform: "uppercase", letterSpacing: 4 }}>
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
        <div style={{ fontSize: 32, color: "rgba(255,255,255,0.75)", lineHeight: 1.3 }}>
          {subtitle}
        </div>
      </div>
      <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)" }}>{profile.name}</div>
    </div>
  );
}
