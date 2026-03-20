/**
 * Scene 4 — "Memory Makes Them Smarter"
 * Visual: Working memory cards (top) → funnel → Persistent memory layers (bottom).
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneLayout } from "../components/SceneLayout";
import { ACCENT, CARD_BG, GREEN, MUTED, TEXT } from "../constants";

const WORK_CARDS = [
  { label: "Current Task",   icon: "📋", delay: 8  },
  { label: "Context",        icon: "🔍", delay: 18 },
  { label: "Recent Steps",   icon: "🪜", delay: 28 },
];

const MEM_LAYERS = [
  { label: "Long-term Facts",    opacity: 0.5, delay: 80,  h: 44 },
  { label: "Learned Patterns",   opacity: 0.65, delay: 92, h: 52 },
  { label: "User Preferences",   opacity: 0.8, delay: 104, h: 60 },
  { label: "Past Interactions",  opacity: 1.0,  delay: 116, h: 68 },
];

export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Funnel draw
  const funnelSpr = spring({ fps, frame: Math.max(0, frame - 50), config: { damping: 200 } });

  // Card fade-out (working memory disappears)
  const cardFade = interpolate(frame, [110, 150], [1, 0.3], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  // Recall arrow (bottom → top flicker)
  const recallOpacity = interpolate(
    Math.sin(((frame - 130) * Math.PI) / 30),
    [-1, 1], [0, 0.6],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  return (
    <SceneLayout
      headline="Memory Makes Them Smarter"
      body="Working memory handles the current task. Persistent memory stores lessons across sessions — so agents recognize patterns and improve over time."
      accentWord="Smarter"
    >
      <svg width={960} height={820} viewBox="0 0 960 820">

        {/* ── SECTION LABEL: WORKING MEMORY ── */}
        <text x={480} y={30} textAnchor="middle" fill={MUTED} fontSize={22} fontFamily="LiberationSans, sans-serif" fontWeight={700}>Working Memory</text>

        {/* ── WORK CARDS ── */}
        {WORK_CARDS.map(({ label, icon, delay }, i) => {
          const spr = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 200 } });
          const x = 180 + i * 210;
          const slideY = interpolate(spr, [0, 1], [60, 0]);
          return (
            <g key={label} opacity={spr * cardFade} style={{ transform: `translate(0px, ${slideY}px)` }}>
              <rect x={x - 80} y={50} width={160} height={110} rx={18}
                fill={CARD_BG} stroke={`${ACCENT}55`} strokeWidth={1.5}
              />
              <text x={x} y={100} textAnchor="middle" fontSize={32}>{icon}</text>
              <text x={x} y={135} textAnchor="middle" fill={TEXT} fontSize={19} fontFamily="LiberationSans, sans-serif" fontWeight={700}>{label}</text>
            </g>
          );
        })}

        {/* ── FUNNEL / ARROW ── */}
        <g opacity={funnelSpr}>
          {/* Converging lines */}
          <line x1={200} y1={175} x2={480} y2={320} stroke={`${ACCENT}66`} strokeWidth={2}
            strokeDasharray={200} strokeDashoffset={interpolate(funnelSpr,[0,1],[200,0])} />
          <line x1={480} y1={175} x2={480} y2={320} stroke={`${ACCENT}88`} strokeWidth={2}
            strokeDasharray={145} strokeDashoffset={interpolate(funnelSpr,[0,1],[145,0])} />
          <line x1={760} y1={175} x2={480} y2={320} stroke={`${ACCENT}66`} strokeWidth={2}
            strokeDasharray={200} strokeDashoffset={interpolate(funnelSpr,[0,1],[200,0])} />
          {/* Arrow down */}
          <line x1={480} y1={320} x2={480} y2={390}
            stroke={ACCENT} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={70} strokeDashoffset={interpolate(funnelSpr,[0,1],[70,0])}
          />
          <polygon points="460,390 480,420 500,390" fill={ACCENT} opacity={funnelSpr} />
        </g>

        {/* ── SECTION LABEL: PERSISTENT MEMORY ── */}
        <text x={480} y={450} textAnchor="middle" fill={MUTED} fontSize={22} fontFamily="LiberationSans, sans-serif" fontWeight={700}
          opacity={funnelSpr}>Persistent Memory</text>

        {/* ── MEMORY LAYERS (stacked cylinders) ── */}
        {MEM_LAYERS.map(({ label, opacity: layerOpacity, delay, h }, i) => {
          const spr = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 200 } });
          const totalH = MEM_LAYERS.reduce((s, l) => s + l.h + 6, 0);
          let y = 470;
          for (let j = 0; j < i; j++) y += MEM_LAYERS[j].h + 6;
          const w = 400 + i * 40;
          const x = (960 - w) / 2;
          return (
            <g key={label} opacity={spr}>
              {/* Cylinder top ellipse */}
              <ellipse cx={480} cy={y} rx={w / 2} ry={14}
                fill={`rgba(99,102,241,${layerOpacity * 0.18})`}
                stroke={`rgba(99,102,241,${layerOpacity * 0.7})`}
                strokeWidth={1.5}
              />
              {/* Cylinder body */}
              <rect x={x} y={y} width={w} height={h}
                fill={`rgba(99,102,241,${layerOpacity * 0.12})`}
              />
              {/* Cylinder bottom ellipse */}
              <ellipse cx={480} cy={y + h} rx={w / 2} ry={14}
                fill={`rgba(99,102,241,${layerOpacity * 0.22})`}
                stroke={`rgba(99,102,241,${layerOpacity * 0.7})`}
                strokeWidth={1.5}
              />
              <text x={480} y={y + h / 2 + 7} textAnchor="middle"
                fill={TEXT} fontSize={20} fontFamily="LiberationSans, sans-serif" fontWeight={700}
                opacity={layerOpacity}
              >{label}</text>
            </g>
          );
        })}

        {/* ── RECALL ARROW (bottom layer → up) ── */}
        {frame > 130 && (
          <g opacity={recallOpacity}>
            <line x1={820} y1={760} x2={820} y2={480} stroke={GREEN} strokeWidth={2} strokeLinecap="round" strokeDasharray="8 6" />
            <polygon points="808,480 820,455 832,480" fill={GREEN} />
            <text x={850} y={625} fill={GREEN} fontSize={18} fontFamily="LiberationSans, sans-serif" fontWeight={700}>Recall</text>
          </g>
        )}
      </svg>
    </SceneLayout>
  );
};
