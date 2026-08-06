"use client";

import { useEffect, useRef, useState } from "react";

/* A pausa é o único lugar do site em serifa. É o papel que no sistema do
 * Rolex cabe à fonte de citação: contraponto ao geométrico da Poppins,
 * usado com parcimônia, só onde o texto é declaração e não informação. */
const frases = [
  {
    text: "E se a tecnologia deixasse de ser o centro de tudo?",
    role: "quote" as const,
    tone: "ink" as const,
  },
  {
    text: "E passasse a ser apenas o que sempre deveria ter sido: uma extensão da inteligência humana.",
    role: "lead" as const,
    tone: "muted" as const,
  },
  {
    text: "É exatamente isso que construímos.",
    role: "quote" as const,
    tone: "accent" as const,
  },
];

type Frase = (typeof frases)[number];

function FraseReveal({ text, role, tone, delay }: Frase & { delay: number }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const roleClass = role === "quote" ? "t-quote" : "t-lead";
  const toneClass =
    tone === "accent"
      ? "text-cout-blue"
      : tone === "muted"
        ? "text-cout-slate"
        : "text-cout-graphite";

  return (
    <p
      ref={ref}
      className={`${roleClass} ${toneClass} mx-auto max-w-[26ch] text-center`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 900ms cubic-bezier(0.215,0.61,0.355,1) ${delay}ms, transform 900ms cubic-bezier(0.215,0.61,0.355,1) ${delay}ms`,
      }}
    >
      {text}
    </p>
  );
}

export default function PausaFilosofica() {
  return (
    <section className="bg-white" style={{ paddingBlock: "var(--l-h-space)" }}>
      <div
        className="mx-auto flex max-w-[88rem] flex-col items-center"
        style={{
          paddingInline: "var(--outer-margin)",
          gap: "var(--s-h-space)",
        }}
      >
        {frases.map((f, i) => (
          <FraseReveal key={i} {...f} delay={i * 150} />
        ))}

        {/* A arte fecha a Cultura. Sangra para fora da margem porque imagem
            contida em coluna lê como ilustração; sangrando, lê como cena. */}
        {/* De fora a fora, como o manifesto. A caixa arredondada dentro da
            margem fazia a arte ler como ilustracao; sangrando ate a borda da
            tela ela vira cena. `height: auto` mantem a imagem inteira — sem
            proporcao fixa nao ha recorte das bordas. */}
        <div
          className="overflow-hidden"
          style={{
            marginTop: "var(--s-h-space)",
            /* Sangria de verdade: mede a JANELA, nao o container. A margem
               negativa por `--outer-margin` so esticava ate a borda do pai,
               que tem `max-w-[88rem]` — por isso sobrava faixa branca em tela
               larga. `100vw` com `50% - 50vw` ignora o container inteiro. */
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
            marginRight: "calc(50% - 50vw)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/arte/cultura.webp`}
            alt=""
            loading="lazy"
            decoding="async"
            width={1800}
            height={763}
            className="w-full"
            style={{ display: "block", height: "auto" }}
          />
        </div>
      </div>
    </section>
  );
}
