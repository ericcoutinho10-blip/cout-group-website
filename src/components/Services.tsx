"use client";

import { useEffect, useRef, useState } from "react";

// Os cinco vieram do mockup do Canva (Eric, 05/08/2026). Grafia corrigida:
// "Growh Analitic" → "Growth Analytics".
//
// O mockup chamava a faixa de "Produtos". Mantive "Infraestrutura", que é o
// que a nav diz e o que o filme afirma — "Não é sobre uma ferramenta, é sobre
// infraestrutura". Chamar de produto contradiz a frase central do filme e
// rebaixa cinco partes de um sistema a cinco itens de catálogo. Por isso cada
// linha se descreve como parte do COUT OS, não como software avulso.
// `coming` é opcional e hoje ninguém usa — mas o JSX lê `s.coming`. Sem o tipo
// declarado, o TS infere a partir do array e a build de produção quebra (o dev
// não pega). Mesma armadilha que já custou uma publicação no CreateBand.
type Service = { idx: string; title: string; desc: string; coming?: boolean };

const services: Service[] = [
  { idx: "01", title: "CRM", desc: "O relacionamento inteiro num lugar só — sem planilha paralela, sem histórico perdido na troca de turno." },
  { idx: "02", title: "Dashboard", desc: "O estado real da operação em tempo real, para decidir com dado e não com impressão." },
  { idx: "03", title: "Agentes de IA", desc: "Inteligência autônoma para atendimento, triagem e análise — com revisão humana antes do que importa." },
  { idx: "04", title: "Growth Analytics", desc: "Onde o crescimento acontece, onde ele trava, e o que muda se você agir agora." },
  { idx: "05", title: "Comunicação", desc: "Cada mensagem no canal certo, na hora certa, sem ninguém precisar lembrar de mandar." },
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
          Infraestrutura
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
            O que construímos
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
