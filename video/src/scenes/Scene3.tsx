/**
 * Scene 3 — "Tools Let Agents Do Real Things"
 * Visual: Central agent hub with 6 tools radiating outward.
 * Lines draw via stroke-dashoffset, then animated dots travel along them.
 */
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneLayout } from "../components/SceneLayout";
import { ACCENT, CARD_BG, MUTED, TEXT } from "../constants";

const TOOLS = [
  { icon: "📧", label: "Email",      angle: -90 },
  { icon: "📅", label: "Calendar",   angle: -30 },
  { icon: "🗄️", label: "Database",   angle:  30 },
  { icon: "✅", label: "Tasks",      angle:  90 },
  { icon: "📊", label: "Analytics",  angle: 150 },
  { icon: "🔧", label: "Automation", angle: 210 },
];

const RADIUS = 270;
const LINE_LEN = RADIUS - 70; // center circle r=70 to tool circle r=55

export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Center agent pop
  const agentSpr = spring({ fps, frame: Math.max(0, frame - 5), config: { damping: 200 } });

  return (
    <SceneLayout
      headline="Tools Let Agents Do Real Things"
      body="Agents can call APIs, write emails, book appointments, and query databases. Each tool is a direct connection to the real world."
      accentWord="Real Things"
    >
      <svg width={960} height={800} viewBox="-480 -400 960 800">
        {/* ── CENTER AGENT CIRCLE ── */}
        {/* Glow */}
        <circle cx={0} cy={0} r={100}
          fill={`rgba(99,102,241,${interpolate(agentSpr,[0,1],[0,0.2])})`}
        />
        <circle
          cx={0} cy={0} r={70}
          fill={`rgba(99,102,241,0.15)`}
          stroke={ACCENT}
          strokeWidth={3}
          opacity={agentSpr}
          transform={`scale(${interpolate(agentSpr,[0,1],[0.3,1])})`}
        />
        <text x={0} y={-8} textAnchor="middle" fill={TEXT} fontSize={22} fontFamily="LiberationSans, sans-serif" fontWeight={700} opacity={agentSpr}>AI</text>
        <text x={0} y={20} textAnchor="middle" fill={TEXT} fontSize={22} fontFamily="LiberationSans, sans-serif" fontWeight={700} opacity={agentSpr}>Agent</text>

        {/* ── TOOLS ── */}
        {TOOLS.map(({ icon, label, angle }, i) => {
          const rad = (angle * Math.PI) / 180;
          const tx = RADIUS * Math.cos(rad);
          const ty = RADIUS * Math.sin(rad);
          // End of agent circle on this angle
          const lx1 = 72 * Math.cos(rad);
          const ly1 = 72 * Math.sin(rad);
          // Start of tool circle
          const lx2 = (RADIUS - 60) * Math.cos(rad);
          const ly2 = (RADIUS - 60) * Math.sin(rad);

          const lineDelay = 18 + i * 10;
          const toolDelay = lineDelay + 18;

          const lineSpr = spring({ fps, frame: Math.max(0, frame - lineDelay), config: { damping: 200 } });
          const toolSpr = spring({ fps, frame: Math.max(0, frame - toolDelay), config: { damping: 200 } });

          // Animated dot along the line (cycles every 60 frames)
          const dotT = ((frame - lineDelay) % 60) / 60;
          const dotX = interpolate(dotT, [0, 1], [lx1, lx2]);
          const dotY = interpolate(dotT, [0, 1], [ly1, ly2]);
          const dotVisible = lineSpr > 0.8;

          return (
            <g key={label}>
              {/* Line from agent to tool */}
              <line
                x1={lx1} y1={ly1}
                x2={lx2} y2={ly2}
                stroke={`${ACCENT}88`}
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray={LINE_LEN}
                strokeDashoffset={interpolate(lineSpr, [0, 1], [LINE_LEN, 0])}
              />
              {/* Travelling dot */}
              {dotVisible && (
                <circle cx={dotX} cy={dotY} r={6} fill={ACCENT} opacity={0.9} />
              )}
              {/* Tool node */}
              <g
                transform={`translate(${tx},${ty})`}
                opacity={toolSpr}
                style={{ transform: `translate(${tx}px,${ty}px) scale(${interpolate(toolSpr,[0,1],[0.3,1])})` }}
              >
                <circle cx={0} cy={0} r={55} fill={CARD_BG} stroke={`${ACCENT}66`} strokeWidth={1.5} />
                <text x={0} y={-6} textAnchor="middle" fontSize={28}>{icon}</text>
                <text x={0} y={22} textAnchor="middle" fill={MUTED} fontSize={16} fontFamily="LiberationSans, sans-serif" fontWeight={700}>{label}</text>
              </g>
            </g>
          );
        })}
      </svg>
    </SceneLayout>
  );
};
