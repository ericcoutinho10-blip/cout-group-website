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
      className="relative overflow-hidden bg-white"
      aria-label="Manifesto"
    >
      {/* A arte OCUPA a seção inteira e a frase vive dentro dela — era o
          contrário: navy com o texto e a imagem pendurada embaixo. Imagem
          de fundo com texto por cima é o que o Eric pediu e é o que dá
          escala; imagem abaixo do texto lê como anexo.

          A arte é clara, então o texto volta a ser navy e ganha uma queda
          de luz suave à esquerda para garantir leitura sobre a área mais
          clara do quadro. Sem caixa e sem sombra dura: o mesmo princípio
          do filme. */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/arte/mao-humanoide.webp`}
          alt=""
          width={2400}
          height={1018}
          className="h-full w-full"
          style={{ objectFit: "cover", objectPosition: "center right" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(85% 90% at 8% 45%, rgb(255 255 255 / 0.92) 0%, rgb(255 255 255 / 0.55) 45%, rgb(255 255 255 / 0) 78%)",
          }}
        />
      </div>

      <div
        className="relative mx-auto flex min-h-[82vh] max-w-[88rem] flex-col justify-center"
        style={{ paddingInline: "var(--outer-margin)" }}
      >
        {LINHAS.map((linha, i) => (
          <p
            key={linha}
            className="t-h2 max-w-[20ch]"
            style={{
              color: "rgb(var(--navy))",
              marginBlock: "0.15em",
              opacity: visivel ? 1 : 0,
              transform: visivel ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 400ms cubic-bezier(.23,1,.32,1) ${i * 120}ms, transform 400ms cubic-bezier(.23,1,.32,1) ${i * 120}ms`,
            }}
          >
            {linha}
          </p>
        ))}
      </div>
    </section>
  );
}
