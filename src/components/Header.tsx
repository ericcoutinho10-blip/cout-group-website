"use client";

import { useEffect, useState } from "react";
import MarcaCout from "./MarcaCout";

/* ─────────────────────────────────────────────────────────────────────
 * O header vive sobre dois fundos opostos: o filme (navy, quase preto) e
 * o Universo COUT (branco). Cor fixa reprova num dos dois — a versão
 * anterior media 1,04:1 de contraste sobre o filme, contra o mínimo de
 * 4,5:1 da WCAG. Por isso ele inverte conforme o que está atrás.
 * ──────────────────────────────────────────────────────────────────── */

/** Destinos do Universo COUT — a arquitetura, não rótulos genéricos. */
/* O Journal entra aqui quando tiver os três primeiros textos. Journal vazio
 * sinaliza abandono — é pior do que não ter. */
export const DESTINOS = [
  { label: "Manifesto", id: "manifesto" },
  { label: "Filosofia", id: "filosofia" },
  { label: "Quem Somos", id: "quem-somos" },
  { label: "Como Pensamos", id: "como-pensamos" },
  { label: "Infraestrutura", id: "infraestrutura" },
] as const;

interface HeaderProps {
  ready: boolean;
  onOpenMenu: () => void;
  onOpenModal: () => void;
  onIrPara: (id: string) => void;
}

export default function Header({ ready, onOpenMenu, onOpenModal, onIrPara }: HeaderProps) {
  const [time, setTime] = useState("9:41am");
  const [date, setDate] = useState("12 Março, 2025");
  const [sobreClaro, setSobreClaro] = useState(false);

  useEffect(() => {
    const meses = [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
    ];
    const update = () => {
      const now = new Date();
      const h = now.getHours() % 12 || 12;
      const m = String(now.getMinutes()).padStart(2, "0");
      const mer = now.getHours() < 12 ? "am" : "pm";
      setTime(`${h}:${m}${mer}`);
      setDate(`${now.getDate()} ${meses[now.getMonth()]}, ${now.getFullYear()}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  /* Mede por posição de scroll, não por IntersectionObserver: o observer não
   * entrega callback em aba de segundo plano, e aqui errar significa texto
   * invisível. */
  useEffect(() => {
    const medir = () => {
      const universo = document.getElementById("universo");
      setSobreClaro(!!universo && universo.getBoundingClientRect().top <= 80);
    };
    medir();
    window.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("cout:layout", medir);
    return () => {
      window.removeEventListener("scroll", medir);
      window.removeEventListener("cout:layout", medir);
    };
  }, []);

  const tinta = sobreClaro ? "15 37 64" : "255 255 255";
  const suave = "color 500ms ease, border-color 500ms ease, background-color 500ms ease";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(-14px)",
        transition:
          "opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s",
      }}
    >
      <div className="mx-auto flex max-w-[88rem] items-center justify-between gap-6 px-5 py-5 sm:px-8 sm:py-6">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2 text-lg font-semibold tracking-tight transition-transform duration-300 hover:scale-[1.04]"
          style={{ color: `rgb(${tinta})`, transition: suave }}
        >
          <MarcaCout altura="1.35rem" />
          COUT Group
        </button>

        <nav className="hidden gap-7 text-sm lg:flex">
          {DESTINOS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => onIrPara(id)}
              className="transition-opacity duration-200 hover:opacity-100"
              style={{ color: `rgb(${tinta} / 0.78)`, transition: suave }}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="hidden items-center gap-3 rounded-[0.875rem] px-3 py-2 text-xs md:flex"
            style={{
              border: `1px solid rgb(${tinta} / 0.22)`,
              background: `rgb(${tinta} / 0.07)`,
              backdropFilter: "blur(6px)",
              color: `rgb(${tinta} / 0.78)`,
              transition: suave,
            }}
          >
            <span style={{ color: `rgb(${tinta} / 0.55)` }}>Horário local</span>
            <span
              className="font-medium tabular-nums"
              style={{ minWidth: "3.5rem", color: `rgb(${tinta})` }}
            >
              {time}
            </span>
            <span style={{ color: `rgb(${tinta} / 0.4)` }}>•</span>
            <span className="font-medium">{date}</span>
          </div>

          <button
            onClick={onOpenMenu}
            className="t-label flex items-center gap-2 rounded-[0.875rem] px-4 py-2"
            style={{
              border: `1px solid rgb(${tinta} / 0.22)`,
              background: `rgb(${tinta} / 0.07)`,
              backdropFilter: "blur(6px)",
              color: `rgb(${tinta})`,
              transition: suave,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="hidden sm:inline">Menu</span>
          </button>

          <button
            onClick={onOpenModal}
            className="t-label hidden rounded-full px-5 py-2.5 sm:inline-flex"
            style={{
              border: `1px solid rgb(${tinta} / 0.38)`,
              color: `rgb(${tinta})`,
              transition: suave,
            }}
          >
            Falar com um especialista
          </button>
        </div>
      </div>
    </header>
  );
}
