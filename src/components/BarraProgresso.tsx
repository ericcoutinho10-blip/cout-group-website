"use client";

import { useEffect, useRef } from "react";

/* Linha de 2px no topo. Cinema não tem barra de progresso porque cinema é
 * passivo — aqui o visitante move o filme com o próprio dedo, e quem faz o
 * esforço merece saber quanto falta. Quase invisível de propósito. */
export default function BarraProgresso() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const atualizar = () => {
      const alcance = document.documentElement.scrollHeight - window.innerHeight;
      const p = alcance > 0 ? window.scrollY / alcance : 0;
      el.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
      raf = 0;
    };
    const aoRolar = () => {
      if (!raf) raf = requestAnimationFrame(atualizar);
    };

    atualizar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]"
    >
      <div
        ref={ref}
        className="h-full origin-left bg-cout-blue/70"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
