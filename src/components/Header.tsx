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
// Ordem definida pelo Eric no mockup do Canva (05/08/2026). "Manifesto" e
// "Como Pensamos" saíram: eram rótulos de seção, não destinos que alguém
// procura. Contato entra na nav porque é o único item que o visitante pode
// querer a qualquer momento, sem ter rolado nada.
export const DESTINOS = [
  { label: "Quem Somos", id: "quem-somos" },
  { label: "Infraestrutura", id: "infraestrutura" },
  { label: "COUT NEWS", id: "cout-news" },
  { label: "Cultura", id: "cultura" },
  { label: "Entre em Contato", id: "contato" },
] as const;

interface HeaderProps {
  ready: boolean;
  onOpenMenu: () => void;
  onIrPara: (id: string) => void;
}

export default function Header({ ready, onOpenMenu, onIrPara }: HeaderProps) {
  const [sobreClaro, setSobreClaro] = useState(false);
  const [escondido, setEscondido] = useState(false);

  /* Mede por posição de scroll, não por IntersectionObserver: o observer não
   * entrega callback em aba de segundo plano, e aqui errar significa texto
   * invisível. */
  useEffect(() => {
    let ultimoY = 0;
    const medir = () => {
      const universo = document.getElementById("universo");
      setSobreClaro(!!universo && universo.getBoundingClientRect().top <= 80);

      /* A barra some ao descer e volta ao subir. Some só depois de 120px,
       * senão pisca em rolagem curta; e volta inteira ao primeiro gesto para
       * cima, que é quando a pessoa está procurando navegação. */
      const y = window.scrollY;
      setEscondido(y > 120 && y > ultimoY);
      ultimoY = y;
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

  /* Curva e duração medidas no rolex.com em 05/08/2026 — eles usam UMA curva
   * no site inteiro e só 0,3s/0,4s. Rápido com desaceleração forte, não lento:
   * a elegância vem da curva, não da demora. */
  const suave =
    "color 400ms cubic-bezier(.23,1,.32,1), border-color 400ms cubic-bezier(.23,1,.32,1), background-color 400ms cubic-bezier(.23,1,.32,1)";

  return (
    <header
      className="fixed inset-x-0 top-0 z-50"
      style={{
        opacity: ready && !escondido ? 1 : 0,
        transform: ready && !escondido ? "translateY(0)" : "translateY(-110%)",
        pointerEvents: escondido ? "none" : "auto",
        transition:
          "opacity 400ms cubic-bezier(.23,1,.32,1), transform 400ms cubic-bezier(.23,1,.32,1)",
      }}
    >
      {/* UMA pílula só, como no mockup do Canva: menu, destinos e a marca
          fechando à direita, tudo dentro do mesmo contorno. Saíram daqui o
          relógio de horário local e o botão solto de especialista — o
          relógio não é informação que ajude ninguém a decidir, e o CTA já
          vive na dobradiça depois do filme e no rodapé. Um contorno só
          também é o que faz a barra ler como objeto, não como três coisas
          empilhadas. */}
      <div className="mx-auto flex max-w-[88rem] justify-center px-4 py-5 sm:px-6 sm:py-6">
        <div
          className="flex items-center gap-1 rounded-full px-2 py-1.5 sm:gap-2 sm:px-3"
          style={{
            border: `1px solid rgb(${tinta} / 0.30)`,
            background: `rgb(${tinta === "255 255 255" ? "15 37 64" : "255 255 255"} / 0.18)`,
            backdropFilter: "blur(10px)",
            transition: suave,
          }}
        >
          <button
            onClick={onOpenMenu}
            className="flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-[0.95rem] font-normal"
            style={{ color: `rgb(${tinta})`, transition: suave }}
            aria-label="Abrir o menu"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <path d="M4 8h16M4 16h16" />
            </svg>
            Menu
          </button>

          <nav className="hidden items-center lg:flex">
            {DESTINOS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => onIrPara(id)}
                className="whitespace-nowrap rounded-full px-3 py-2 text-[0.95rem] font-normal xl:px-4"
                style={{ color: `rgb(${tinta} / 0.82)`, transition: suave }}
                onMouseEnter={(e) => (e.currentTarget.style.color = `rgb(${tinta})`)}
                onMouseLeave={(e) => (e.currentTarget.style.color = `rgb(${tinta} / 0.82)`)}
              >
                {label}
              </button>
            ))}
          </nav>

          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="ml-1 flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-base font-medium tracking-tight sm:ml-2"
            style={{ color: `rgb(${tinta})`, transition: suave }}
            aria-label="Voltar ao topo"
          >
            <MarcaCout altura="1.3rem" />
            <span className="hidden sm:inline">COUT Group</span>
          </button>
        </div>
      </div>
    </header>
  );
}
