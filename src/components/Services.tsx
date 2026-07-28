"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  { idx: "01", title: "COUT OS", desc: "Sistema operacional de dados que conecta toda a sua operação em tempo real." },
  { idx: "02", title: "Agentes de IA", desc: "Inteligência autônoma para atendimento, análise e decisão sem intervenção manual." },
  { idx: "03", title: "Automação", desc: "Fluxos que eliminam tarefas repetitivas e liberam o time para o que importa." },
  { idx: "04", title: "HealthOS", desc: "Infraestrutura digital específica para saúde — em breve.", coming: true },
];

function ServiceRow({ s, delay, visible }: { s: typeof services[0]; delay: number; visible: boolean }) {
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
      <div
        className="flex items-center gap-4 sm:gap-6 rounded-[1.25rem] py-6 sm:py-8 transition-[background,padding] duration-300"
        style={{
          paddingInline: hovered ? "2rem" : "1.5rem",
          background: hovered ? "rgba(247,249,252,1)" : "rgba(247,249,252,0)",
        }}
      >
        <span
          className="shrink-0 text-sm font-medium tabular-nums"
          style={{ width: "1.75rem", color: "rgba(31,41,55,0.4)" }}
        >
          {s.idx}
        </span>

        <h3
          className="flex-1 font-medium tracking-tight"
          style={{ fontSize: "clamp(1.25rem, 2.5vw, 2.25rem)" }}
        >
          {s.title}
          {s.coming && (
            <span className="ml-3 text-sm font-normal rounded-full px-3 py-1 align-middle"
                  style={{ background: "#D8E5F7", color: "#3F7BD9" }}>
              Em breve
            </span>
          )}
        </h3>

        <p
          className="hidden lg:block max-w-xs text-sm leading-relaxed"
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
      </div>
    </li>
  );
}

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

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
          className="flex items-center gap-2 text-sm font-medium mb-5"
          style={{ color: "rgba(31,41,55,0.7)" }}
        >
          <span className="inline-block rounded-full" style={{ width: "0.375rem", height: "0.375rem", background: "rgba(31,41,55,0.5)" }}/>
          Produtos
        </div>

        <div className="overflow-hidden mb-12 sm:mb-14">
          <h2
            className="font-semibold tracking-tight max-w-[16ch]"
            style={{
              fontSize: "clamp(2.25rem, 4vw, 3rem)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(100%)",
              transition: "opacity 900ms cubic-bezier(0.215,0.61,0.355,1) 0.12s, transform 900ms cubic-bezier(0.215,0.61,0.355,1) 0.12s",
            }}
          >
            O que fazemos de melhor
          </h2>
        </div>

        <ul>
          {services.map((s, i) => (
            <ServiceRow key={s.idx} s={s} delay={i * 80} visible={visible} />
          ))}
        </ul>
      </div>
    </section>
  );
}
