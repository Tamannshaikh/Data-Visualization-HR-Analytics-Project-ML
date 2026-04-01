import { useMemo } from "react";

const rand = (min, max) => Math.random() * (max - min) + min;

export default function Bubbles({ darkMode }) {
  // Generate stable bubble configs once on mount
  const bubbles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      size:     rand(8, 52),          // px – diameter
      left:     rand(0, 100),         // % from left
      delay:    rand(0, 18),          // s – stagger start
      duration: rand(10, 26),         // s – full rise cycle
      opacity:  rand(0.06, 0.22),     // very subtle
      wobble:   rand(12, 40),         // px – horizontal wobble amplitude
    })),
  []);

  return (
    <div className="bubbles-layer" aria-hidden="true">
      {bubbles.map(b => (
        <span
          key={b.id}
          className={`bubble ${darkMode ? "bubble-dark" : "bubble-light"}`}
          style={{
            width:           b.size,
            height:          b.size,
            left:            `${b.left}%`,
            animationDelay:  `${b.delay}s`,
            animationDuration:`${b.duration}s`,
            opacity:         b.opacity,
            "--wobble":      `${b.wobble}px`,
          }}
        />
      ))}
    </div>
  );
}
