"use client";

import { useEffect, useRef, useState } from "react";

/* Capítulo 06 do briefing. Frases curtas, muito espaço, nenhuma explicação.
 * Cada linha entra sozinha — a pausa entre elas é o conteúdo. */
// Copy definida pelo Eric em 06/08/2026, no lugar do "Nós não construímos
// tecnologia / Pessoas constroem tecnologia...". Uma frase só: o manifesto
// ganha peso por ficar sozinho na tela, não por acumular linhas.
const LINHAS = [
  "Um toque especial de quem",
  "domina a tecnologia com excelência.",
];

export default function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisivel(true);
      return;
    }
    const medir = () => {
      const r = el.getBoundingClientRect();
      const vis = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (r.height > 0 && vis / r.height >= 0.25) {
        setVisivel(true);
        window.removeEventListener("scroll", medir);
      }
    };
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    return () => window.removeEventListener("scroll", medir);
  }, []);

  return (
    <section
      id="manifesto"
      ref={ref}
      className="bg-cout-navy"
      style={{ paddingBlock: "var(--l-h-space)" }}
      aria-label="Manifesto"
    >
      <div
        className="mx-auto max-w-[88rem]"
        style={{ paddingInline: "var(--outer-margin)" }}
      >
        {LINHAS.map((linha, i) => (
          <p
            key={linha}
            className="t-h2 text-white"
            style={{
              marginBlock: "var(--s-h-space)",
              opacity: visivel ? (i >= 4 ? 1 : 0.72) : 0,
              transform: visivel ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 1100ms cubic-bezier(0.22,1,0.36,1) ${i * 260}ms, transform 1100ms cubic-bezier(0.22,1,0.36,1) ${i * 260}ms`,
            }}
          >
            {linha}
          </p>
        ))}
      </div>
    </section>
  );
}
