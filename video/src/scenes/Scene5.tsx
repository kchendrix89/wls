/**
 * Scene 5 — "Teams of Agents Do the Impossible"
 * Visual: 3 agent nodes in a triangle with animated particle paths,
 * plus a particle background (10-15 circles drifting upward).
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneLayout } from "../components/SceneLayout";
import { ACCENT, CARD_BG, GREEN, MUTED, TEXT } from "../constants";

// Triangle node positions (cx=480, cy=380 as center)
const NODES = [
  { icon: "🔍", label: "Research",  x: 480, y:  90, delay:  8 },
  { icon: "✏️", label: "Write",     x: 760, y: 560, delay: 20 },
  { icon: "✅", label: "Verify",    x: 200, y: 560, delay: 32 },
];

// Edges: pairs of node indices
const EDGES = [
  [0, 1, 44],
  [1, 2, 58],
  [2, 0, 72],
] as const;

// Particles: each tracks along one edge
const NUM_PARTICLES = 3;
const PARTICLE_SPEED = 0.008; // fraction of edge per frame

// Background floating circles
const BG_CIRCLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: 60 + (i * 67) % 860,
  size: 6 + (i * 13) % 18,
  speed: 0.4 + (i * 0.17) % 0.8,
  delay: i * 14,
  opacity: 0.06 + (i % 4) * 0.04,
}));

export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <SceneLayout
      headline="Teams of Agents Do the Impossible"
      body="Specialized agents collaborate — one researches, one writes, one verifies. Together they accomplish in seconds what would take hours alone."
      accentWord="Impossible"
    >
      <svg width={960} height={800} viewBox="0 0 960 800">

        {/* ── BACKGROUND PARTICLES (drifting up) ── */}
        {BG_CIRCLES.map(({ id, x, size, speed, delay, opacity }) => {
          const elapsed = Math.max(0, frame - delay);
          const y = interpolate(
            (elapsed * speed) % 820,
            [0, 820],
            [800, -30]
          );
          return (
            <circle
              key={id}
              cx={x}
              cy={y}
              r={size}
              fill={ACCENT}
              opacity={opacity}
            />
          );
        })}

        {/* ── EDGES / CONNECTION LINES ── */}
        {EDGES.map(([a, b, delay]) => {
          const na = NODES[a];
          const nb = NODES[b];
          const dx = nb.x - na.x;
          const dy = nb.y - na.y;
          const len = Math.sqrt(dx * dx + dy * dy);

          const lineSpr = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 200 } });
          const dashOffset = interpolate(lineSpr, [0, 1], [len, 0]);

          // Animated particle on this edge
          const pT = ((frame - delay) * PARTICLE_SPEED) % 1;
          const px = na.x + dx * pT;
          const py = na.y + dy * pT;

          return (
            <g key={`${a}-${b}`}>
              <line
                x1={na.x} y1={na.y}
                x2={nb.x} y2={nb.y}
                stroke={`${ACCENT}66`}
                strokeWidth={2.5}
                strokeDasharray={len}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
              />
              {lineSpr > 0.5 && (
                <circle cx={px} cy={py} r={8} fill={ACCENT} opacity={0.9} />
              )}
            </g>
          );
        })}

        {/* ── AGENT NODES ── */}
        {NODES.map(({ icon, label, x, y, delay }) => {
          const spr = spring({ fps, frame: Math.max(0, frame - delay), config: { damping: 200 } });
          const scale = interpolate(spr, [0, 1], [0.2, 1]);

          return (
            <g key={label} opacity={spr} style={{ transform: `translate(${x}px,${y}px) scale(${scale})` }}>
              {/* Glow */}
              <circle cx={0} cy={0} r={85}
                fill={`rgba(99,102,241,${interpolate(spr,[0,1],[0,0.18])})`}
              />
              {/* Node circle */}
              <circle cx={0} cy={0} r={65}
                fill={CARD_BG}
                stroke={ACCENT}
                strokeWidth={2.5}
              />
              <text x={0} y={-8} textAnchor="middle" fontSize={32}>{icon}</text>
              <text x={0} y={24} textAnchor="middle" fill={TEXT} fontSize={20} fontFamily="LiberationSans, sans-serif" fontWeight={700}>{label}</text>
            </g>
          );
        })}

        {/* ── COMPLETION PULSE (final frames) ── */}
        {frame > 160 && (() => {
          const pulse = spring({ fps, frame: Math.max(0, frame - 160), config: { damping: 200 } });
          return (
            <circle cx={480} cy={360} r={interpolate(pulse, [0, 1], [0, 320])}
              fill="none"
              stroke={GREEN}
              strokeWidth={3}
              opacity={interpolate(pulse, [0, 0.5, 1], [0, 0.6, 0])}
            />
          );
        })()}
      </svg>
    </SceneLayout>
  );
};
