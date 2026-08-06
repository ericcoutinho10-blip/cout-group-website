"use client";

import { useEffect, useRef, useState } from "react";

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = [
    { text: "Existimos", muted: false }, { text: "para", muted: false },
    { text: "conectar", muted: false }, { text: "inteligência", muted: false },
    { text: "a", muted: false }, { text: "infraestrutura", muted: false },
    { text: "—", muted: false },
    { text: "unindo", muted: true }, { text: "dados,", muted: true },
    { text: "pessoas", muted: true }, { text: "e", muted: true },
    { text: "decisões", muted: true }, { text: "em", muted: true },
    { text: "sistemas", muted: true }, { text: "que", muted: true },
    { text: "realmente", muted: true }, { text: "funcionam.", muted: true },
  ];

  return (
    <section id="about" className="bg-white">
      <div ref={ref} className="max-w-[88rem] mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 py-20 lg:py-28">
        {/* Coluna esquerda */}
        {/* Coluna esquerda: a imagem que o Eric mandou, no lugar do antigo
            globo. Ela carrega a ideia melhor do que qualquer icone — o
            humanoide e a pessoa encaixando a mesma peca. */}
        <div className="relative">
          <div
            className="flex items-center gap-2 text-sm font-medium mb-5"
            style={{ color: "rgba(31,41,55,0.7)" }}
          >
            <span className="inline-block rounded-full" style={{ width: "0.375rem", height: "0.375rem", background: "rgba(31,41,55,0.5)" }}/>
            Quem Somos
          </div>
          <div className="overflow-hidden rounded-[1.25rem]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/arte/quem-somos.webp`}
              alt=""
              loading="lazy"
              decoding="async"
              width={934}
              height={1200}
              className="w-full"
              style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
            />
          </div>
        </div>

        {/* Coluna direita — statement */}
        <div className="flex flex-col gap-10">
          <p className="text-2xl sm:text-3xl font-medium leading-[1.35] tracking-tight" style={{ color: "#1F2937" }}>
            {words.map((w, i) => (
              <span
                key={i}
                className="inline-block mr-[0.25em]"
                style={{
                  color: w.muted ? "#6B7280" : "#1F2937",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(24px)",
                  transition: `opacity 700ms cubic-bezier(0.165,0.84,0.44,1) ${i * 35}ms, transform 700ms cubic-bezier(0.165,0.84,0.44,1) ${i * 35}ms`,
                }}
              >
                {w.text}
              </span>
            ))}
          </p>

          {/* Footer row */}
          <div
            className="flex flex-wrap items-end justify-between gap-6 border-t pt-6"
            style={{
              borderColor: "#E5E7EB",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.6s, transform 0.6s ease 0.6s",
            }}
          >
            {/* Onde estavam os ícones de rede social e o botão "Sobre nós":
                ícone de rede sem conta ligada é enfeite, e "Sobre nós" dentro
                da própria seção sobre nós não leva a lugar nenhum. No lugar,
                a frase que o filme já sustenta. */}
            <p className="t-quote max-w-[34ch]" style={{ color: "rgba(31,41,55,0.75)" }}>
              A melhor tecnologia é aquela que opera em silêncio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
