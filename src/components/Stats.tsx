"use client";

import { useEffect, useRef, useState } from "react";

const statsData = [
  { value: 40,  suffix: "+",  label: "Clientes ativos" },
  { value: 8,   suffix: "",   label: "Países atendidos" },
  { value: 99,  suffix: "%",  label: "Uptime da plataforma" },
  { value: 120, suffix: "k+", label: "Mensagens automatizadas/mês" },
];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelVisible, setPanelVisible] = useState(false);
  const [counts, setCounts] = useState(statsData.map(() => 0));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setPanelVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!panelVisible || started) return;
    setStarted(true);

    const duration = 2000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setCounts(statsData.map((s) => Math.round(ease * s.value)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [panelVisible, started]);

  return (
    <section className="bg-white">
      <div ref={ref} className="max-w-[88rem] mx-auto px-5 sm:px-8 pb-20 lg:pb-28">
        <div
          ref={panelRef}
          className="rounded-[2rem] p-12 sm:p-16 md:px-16"
          style={{
            background: "#0F2540",
            color: "#fff",
            opacity: panelVisible ? 1 : 0,
            transform: panelVisible ? "translateY(0) scale(1)" : "translateY(40px) scale(0.99)",
            transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2 t-body font-medium mb-4"
               style={{ color: "rgba(255,255,255,0.7)" }}>
            <span className="inline-block rounded-full" style={{ width: "0.375rem", height: "0.375rem", background: "rgba(255,255,255,0.6)" }}/>
            Em números
          </div>

          {/* Título */}
          <h2
            className="font-medium leading-tight tracking-tight max-w-[20ch] mb-14"
            style={{ fontSize: "var(--fs-h2)" }}
          >
            Prova no trabalho, não nas palavras.
          </h2>

          {/* Grid de métricas */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {statsData.map((s, i) => (
              <div
                key={i}
                style={{
                  opacity: panelVisible ? 1 : 0,
                  transform: panelVisible ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 90 + 200}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 90 + 200}ms`,
                }}
              >
                <p
                  className="font-semibold tracking-tight tabular-nums leading-none"
                  style={{ fontSize: "var(--fs-h1)" }}
                >
                  {counts[i]}{s.suffix}
                </p>
                <p className="mt-3 t-body" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
