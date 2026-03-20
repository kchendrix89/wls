import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import {
  ACCENT,
  BG,
  MUTED,
  SAFE_BOTTOM,
  SAFE_SIDE,
  SAFE_TOP,
  TEXT,
} from "../constants";

const fontFamily = "LiberationSans";
Promise.all([
  loadFont({ family: fontFamily, url: staticFile("LiberationSans-Regular.ttf"), weight: "400" }),
  loadFont({ family: fontFamily, url: staticFile("LiberationSans-Bold.ttf"), weight: "700" }),
]);

interface Props {
  children: React.ReactNode;
  headline: string;
  body: string;
  accentWord?: string; // word in headline to colorize
}

export const SceneLayout: React.FC<Props> = ({
  children,
  headline,
  body,
  accentWord,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headlineSpr = spring({
    fps,
    frame: Math.max(0, frame - 4),
    config: { damping: 200 },
  });
  const headlineY = interpolate(headlineSpr, [0, 1], [40, 0]);

  const bodySpr = spring({
    fps,
    frame: Math.max(0, frame - 14),
    config: { damping: 200 },
  });
  const bodyY = interpolate(bodySpr, [0, 1], [30, 0]);

  // Split headline around accentWord
  let headlineContent: React.ReactNode = headline;
  if (accentWord && headline.includes(accentWord)) {
    const [before, after] = headline.split(accentWord);
    headlineContent = (
      <>
        {before}
        <span style={{ color: ACCENT }}>{accentWord}</span>
        {after}
      </>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: BG,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        paddingTop: SAFE_TOP,
        paddingBottom: SAFE_BOTTOM,
        paddingLeft: SAFE_SIDE,
        paddingRight: SAFE_SIDE,
        boxSizing: "border-box",
        fontFamily,
      }}
    >
      {/* Visual area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 0,
        }}
      >
        {children}
      </div>

      {/* Text area */}
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            opacity: headlineSpr,
            transform: `translateY(${headlineY}px)`,
            fontSize: 58,
            fontWeight: 700,
            color: TEXT,
            lineHeight: 1.2,
            marginBottom: 20,
            letterSpacing: -1,
          }}
        >
          {headlineContent}
        </div>
        <div
          style={{
            opacity: bodySpr,
            transform: `translateY(${bodyY}px)`,
            fontSize: 34,
            fontWeight: 400,
            color: MUTED,
            lineHeight: 1.55,
          }}
        >
          {body}
        </div>
      </div>
    </div>
  );
};
