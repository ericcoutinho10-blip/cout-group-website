"use client";

import { useEffect, useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * COUT NEWS na home é uma CHAMADA, não a matéria.
 *
 * O mockup do Canva trazia o texto corrido inteiro dentro da rolagem. Duas
 * razões para não fazer assim:
 *
 * 1. Quebra de modo. Até aqui o visitante estava assistindo — rolagem rápida,
 *    frase por tela. Ler 600 palavras exige o oposto: rolagem lenta e parada.
 *    Emendar os dois na mesma coluna faz ele abandonar no terceiro parágrafo.
 * 2. A rolagem deixa de ter fim. Cada matéria nova esticaria a home.
 *
 * Aqui entram no máximo três chamadas; a matéria mora em /news/[slug].
 */

type Materia = {
  kicker: string;
  titulo: string;
  linhaFina: string;
  fonteNome: string;
  slug: string;
  /** quadro do próprio filme — a arte do NEWS nasce do DNA visual da COUT */
  quadro: string;
};

// Placeholder até o agente editorial rodar. NÃO é a matéria da med-tech.world
// que estava no mockup: aquilo é texto de terceiro e o próprio Eric definiu a
// regra — "não vamos pegar nada de ninguém, vamos criar a partir de".
// Aqui só existe a chamada; o corpo virá escrito pelo agente, com a fonte
// citada e link para o original.
const MATERIAS: Materia[] = [
  {
    kicker: "Saúde · China",
    titulo: "Um hospital sem médico humano na sala",
    linhaFina:
      "A Universidade Tsinghua colocou agentes de IA para atender casos simulados. O que isso diz sobre onde a decisão clínica ainda precisa de gente.",
    fonteNome: "a partir do anúncio da Universidade Tsinghua",
    slug: "hospital-agente-tsinghua",
    quadro: "f0042",
  },
];

export default function CoutNews() {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisivel(true),
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="px-[var(--outer-margin)] py-[clamp(5rem,12vh,9rem)]"
      style={{ background: "rgb(var(--pure-white))" }}
    >
      <header className="mb-[clamp(2.5rem,6vh,4rem)]">
        <p className="t-label" style={{ color: "rgb(var(--blue))" }}>
          COUT NEWS
        </p>
        <h2 className="t-h2 mt-3 max-w-[min(94vw,44rem)] [text-wrap:balance]">
          O que as grandes anunciam, e o que isso muda para quem cuida de gente.
        </h2>
      </header>

      <ul className="grid gap-[clamp(1.5rem,4vw,2.5rem)] sm:grid-cols-2 lg:grid-cols-3">
        {MATERIAS.map((m, i) => (
          <li
            key={m.slug}
            style={{
              opacity: visivel ? 1 : 0,
              transform: visivel ? "translateY(0)" : "translateY(24px)",
              transition: `opacity .7s cubic-bezier(.16,1,.3,1) ${i * 90}ms, transform .7s cubic-bezier(.16,1,.3,1) ${i * 90}ms`,
            }}
          >
            <article className="group">
              <div className="overflow-hidden rounded-[1.25rem]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${BASE}/scroll/desktop/${m.quadro}.webp`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  width={1280}
                  height={716}
                  className="w-full transition-transform duration-700 group-hover:scale-[1.03]"
                  style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
                />
              </div>

              <p className="t-label mt-5" style={{ color: "rgb(var(--graphite) / 0.55)" }}>
                {m.kicker}
              </p>
              <h3 className="t-h3 mt-2 [text-wrap:balance]">{m.titulo}</h3>
              <p className="t-body mt-3" style={{ color: "rgb(var(--graphite) / 0.75)" }}>
                {m.linhaFina}
              </p>

              {/* Procedência à vista. A regra do painel — matéria sem fonte não
                  publica — só vale se a fonte também aparecer para quem lê. */}
              <p className="t-label mt-4" style={{ color: "rgb(var(--graphite) / 0.45)" }}>
                Escrito pelo agente editorial da COUT, {m.fonteNome}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
