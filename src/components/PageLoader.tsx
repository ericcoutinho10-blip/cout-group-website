"use client";

import { useEffect, useRef, useState } from "react";
import MarcaCout from "./MarcaCout";

interface PageLoaderProps {
  onDone: () => void;
}

const FILL_MS = 1300;

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export default function PageLoader({ onDone }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [contentFading, setContentFading] = useState(false);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / FILL_MS, 1);
      const p = Math.round(easeInOutCubic(t) * 100);
      setProgress(p);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Iniciar exit
        setContentFading(true);
        setTimeout(() => {
          setExiting(true);
          setTimeout(() => onDone(), 700);
        }, 120);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    /* Saída de emergência por relógio de parede.
     *
     * O `requestAnimationFrame` não roda em aba de segundo plano — e abrir
     * link em aba nova é o caminho normal de quem compartilha o site. Sem
     * isto o visitante volta para a aba e encontra o contador parado em 000,
     * porque o `tick` nunca avançou. O `setTimeout` é estrangulado em aba
     * oculta, mas dispara; então o loader sempre termina, com ou sem quadros.
     *
     * Vale o dobro do tempo nominal: quem está vendo não percebe, e quem
     * não está vendo não fica preso. */
    const resgate = setTimeout(() => {
      if (startRef.current === null || performance.now() - startRef.current < FILL_MS) {
        setProgress(100);
        setContentFading(true);
        setExiting(true);
        onDone();
      }
    }, FILL_MS * 2 + 1500);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(resgate);
    };
  }, [onDone]);

  const padded = String(progress).padStart(3, "0");

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center gap-8"
      style={{
        background: "#0F2540",

        transform: exiting ? "translateY(-100%)" : "translateY(0%)",
        transition: exiting ? "transform 0.7s cubic-bezier(0.22,1,0.36,1)" : "none",
      }}
    >
      {/* Conteúdo central */}
      <div
        className="flex flex-col items-center gap-5 text-center"
        style={{
          opacity: contentFading ? 0 : 1,
          transform: contentFading ? "translateY(-12px)" : "translateY(0)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* Logo */}
        {/* a marca herda currentColor: sobre o navy do loader precisa ser clara */}
        <div className="flex items-center gap-3 text-white">
          <MarcaCout altura="2rem" />
          <span className="text-2xl font-semibold tracking-tight">
            COUT Group
          </span>
        </div>

        {/* Tagline */}
        <p className="max-w-[24ch] text-sm text-center leading-relaxed"
           style={{ color: "rgba(255,255,255,0.55)" }}>
          Infraestrutura Inteligente para o que vem a seguir.
        </p>
      </div>

      {/* Barra de progresso */}
      <div className="flex flex-col gap-3" style={{ width: "min(22rem, 72vw)" }}>
        <div
          className="w-full overflow-hidden"
          style={{ height: "1px", background: "rgba(255,255,255,0.15)" }}
        >
          <div
            style={{
              height: "100%",
              background: "#3F7BD9",
              width: `${progress}%`,
              transition: "width 0.1s ease-out",
            }}
          />
        </div>

        <div
          className="flex justify-between text-xs font-medium uppercase"
          style={{ letterSpacing: "0.05em", color: "rgba(255,255,255,0.45)" }}
        >
          <span>Carregando</span>
          <span
            className="tabular-nums"
            style={{ color: "rgba(255,255,255,0.8)" }}
          >
            {padded}
          </span>
        </div>
      </div>
    </div>
  );
}
