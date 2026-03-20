/**
 * Scene 1 — "An AI Agent Thinks, Acts & Remembers"
 * Visual: Hexagon robot icon assembles via stroke-dashoffset, then three
 * feature badges spring in with stagger.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneLayout } from "../components/SceneLayout";
import { ACCENT, ACCENT_DIM, BG, CARD_BG, GREEN, MUTED, TEXT } from "../constants";

const BADGES = [
  { icon: "🧠", label: "Thinks", delay: 35 },
  { icon: "⚡", label: "Acts",   delay: 47 },
  { icon: "💾", label: "Remembers", delay: 59 },
];

const HEX_SIZE = 200;
const HEX_PATH = (() => {
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 6;
    return [HEX_SIZE * Math.cos(a), HEX_SIZE * Math.sin(a)];
  });
  return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ") + " Z";
})();
const HEX_LENGTH = 6 * HEX_SIZE; // approx perimeter

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hex draw animation
  const drawSpr = spring({ fps, frame: Math.max(0, frame - 5), config: { damping: 200 } });
  const dashOffset = interpolate(drawSpr, [0, 1], [HEX_LENGTH, 0]);

  // Inner circle pop
  const innerSpr = spring({ fps, frame: Math.max(0, frame - 20), config: { damping: 200 } });

  // Eye blinks
  const eyeSpr = spring({ fps, frame: Math.max(0, frame - 28), config: { damping: 200 } });

  // Outer glow pulse
  const glowOpacity = interpolate(frame, [0, 30, 60, 90], [0, 0.3, 0.15, 0.3], { extrapolateRight: "clamp" });

  return (
    <SceneLayout
      headline="An AI Agent Thinks, Acts & Remembers"
      body="Unlike regular AI that just answers questions, an agent perceives its environment, plans, takes real actions with tools, and learns from results."
      accentWord="Thinks, Acts"
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 48 }}>
        {/* Robot icon */}
        <div style={{ position: "relative", width: 420, height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(99,102,241,${glowOpacity}) 0%, transparent 70%)`,
            }}
          />
          <svg width={420} height={420} viewBox="-210 -210 420 420">
            {/* Outer hex */}
            <path
              d={HEX_PATH}
              fill="none"
              stroke={ACCENT}
              strokeWidth={4}
              strokeDasharray={HEX_LENGTH}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Inner circle */}
            <circle
              cx={0}
              cy={0}
              r={interpolate(innerSpr, [0, 1], [0, 130])}
              fill={ACCENT_DIM}
              stroke={ACCENT}
              strokeWidth={2}
              opacity={innerSpr}
            />
            {/* Face: eyes */}
            <circle cx={-38} cy={-10} r={interpolate(eyeSpr, [0, 1], [0, 16])} fill={ACCENT} opacity={eyeSpr} />
            <circle cx={38} cy={-10} r={interpolate(eyeSpr, [0, 1], [0, 16])} fill={ACCENT} opacity={eyeSpr} />
            {/* Face: mouth line */}
            <line
              x1={-36}
              y1={42}
              x2={36}
              y2={42}
              stroke={ACCENT}
              strokeWidth={5}
              strokeLinecap="round"
              opacity={eyeSpr}
            />
            {/* Antenna */}
            <line
              x1={0}
              y1={-130}
              x2={0}
              y2={-165}
              stroke={ACCENT}
              strokeWidth={3}
              opacity={innerSpr}
            />
            <circle cx={0} cy={-175} r={10} fill={ACCENT} opacity={innerSpr} />
          </svg>
        </div>

        {/* Feature badges */}
        <div style={{ display: "flex", flexDirection: "row", gap: 24 }}>
          {BADGES.map(({ icon, label, delay }) => {
            const spr = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 200 } });
            const scale = interpolate(spr, [0, 1], [0.4, 1]);
            return (
              <div
                key={label}
                style={{
                  opacity: spr,
                  transform: `scale(${scale})`,
                  background: CARD_BG,
                  border: `1.5px solid ${ACCENT}44`,
                  borderRadius: 20,
                  padding: "20px 28px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 10,
                  minWidth: 160,
                }}
              >
                <span style={{ fontSize: 44 }}>{icon}</span>
                <span style={{ fontSize: 28, fontWeight: 600, color: TEXT }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </SceneLayout>
  );
};
