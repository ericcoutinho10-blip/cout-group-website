"use client";

import { useEffect, useRef, useState } from "react";

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

const ORGANIZACOES = [
  "Dr. Hussein Awada",
  "Indústrias Suavetex",
  "Iman Hammoud",
];

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
        setTimeout(() => setFase(1), 3000),
        setTimeout(() => setFase(2), 4200),
        setTimeout(() => setFase(3), 5400),
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
      className="relative flex min-h-[100dvh] flex-col items-center justify-center bg-cout-navy text-center"
      style={{ paddingInline: "var(--outer-margin)" }}
      aria-label="Depois do filme"
    >
      {/* a linha — 1px, quase nada, mas é ela que anuncia que algo continua */}
      <div
        aria-hidden="true"
        className="h-px bg-white/25"
        style={{
          width: fase >= 1 ? "min(22rem, 60vw)" : "0rem",
          transition: "width 1400ms cubic-bezier(0.22,1,0.36,1)",
        }}
      />

      <p
        className="t-h2 mt-10 text-white"
        style={surge(fase >= 2)}
      >
        Vamos construir algo único.
      </p>

      <button
        onClick={onAbrir}
        className="t-label mt-12 rounded-full border border-white/30 px-9 py-4 text-white transition-colors duration-500 hover:border-white/70 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/60"
        style={{ ...surge(fase >= 3, 200), pointerEvents: fase >= 3 ? "auto" : "none" }}
      >
        Começar
      </button>

      {/* a prova, sussurrada: só os nomes, sem logo, sem métrica, sem elogio */}
      <div
        className="absolute inset-x-0 bottom-[7vh]"
        style={{ ...surge(fase >= 3, 900), paddingInline: "var(--outer-margin)" }}
      >
        <p className="t-label text-white/35">
          Algumas organizações que confiaram na COUT
        </p>
        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-2">
          {ORGANIZACOES.map((nome) => (
            <li key={nome} className="t-body font-light text-white/55">
              {nome}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
