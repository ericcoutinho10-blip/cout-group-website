"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "light" | "accent" | "dark" | "ghost";

/* O tipo é declarado antes da lista: sem isso o TypeScript infere uma união em
 * que `isArrow` só existe num dos membros, e a desestruturação no map não
 * compila na build de produção. */
type Tile = { label: string; variant: Variant; isArrow?: boolean };

const tiles: Tile[] = [
  { label: "Compreender", variant: "light" },
  { label: "Conectar", variant: "accent" },
  { label: "→", variant: "dark", isArrow: true },
  { label: "Evoluir", variant: "ghost" },
];

function tileStyle(variant: Variant): React.CSSProperties {
  switch (variant) {
    case "light":  return { background: "#F7F9FC", color: "#0F2540" };
    case "accent": return { background: "linear-gradient(to bottom right, #6C9DE4, #2C5AA3)", color: "#fff" };
    case "dark":   return { background: "#0F2540", color: "#fff" };
    case "ghost":  return { background: "rgba(247,249,252,0.6)", color: "rgba(15,37,64,0.35)" };
  }
}

export default function CreateBand() {
  const ref = useRef<HTMLUListElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-white">
      <ul
        ref={ref}
        className="max-w-[88rem] mx-auto px-5 sm:px-8 flex flex-col sm:flex-row gap-3 py-10"
      >
        {tiles.map(({ label, variant, isArrow }, i) => (
          <li
            key={i}
            className="flex-1 flex items-center justify-center rounded-full font-medium cursor-default select-none transition-[transform] duration-300 hover:scale-[1.03]"
            style={{
              height: "clamp(5rem, 10vw, 10rem)",
              fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
              ...tileStyle(variant),
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(28px)",
              transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 120}ms`,
            }}
          >
            {isArrow ? (
              <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            ) : label}
          </li>
        ))}
      </ul>
    </section>
  );
}
