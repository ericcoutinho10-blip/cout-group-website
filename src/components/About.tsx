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
        <div className="relative min-h-56 lg:min-h-80">
          {/* Ícone de fundo */}
          <svg
            className="absolute -left-4 top-1/2 -translate-y-1/2 pointer-events-none select-none"
            width="320" height="320" viewBox="0 0 24 24" fill="none"
            stroke="#0F2540" strokeWidth="0.3" style={{ opacity: 0.07 }}
          >
            <circle cx="12" cy="12" r="9.25"/>
            <path d="M12 2.75c2.6 2.3 4 5.8 4 9.25s-1.4 6.95-4 9.25c-2.6-2.3-4-5.8-4-9.25s1.4-6.95 4-9.25zM2.75 12h18.5"/>
          </svg>

          {/* Eyebrow */}
          <div
            className="relative flex items-center gap-2 text-sm font-medium mb-4"
            style={{ color: "rgba(31,41,55,0.7)" }}
          >
            <span className="inline-block rounded-full" style={{ width: "0.375rem", height: "0.375rem", background: "rgba(31,41,55,0.5)" }}/>
            O Estúdio
          </div>

          {/* Tagline */}
          <div
            className="absolute bottom-0 left-0 flex items-center gap-3 text-sm"
            style={{
              color: "rgba(31,41,55,0.7)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1F2937" strokeWidth="1.4">
              <circle cx="12" cy="12" r="9.25"/>
              <path d="M12 2.75c2.6 2.3 4 5.8 4 9.25s-1.4 6.95-4 9.25c-2.6-2.3-4-5.8-4-9.25s1.4-6.95 4-9.25zM2.75 12h18.5"/>
            </svg>
            <span className="max-w-[14rem] leading-snug">
              Um time distribuído construindo em todos os fusos horários.
            </span>
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
            <div>
              <p className="text-sm mb-2" style={{ color: "rgba(31,41,55,0.45)" }}>Siga a COUT</p>
              <div className="flex gap-2">
                {/* LinkedIn */}
                <a href="#" className="inline-grid place-items-center rounded-full transition-transform duration-300 hover:scale-110 text-sm"
                   style={{ width: "2.25rem", height: "2.25rem", background: "#3F7BD9", color: "#fff" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                {/* Instagram */}
                <a href="#" className="inline-grid place-items-center rounded-full transition-transform duration-300 hover:scale-110 text-sm"
                   style={{ width: "2.25rem", height: "2.25rem", background: "#F7F9FC", color: "rgba(31,41,55,0.7)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                {/* WhatsApp */}
                <a href="#" className="inline-grid place-items-center rounded-full transition-transform duration-300 hover:scale-110 text-sm"
                   style={{ width: "2.25rem", height: "2.25rem", background: "#F7F9FC", color: "rgba(31,41,55,0.7)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </a>
              </div>
            </div>

            <button
              className="inline-flex items-center gap-3 rounded-full text-sm font-medium transition-transform duration-300 hover:scale-[1.04]"
              style={{ border: "1px solid #E5E7EB", padding: "0.375rem 0.375rem 0.375rem 1.5rem" }}
            >
              Sobre nós
              <span className="inline-grid place-items-center rounded-full" style={{ width: "2.25rem", height: "2.25rem", background: "#0F2540", color: "#fff" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17 17 7M8 7h9v9"/>
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
