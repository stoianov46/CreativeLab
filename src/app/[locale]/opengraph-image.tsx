import { ImageResponse } from "next/og";

/**
 * Default share image for every page (proposal: OG images). Brand-only and
 * in Latin script on purpose: the built-in OG font has no Thai/Hebrew glyphs,
 * and a consistent brand card is what shows in chat previews anyway. Swap for
 * real photography once the client supplies it.
 */
export const alt = "CreativeLAB — creative advertising & marketing agency on Koh Phangan, Koh Samui and Koh Tao";
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
          padding: 80,
          background: "#141210",
          color: "#f7f4ef",
        }}
      >
        <div style={{ fontSize: 40, letterSpacing: -1 }}>CreativeLAB</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: -2, maxWidth: 900 }}>
            Creative advertising & marketing agency
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#c9a88f" }}>
            Koh Phangan · Koh Samui · Koh Tao
          </div>
        </div>
      </div>
    ),
    size
  );
}
