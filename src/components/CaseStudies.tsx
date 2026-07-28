"use client";

import { useEffect, useRef, useState } from "react";

const cases = [
  {
    name: "Dr. Hussein",
    category: "HealthOS",
    year: "2024",
    description: "Plataforma de gestão clínica inteligente com agentes de IA para triagem, prontuário e faturamento automatizado.",
    tags: ["IA Clínica", "Automação", "Produto Digital"],
  },
  {
    name: "Suavetex",
    category: "Automação",
    year: "2024",
    description: "Sistema de atendimento e gestão de pedidos integrado ao WhatsApp, reduzindo tempo de resposta em 80%.",
    tags: ["WhatsApp", "Automação", "E-commerce"],
  },
  {
    name: "Iman",
    category: "Estratégia Digital",
    year: "2023",
    description: "Ecossistema de dados e comunicação para escala de audiência com inteligência aplicada a conteúdo.",
    tags: ["Dados", "Growth", "Conteúdo"],
  },
  {
    name: "Próximo case",
    category: "Em aberto",
    year: "2025",
    description: "Seu projeto pode ser o próximo. Temos capacidade para novos parceiros a partir deste trimestre.",
    tags: ["Disponível"],
    isPlaceholder: true,
  },
];

function CaseCard({ c, delay, visible }: { c: typeof cases[0]; delay: number; visible: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      className="relative min-h-[22rem] sm:min-h-[26rem] overflow-hidden rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between"
      style={{
        background: c.isPlaceholder ? "transparent" : "#0F2540",
        border: c.isPlaceholder ? "1.5px dashed #E5E7EB" : "1px solid rgba(255,255,255,0.05)",
        color: c.isPlaceholder ? "#6B7280" : "#fff",
        opacity: visible ? 1 : 0,
        transform: visible
          ? hovered ? "translateY(-8px) scale(1.012)" : "translateY(0) scale(1)"
          : "translateY(48px)",
        transition: `opacity 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1)`,
        cursor: c.isPlaceholder ? "default" : "pointer",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Top meta */}
      <div className="flex justify-between items-start text-xs uppercase tracking-wide"
           style={{ color: c.isPlaceholder ? "#9CA3AF" : "rgba(255,255,255,0.45)" }}>
        <span>{c.category} — {c.year}</span>
        {!c.isPlaceholder && (
          <span
            className="inline-grid place-items-center rounded-full"
            style={{
              width: "2.75rem", height: "2.75rem",
              background: "rgba(255,255,255,0.1)",
              outline: "1px solid rgba(255,255,255,0.15)",
              transform: hovered ? "rotate(45deg) scale(1.08)" : "rotate(0deg) scale(1)",
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M8 7h9v9"/>
            </svg>
          </span>
        )}
      </div>

      {/* Logo mark centro */}
      {!c.isPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span style={{ fontSize: "4.5rem", color: "rgba(255,255,255,0.08)", fontWeight: 700, letterSpacing: "-0.04em" }}>
            C
          </span>
        </div>
      )}

      {/* Conteúdo inferior */}
      <div>
        <h3 className="font-medium tracking-tight mb-2"
            style={{ fontSize: "clamp(1.5rem, 2vw, 1.875rem)", color: c.isPlaceholder ? "#9CA3AF" : "#fff" }}>
          {c.name}
        </h3>
        <p className="text-sm leading-relaxed max-w-[28rem] mb-5"
           style={{ color: c.isPlaceholder ? "#9CA3AF" : "rgba(255,255,255,0.55)" }}>
          {c.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {c.tags.map((tag) => (
            <span
              key={tag}
              className="text-sm rounded-full px-4 py-2"
              style={{
                border: c.isPlaceholder ? "1px solid #E5E7EB" : "1px solid rgba(255,255,255,0.2)",
                color: c.isPlaceholder ? "#9CA3AF" : "#fff",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}

export default function CaseStudies() {
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
    <section id="works" className="bg-white">
      <div ref={ref} className="max-w-[88rem] mx-auto px-5 sm:px-8 pb-20 lg:pb-28">
        {/* Cabeçalho */}
        <div className="flex flex-col items-center text-center mb-10">
          <div
            className="inline-flex items-center gap-2 text-sm font-medium rounded-full px-4 py-1.5 mb-5"
            style={{
              border: "1px solid #E5E7EB", color: "rgba(31,41,55,0.7)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.6s ease, transform 0.6s ease",
            }}
          >
            <span className="inline-block rounded-full" style={{ width: "0.375rem", height: "0.375rem", background: "rgba(31,41,55,0.5)" }}/>
            Cases
          </div>
          <div className="overflow-hidden">
            <h2
              className="font-semibold tracking-tight"
              style={{
                fontSize: "clamp(2.25rem, 4vw, 3rem)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(100%)",
                transition: "opacity 900ms cubic-bezier(0.215,0.61,0.355,1) 0.12s, transform 900ms cubic-bezier(0.215,0.61,0.355,1) 0.12s",
              }}
            >
              Trabalhos selecionados
            </h2>
          </div>
        </div>

        {/* Grid */}
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((c, i) => (
            <CaseCard key={c.name} c={c} delay={i * 90} visible={visible} />
          ))}
        </ul>
      </div>
    </section>
  );
}
