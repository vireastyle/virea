// Mirrors CSS tokens from tokens.css § 9. MOTION
// Framer Motion uses seconds (not ms) and array easings (not CSS strings)
export const motionTokens = {
  duration: {
    fast:     0.1,
    standard: 0.2,
    emphasis: 0.3,
    long:     0.4,
  },
  easing: {
    standard:   [0.2, 0, 0, 1]   as [number, number, number, number],
    decelerate: [0, 0, 0, 1]     as [number, number, number, number],
    accelerate: [0.3, 0, 1, 1]   as [number, number, number, number],
  },
} as const;
