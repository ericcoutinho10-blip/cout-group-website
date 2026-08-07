"use client";

import { V } from "@/lib/versao";

import { useEffect, useRef, useState } from "react";

// Os cinco vieram do mockup do Canva (Eric, 05/08/2026). Grafia corrigida:
// "Growh Analitic" → "Growth Analytics".
//
// O mockup chamava a faixa de "Produtos". Mantive "Infraestrutura", que é o
// que a nav diz e o que o filme afirma — "Não é sobre uma ferramenta, é sobre
// infraestrutura". Chamar de produto contradiz a frase central do filme e
// rebaixa cinco partes de um sistema a cinco itens de catálogo. Por isso cada
// linha se descreve como parte do COUT OS, não como software avulso.
// `coming` é opcional e hoje ninguém usa — mas o JSX lê `s.coming`. Sem o tipo
// declarado, o TS infere a partir do array e a build de produção quebra (o dev
// não pega). Mesma armadilha que já custou uma publicação no CreateBand.
type Service = { idx: string; title: string; desc: string; coming?: boolean; arte?: string };

const services: Service[] = [
  { idx: "01", title: "Relacionamento", arte: "crm",
    desc: "Tudo o que acontece entre empresa e cliente permanece conectado, organizado e acessível." },
  { idx: "02", title: "Inteligência", arte: "agentes",
    desc: "Agentes de IA executam tarefas, analisam informações e apoiam decisões com supervisão humana." },
  { idx: "03", title: "Operação", arte: "dashboard",
    desc: "Dashboards transformam dados dispersos em uma visão clara do que realmente está acontecendo." },
  { idx: "04", title: "Crescimento", arte: "growth",
    desc: "Analytics mostram onde a empresa cresce, onde perde oportunidades e quais ações geram impacto." },
  { idx: "05", title: "Comunicação", arte: "comunicacao",
    desc: "Cada interação acontece automaticamente no momento certo, pelo canal certo e para a pessoa certa." },
];

function ServiceRow({ s, delay, visible, onAbrir }: { s: Service; delay: number; visible: boolean; onAbrir: (s: Service) => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className="border-t"
      style={{
        borderColor: "#E5E7EB",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* A linha inteira e o alvo do clique, nao so a seta — alvo pequeno em
          lista larga faz a pessoa errar. Botao, nao div, para o teclado
          chegar aqui tambem. */}
      <button
        type="button"
        onClick={() => onAbrir(s)}
        aria-label={`Ver ${s.title}`}
        className="w-full text-left flex items-center gap-4 sm:gap-6 rounded-[1.25rem] py-6 sm:py-8 transition-[background,padding] duration-300"
        style={{
          paddingInline: hovered ? "2rem" : "1.5rem",
          background: hovered ? "rgba(247,249,252,1)" : "rgba(247,249,252,0)",
        }}
      >
        <span
          className="shrink-0 t-body font-medium tabular-nums"
          style={{ width: "1.75rem", color: "rgba(31,41,55,0.4)" }}
        >
          {s.idx}
        </span>

        <h3
          className="flex-1 font-medium tracking-tight"
          style={{ fontSize: "var(--fs-h3)" }}
        >
          {s.title}
          {s.coming && (
            <span className="ml-3 t-body font-normal rounded-full px-3 py-1 align-middle"
                  style={{ background: "#D8E5F7", color: "#3F7BD9" }}>
              Em breve
            </span>
          )}
        </h3>

        <p
          className="hidden lg:block max-w-xs t-body leading-relaxed"
          style={{ color: "rgba(31,41,55,0.55)" }}
        >
          {s.desc}
        </p>

        <span
          className="shrink-0 inline-grid place-items-center rounded-full"
          style={{
            width: "2.5rem", height: "2.5rem",
            background: "#0F2540", color: "#fff",
            transform: hovered ? "translateX(5px)" : "translateX(0)",
            transition: "transform 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8 7h9v9"/>
          </svg>
        </span>
      </button>
    </li>
  );
}

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [aberto, setAberto] = useState<Service | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAberto(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="services" className="bg-white">
      <div ref={ref} className="max-w-[88rem] mx-auto px-5 sm:px-8 py-20 lg:py-28">
        {/* Cabeçalho */}
        <div
          className="flex items-center gap-2 t-body font-medium mb-5"
          style={{ color: "rgba(31,41,55,0.7)" }}
        >
          <span className="inline-block rounded-full" style={{ width: "0.375rem", height: "0.375rem", background: "rgba(31,41,55,0.5)" }}/>
          Infraestrutura
        </div>

        <div className="overflow-hidden mb-12 sm:mb-14">
          <h2
            className="font-semibold tracking-tight max-w-[16ch]"
            style={{
              fontSize: "var(--fs-h2)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(100%)",
              transition: "opacity 900ms cubic-bezier(0.215,0.61,0.355,1) 0.12s, transform 900ms cubic-bezier(0.215,0.61,0.355,1) 0.12s",
            }}
          >
            A plataforma que conecta toda a operação
          </h2>
          <p
            className="t-lead mt-5 max-w-[42ch]"
            style={{
              color: "rgba(31,41,55,0.62)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 400ms cubic-bezier(.23,1,.32,1) .18s, transform 400ms cubic-bezier(.23,1,.32,1) .18s",
            }}
          >
            Uma operação inteligente nasce da integração de cinco camadas.
          </p>
        </div>

        <ul>
          {services.map((s, i) => (
            <ServiceRow onAbrir={setAberto} key={s.idx} s={s} delay={i * 80} visible={visible} />
          ))}
        </ul>

        {/* Lightbox. Fecha no Esc, no fundo e no botao — quem abriu por
            engano precisa de tres saidas obvias, nao uma. */}
        {aberto && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={aberto.title}
            onClick={() => setAberto(null)}
            className="fixed inset-0 z-[80] grid place-items-center p-[var(--outer-margin)]"
            style={{ background: "rgb(15 37 64 / 0.72)", backdropFilter: "blur(6px)" }}
          >
            <figure
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[min(92vw,72rem)] overflow-hidden rounded-[1.5rem]"
              style={{ background: "#fff" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/produtos/${aberto.arte}.webp?${V}`}
                alt=""
                width={1920}
                height={1080}
                className="w-full"
                style={{ aspectRatio: "16 / 9", objectFit: "cover" }}
              />
              <figcaption className="flex items-start justify-between gap-6 p-6 sm:p-8">
                <div>
                  <p className="t-label" style={{ color: "rgba(31,41,55,0.5)" }}>{aberto.idx}</p>
                  <h3 className="t-h3 mt-1">{aberto.title}</h3>
                  <p className="t-body mt-2 max-w-[52ch]" style={{ color: "rgba(31,41,55,0.7)" }}>
                    {aberto.desc}
                  </p>
                </div>
                <button
                  onClick={() => setAberto(null)}
                  aria-label="Fechar"
                  className="shrink-0 grid place-items-center rounded-full"
                  style={{ width: "2.5rem", height: "2.5rem", background: "#0F2540", color: "#fff" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </figcaption>
            </figure>
          </div>
        )}
      </div>
    </section>
  );
}
