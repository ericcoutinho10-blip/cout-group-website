"use client";

import { useEffect, useRef, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * COUT NEWS — a faixa editorial.
 *
 * Desenhada como revista: uma matéria de capa com imagem grande ocupando
 * quase a largura toda, e duas chamadas menores ao lado. A versão anterior
 * era um card pequeno e não sustentava o peso que a seção tem.
 *
 * O conteúdo aqui é maquete de layout. Quando o agente do n8n entrar, ele
 * escreve, o humano revisa no painel (`cout-news/`) e a publicação troca
 * estes objetos por dados do Supabase. A estrutura já é a final: capa +
 * secundárias, sempre com procedência à vista.
 */

type Materia = {
  kicker: string;
  titulo: string;
  linhaFina?: string;
  fonte: string;
  slug: string;
  /** quadro do próprio filme — a arte do NEWS nasce do DNA visual da COUT */
  quadro: string;
};

const CAPA: Materia = {
  kicker: "Saúde · China",
  titulo: "Um hospital sem médico humano na sala",
  linhaFina:
    "A Universidade Tsinghua colocou agentes de IA para atender casos simulados. O que isso diz sobre onde a decisão clínica ainda precisa de gente — e onde já não precisa.",
  fonte: "a partir do anúncio da Universidade Tsinghua",
  slug: "hospital-agente-tsinghua",
  quadro: "f0128",
};

const SECUNDARIAS: Materia[] = [
  {
    kicker: "Infraestrutura",
    titulo: "Quem opera o sistema quando ninguém está olhando",
    fonte: "a partir de documentação pública de plataformas de saúde",
    slug: "quem-opera-o-sistema",
    quadro: "f0042",
  },
  {
    kicker: "Trabalho",
    titulo: "A recepção deixou de ser fila e virou conversa",
    fonte: "a partir de dados públicos de atendimento",
    slug: "recepcao-virou-conversa",
    quadro: "f0205",
  },
];

function Arte({ m, alto }: { m: Materia; alto?: boolean }) {
  return (
    <div className="overflow-hidden rounded-[1.25rem]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${BASE}/scroll/desktop/${m.quadro}.webp`}
        alt=""
        loading="lazy"
        decoding="async"
        width={1280}
        height={716}
        className="w-full transition-transform duration-[400ms] ease-[cubic-bezier(.23,1,.32,1)] group-hover:scale-[1.03]"
        style={{ aspectRatio: alto ? "16 / 9" : "4 / 3", objectFit: "cover" }}
      />
    </div>
  );
}

export default function CoutNews() {
  const ref = useRef<HTMLElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisivel(true),
      { threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const surge = (atraso = 0) => ({
    opacity: visivel ? 1 : 0,
    transform: visivel ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 400ms cubic-bezier(.23,1,.32,1) ${atraso}ms, transform 400ms cubic-bezier(.23,1,.32,1) ${atraso}ms`,
  });

  const procedencia = (m: Materia) => (
    <p className="t-label mt-4" style={{ color: "rgb(var(--graphite) / 0.42)" }}>
      Escrito pelo agente editorial da COUT, {m.fonte}
    </p>
  );

  return (
    <section
      ref={ref}
      className="px-[var(--outer-margin)] py-[clamp(6rem,15vh,10rem)]"
      style={{ background: "rgb(var(--pure-white))" }}
    >
      <header className="mb-[clamp(3rem,8vh,5rem)]" style={surge()}>
        <p className="t-label" style={{ color: "rgb(var(--blue))" }}>
          COUT NEWS
        </p>
        <h2 className="t-h2 mt-3 max-w-[min(94vw,40rem)] [text-wrap:balance]">
          O que as grandes anunciam, e o que isso muda para quem cuida de gente.
        </h2>
      </header>

      {/* Capa: imagem larga, texto numa coluna estreita embaixo à esquerda —
          medida curta é o que faz um bloco longo parecer legível. */}
      <article className="group" style={surge(60)}>
        <Arte m={CAPA} alto />
        <div className="mt-8 grid gap-x-[clamp(2rem,6vw,5rem)] gap-y-4 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="t-label" style={{ color: "rgb(var(--graphite) / 0.5)" }}>
              {CAPA.kicker}
            </p>
            <h3 className="t-h2 mt-2 max-w-[20ch] [text-wrap:balance]">{CAPA.titulo}</h3>
          </div>
          <div className="self-end">
            <p className="t-lead max-w-[46ch]" style={{ color: "rgb(var(--graphite) / 0.72)" }}>
              {CAPA.linhaFina}
            </p>
            {procedencia(CAPA)}
          </div>
        </div>
      </article>

      <ul className="mt-[clamp(4rem,10vh,6rem)] grid gap-[clamp(2rem,5vw,3.5rem)] sm:grid-cols-2">
        {SECUNDARIAS.map((m, i) => (
          <li key={m.slug} style={surge(120 + i * 60)}>
            <article className="group">
              <Arte m={m} />
              <p className="t-label mt-5" style={{ color: "rgb(var(--graphite) / 0.5)" }}>
                {m.kicker}
              </p>
              <h3 className="t-h3 mt-2 max-w-[24ch] [text-wrap:balance]">{m.titulo}</h3>
              {procedencia(m)}
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
