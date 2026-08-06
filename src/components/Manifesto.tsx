"use client";

import { useEffect, useRef, useState } from "react";

/* Capítulo 06 do briefing. Frases curtas, muito espaço, nenhuma explicação.
 * Cada linha entra sozinha — a pausa entre elas é o conteúdo. */
// Copy definida pelo Eric em 06/08/2026, no lugar do "Nós não construímos
// tecnologia / Pessoas constroem tecnologia...". Uma frase só: o manifesto
// ganha peso por ficar sozinho na tela, não por acumular linhas.

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
      aria-label="Um toque especial de quem domina a tecnologia com excelência."
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
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        {/* O veu branco radial saiu. Ele existia para o texto em HTML ficar
            legivel sobre a area clara do quadro; com o texto queimado na arte
            ele so lavava a imagem do Eric. A arte entra limpa, como ele
            montou. */}
      </div>

      <div
        className="relative mx-auto flex min-h-[86vh] max-w-[88rem] flex-col justify-end"
        style={{ paddingInline: "var(--outer-margin)" }}
      >
        {/* A frase volta a ser texto de verdade, centralizada embaixo como
            no print do Eric. Em HTML ela reflui no celular e o leitor de
            tela alcanca — o que texto queimado na imagem nao faz. A arte
            usada e a versao sem texto, para nao duplicar. */}
        <p
          className="t-h2 mx-auto max-w-[24ch] pb-[8vh] text-center [text-wrap:balance]"
          style={{
            color: "rgb(var(--navy))",
            opacity: visivel ? 1 : 0,
            transform: visivel ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 400ms cubic-bezier(.23,1,.32,1), transform 400ms cubic-bezier(.23,1,.32,1)",
          }}
        >
          Um toque especial de quem domina a tecnologia com excelência.
        </p>
      </div>
    </section>
  );
}
