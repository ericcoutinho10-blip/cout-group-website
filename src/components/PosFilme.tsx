"use client";

import { useEffect, useRef, useState } from "react";
import MarcaCout from "./MarcaCout";

/* ─────────────────────────────────────────────────────────────────────
 * A DOBRADIÇA
 *
 * O filme termina com o logo e "The Future Starts Now" — isso é o Ato V,
 * já está gravado nos quadros. Aqui começa o que vem DEPOIS: a pausa, a
 * linha, o convite e a porta.
 *
 * A pausa de 3s é o elemento mais importante deste componente. É ela que
 * separa o filme da conversa — sem ela, a marca vira anúncio. Nada aqui
 * pode aparecer antes de a pausa terminar.
 * ──────────────────────────────────────────────────────────────────── */


export default function PosFilme({ onAbrir }: { onAbrir: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const [fase, setFase] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timers: ReturnType<typeof setTimeout>[] = [];
    let iniciado = false;

    const iniciar = () => {
      if (iniciado) return;
      iniciado = true;
      obs.disconnect();
      window.removeEventListener("scroll", aoRolar);

      if (reduzido) {
        setFase(3);
        return;
      }
      // 3s de silêncio, depois a linha, depois a frase, depois a porta
      timers = [
        setTimeout(() => setFase(1), 1500),
        setTimeout(() => setFase(2), 2300),
        setTimeout(() => setFase(3), 2900),
      ];
    };

    /* Caminho alternativo: o IntersectionObserver não entrega callback em
     * algumas situações (aba em segundo plano, por exemplo). Medir a posição
     * no scroll garante que a sequência sempre começa. */
    const visivelOSuficiente = () => {
      const r = el.getBoundingClientRect();
      const vis = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      return r.height > 0 && vis / r.height >= 0.6;
    };
    const aoRolar = () => {
      if (visivelOSuficiente()) iniciar();
    };

    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) iniciar(); },
      { threshold: 0.6 }
    );
    obs.observe(el);
    window.addEventListener("scroll", aoRolar, { passive: true });
    aoRolar(); // caso já esteja em vista no primeiro render

    return () => {
      obs.disconnect();
      window.removeEventListener("scroll", aoRolar);
      timers.forEach(clearTimeout);
    };
  }, []);

  const surge = (ativo: boolean, atraso = 0): React.CSSProperties => ({
    opacity: ativo ? 1 : 0,
    transform: ativo ? "translateY(0)" : "translateY(10px)",
    transition: `opacity 1200ms cubic-bezier(0.22,1,0.36,1) ${atraso}ms, transform 1200ms cubic-bezier(0.22,1,0.36,1) ${atraso}ms`,
  });

  return (
    <section
      ref={ref}
      id="pos-filme"
      className="relative flex min-h-[72vh] flex-col items-center justify-center bg-white px-[var(--outer-margin)] py-[clamp(5rem,12vh,8rem)] text-center"
      style={{ paddingInline: "var(--outer-margin)" }}
      aria-label="Depois do filme"
    >
      {/* a linha — 1px, quase nada, mas é ela que anuncia que algo continua */}
      <div
        aria-hidden="true"
        className="h-px bg-cout-navy/20"
        style={{
          width: fase >= 1 ? "min(22rem, 60vw)" : "0rem",
          transition: "width 1400ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      {/* "Vamos construir algo único." e as organizações mudaram para o FIM
          do site (componente Fechamento), como o Eric pediu — no mockup do
          Canva elas fecham a página, não abrem o conteúdo. Aqui fica só a
          passagem: a pausa e o convite para continuar. */}
      {/* A marca fecha o filme, como na tela do Canva. Antes esta tela tinha
          só uma linha e um botão em 100dvh — muito vazio para muito scroll.
          "Vamos construir algo único." não se repete aqui: ela fecha o site. */}
      {/* Fundo branco com a marca em azul, como no PNG que o Eric mandou.
          A MarcaCout usa mascara CSS: a cor vem do `text-` do pai, entao a
          mesma imagem serve clara sobre o filme e azul sobre o branco —
          nao existe um segundo arquivo para manter em sincronia. */}
      <div className="mt-12 text-cout-navy" style={surge(fase >= 2)}>
        <MarcaCout altura="clamp(3rem, 7vw, 4.75rem)" />
        <p className="t-h3 mt-5 font-light">COUT OS</p>
      </div>

      <button
        onClick={onAbrir}
        className="t-label mt-12 rounded-full border border-cout-navy/30 px-9 py-4 text-cout-navy transition-colors duration-500 hover:border-cout-navy/70 hover:bg-cout-navy/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cout-navy/60"
        style={{ ...surge(fase >= 3, 200), pointerEvents: fase >= 3 ? "auto" : "none" }}
      >
        Continuar
      </button>

    </section>
  );
}
