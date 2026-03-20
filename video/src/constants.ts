// Canvas
export const W = 1080;
export const H = 1920;
export const FPS = 30;

// Safe zone (mobile platforms)
export const SAFE_TOP = 150;
export const SAFE_BOTTOM = 170;
export const SAFE_SIDE = 60;

// Timing
export const SCENE_FRAMES = 192; // 6.4s per scene
export const TRANS_FRAMES = 12;  // 0.4s fade
// Total = 5*192 - 4*12 = 912 frames (30.4s)
export const TOTAL_FRAMES = 5 * SCENE_FRAMES - 4 * TRANS_FRAMES;

// Colors
export const BG = "#0a0a0f";
export const TEXT = "#ffffff";
export const ACCENT = "#6366f1";   // indigo
export const GREEN = "#22c55e";    // green
export const MUTED = "rgba(255,255,255,0.55)";
export const CARD_BG = "rgba(255,255,255,0.06)";
export const ACCENT_DIM = "rgba(99,102,241,0.25)";
export const ACCENT_GLOW = "rgba(99,102,241,0.15)";
