/**
 * Scene 2 — "Agents See, Think, Decide"
 * Visual: Left→Center→Right pipeline.
 * Input icons spring in → SVG arrows draw → Brain circle draws → Decision diamond appears.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneLayout } from "../components/SceneLayout";
import { ACCENT, CARD_BG, GREEN, MUTED, TEXT } from "../constants";

const INPUTS = [
  { icon: "👁️", label: "Vision",  delay: 10 },
  { icon: "💬", label: "Text",    delay: 20 },
  { icon: "📡", label: "Data",    delay: 30 },
];

// Brain circle radius
const BR = 110;
const BRAIN_CIRC = 2 * Math.PI * BR;

// Arrow: horizontal line 100px
const ARROW_LEN = 100;

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Arrow 1: input → brain
  const arr1 = spring({ fps, frame: Math.max(0, frame - 38), config: { damping: 200 } });
  const arrow1Dash = interpolate(arr1, [0, 1], [ARROW_LEN, 0]);

  // Brain draw
  const brainDraw = spring({ fps, frame: Math.max(0, frame - 50), config: { damping: 200 } });
  const brainDash = interpolate(brainDraw, [0, 1], [BRAIN_CIRC, 0]);
  const brainGlow = interpolate(brainDraw, [0, 1], [0, 1]);

  // Particles inside brain
  const numParticles = 5;

  // Arrow 2: brain → decision
  const arr2 = spring({ fps, frame: Math.max(0, frame - 80), config: { damping: 200 } });
  const arrow2Dash = interpolate(arr2, [0, 1], [ARROW_LEN, 0]);

  // Decision diamond
  const decSpr = spring({ fps, frame: Math.max(0, frame - 95), config: { damping: 200 } });
  const decScale = interpolate(decSpr, [0, 1], [0.2, 1]);

  return (
    <SceneLayout
      headline="Agents See, Think, Decide"
      body="The agent takes in data — text, APIs, sensor readings — and its LLM brain reasons through the next best step, like a chess player analyzing the board."
      accentWord="Think"
    >
      <svg width={960} height={720} viewBox="0 0 960 720">
        {/* ── INPUT COLUMN (x≈80) ── */}
        {INPUTS.map(({ icon, label, delay }, i) => {
          const spr = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 200 } });
          const y = 220 + i * 120;
          return (
            <g key={label} transform={`translate(80, ${y})`} opacity={spr} style={{ transform: `translate(80px, ${y}px) scale(${interpolate(spr, [0,1],[0.5,1])})` }}>
              {/* Card */}
              <rect x={-60} y={-40} width={120} height={80} rx={16} fill={CARD_BG} stroke={`${ACCENT}55`} strokeWidth={1.5} />
              {/* Icon (as text) */}
              <text x={0} y={-4} textAnchor="middle" fontSize={28}>{icon}</text>
              <text x={0} y={28} textAnchor="middle" fill={MUTED} fontSize={20} fontFamily="Inter, sans-serif" fontWeight={600}>{label}</text>
            </g>
          );
        })}

        {/* ── ARROW 1 (x 140→260) ── */}
        <line
          x1={250} y1={360} x2={370} y2={360}
          stroke={ACCENT} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={ARROW_LEN + 20}
          strokeDashoffset={arrow1Dash}
        />
        <polygon
          points={`${370 - interpolate(arr1,[0,1],[20,0])},350 ${370},360 ${370 - interpolate(arr1,[0,1],[20,0])},370`}
          fill={ACCENT}
          opacity={arr1}
        />

        {/* ── BRAIN CIRCLE (cx=480) ── */}
        {/* Glow */}
        <circle cx={480} cy={360} r={BR + 20}
          fill={`rgba(99,102,241,${interpolate(brainGlow,[0,1],[0,0.12])})`}
        />
        {/* Circle outline draws itself */}
        <circle
          cx={480} cy={360} r={BR}
          fill={`rgba(99,102,241,0.08)`}
          stroke={ACCENT}
          strokeWidth={3}
          strokeDasharray={BRAIN_CIRC}
          strokeDashoffset={brainDash}
        />
        {/* "LLM" label */}
        <text x={480} y={350} textAnchor="middle" fill={TEXT} fontSize={32} fontFamily="Inter, sans-serif" fontWeight={800} opacity={brainDraw}>LLM</text>
        <text x={480} y={385} textAnchor="middle" fill={MUTED} fontSize={20} fontFamily="Inter, sans-serif" fontWeight={400} opacity={brainDraw}>Brain</text>

        {/* Animated particles orbiting brain */}
        {Array.from({ length: numParticles }, (_, i) => {
          const angle = ((frame * 3 + i * 72) * Math.PI) / 180;
          const r = BR - 25;
          const px = 480 + r * Math.cos(angle);
          const py = 360 + r * Math.sin(angle);
          return (
            <circle key={i} cx={px} cy={py} r={5}
              fill={ACCENT}
              opacity={interpolate(brainGlow, [0, 1], [0, 0.7])}
            />
          );
        })}

        {/* ── ARROW 2 (x 590→710) ── */}
        <line
          x1={600} y1={360} x2={720} y2={360}
          stroke={ACCENT} strokeWidth={3} strokeLinecap="round"
          strokeDasharray={ARROW_LEN + 20}
          strokeDashoffset={arrow2Dash}
        />
        <polygon
          points={`${720 - interpolate(arr2,[0,1],[20,0])},350 ${720},360 ${720 - interpolate(arr2,[0,1],[20,0])},370`}
          fill={ACCENT}
          opacity={arr2}
        />

        {/* ── DECISION DIAMOND (cx=840) ── */}
        <g transform={`translate(840, 360)`} opacity={decSpr} style={{ transform: `translate(840px, 360px) scale(${decScale})` }}>
          <polygon
            points="0,-70 60,0 0,70 -60,0"
            fill={`rgba(34,197,94,0.15)`}
            stroke={`#22c55e`}
            strokeWidth={2.5}
          />
          <text y={-82} textAnchor="middle" fill={MUTED} fontSize={18} fontFamily="Inter, sans-serif">Decide</text>
          {/* Yes / No branches */}
          <line x1={0} y1={70} x2={-55} y2={130} stroke={`#22c55e`} strokeWidth={2} opacity={decSpr} />
          <line x1={0} y1={70} x2={55} y2={130} stroke={`#ef4444`} strokeWidth={2} opacity={decSpr} />
          <text x={-62} y={150} textAnchor="middle" fill={"#22c55e"} fontSize={18} fontFamily="Inter, sans-serif" fontWeight={600} opacity={decSpr}>Yes</text>
          <text x={62} y={150} textAnchor="middle" fill={"#ef4444"} fontSize={18} fontFamily="Inter, sans-serif" fontWeight={600} opacity={decSpr}>No</text>
        </g>
      </svg>
    </SceneLayout>
  );
};
