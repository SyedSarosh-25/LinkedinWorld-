import { ImageResponse } from "next/og";

export const alt = "Linkin World: we speak business and technology";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f6f7f9",
          color: "#1e2228",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 36, fontWeight: 700 }}>
          <svg width="66" height="44" viewBox="0 0 30 20" fill="none" strokeWidth="2.4">
            <circle cx="10" cy="10" r="7" stroke="#8c959e" />
            <circle cx="20" cy="10" r="7" stroke="#0e6f80" />
          </svg>
          Linkin World
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>We speak business</div>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>and technology.</div>
        </div>
        <div style={{ fontSize: 30, color: "#4a525b" }}>Cybersecurity · Cloud · Networks · Automation · Islamabad, worldwide</div>
      </div>
    ),
    size,
  );
}
