"use client";

import { useEffect, useRef, useState } from "react";

/**
 * O fim do site.
 *
 * Este bloco vivia logo depois do filme, como dobradiça. O Eric apontou que
 * no mockup do Canva ele FECHA a página — e faz mais sentido: convite para
 * trabalhar junto se faz depois de mostrar o que se faz, não antes.
 * A prova social também: os três nomes pesam mais no fim, quando já existe
 * um argumento para eles sustentarem.
 */

const ORGANIZACOES = [
  "Dr. Hussein Awada",
  "Indústrias Suavetex",
  "Iman Hammoud",
] as const;

export default function Fechamento({ onOpenModal }: { onOpenModal: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisivel(true),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Uma curva e uma duração no site inteiro — medidas no rolex.com.
     Deslocamento curto: 20px. O que sobe demais chama atenção para si. */
  const surge = (atraso = 0) => ({
    opacity: visivel ? 1 : 0,
    transform: visivel ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 400ms cubic-bezier(.23,1,.32,1) ${atraso}ms, transform 400ms cubic-bezier(.23,1,.32,1) ${atraso}ms`,
  });

  return (
    <section
      ref={ref}
      className="px-[var(--outer-margin)] py-[clamp(7rem,18vh,12rem)] text-center"
      style={{ background: "rgb(var(--navy))" }}
    >
      <div aria-hidden className="mx-auto h-px w-[min(22rem,60vw)] bg-white/20" />

      <h2
        className="t-h2 mx-auto mt-12 max-w-[18ch] text-white [text-wrap:balance]"
        style={surge()}
      >
        Vamos construir algo único.
      </h2>

      <button
        onClick={onOpenModal}
        className="mt-12 rounded-full border border-white/30 px-9 py-4 text-[0.95rem] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
        style={{
          ...surge(90),
          transition:
            "opacity 400ms cubic-bezier(.23,1,.32,1) 90ms, transform 400ms cubic-bezier(.23,1,.32,1) 90ms, background-color 400ms cubic-bezier(.23,1,.32,1), border-color 400ms cubic-bezier(.23,1,.32,1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
          e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        Falar com um especialista
      </button>

      {/* A prova, sussurrada: só os nomes. Sem logo, sem métrica, sem elogio —
          quem reconhece, reconhece; quem não reconhece não é atrapalhado. */}
      <div className="mt-[clamp(5rem,12vh,8rem)]" style={surge(180)}>
        <p className="t-label text-white/35">
          Algumas organizações que confiaram na COUT
        </p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          {ORGANIZACOES.map((nome) => (
            <li key={nome} className="t-body font-light text-white/55">
              {nome}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
