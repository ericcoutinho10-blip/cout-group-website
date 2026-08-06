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
              opacity: visivel ? 1 : 0,
              transform: visivel ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 1100ms cubic-bezier(0.22,1,0.36,1) ${i * 260}ms, transform 1100ms cubic-bezier(0.22,1,0.36,1) ${i * 260}ms`,
            }}
          >
            {linha}
          </p>
        ))}

        {/* A mão do humanoide fecha o manifesto. Ela vem de fundo claro, então
            entra em `mix-blend-mode: screen` sobre o navy: o branco da arte
            vira luz e o fundo dela some, em vez de virar um retângulo claro
            colado no meio da seção. */}
        <div
          className="w-full overflow-hidden"
          style={{ marginTop: "var(--m-h-space)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/arte/mao-humanoide.webp`}
            alt=""
            loading="lazy"
            decoding="async"
            width={2400}
            height={1018}
            className="w-full"
            style={{
              mixBlendMode: "screen",
              opacity: visivel ? 0.9 : 0,
              transform: visivel ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 400ms cubic-bezier(.23,1,.32,1) .3s, transform 400ms cubic-bezier(.23,1,.32,1) .3s",
            }}
          />
        </div>
      </div>
    </section>
  );
}
