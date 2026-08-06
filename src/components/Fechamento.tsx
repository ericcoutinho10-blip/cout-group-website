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


export default function Fechamento() {
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

      {/* O botao saiu daqui. Media contraste quase nulo — escuro sobre
          escuro — e era redundante: o "Falar com a COUT" flutua na tela o
          tempo todo e faz a mesma coisa. Dois CTAs disputando a mesma
          intencao e pior do que um. A cor fica so no atendimento. */}

    </section>
  );
}
