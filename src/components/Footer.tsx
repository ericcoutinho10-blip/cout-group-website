"use client";

import { useEffect, useRef, useState } from "react";
import MarcaCout from "./MarcaCout";

interface FooterProps {
  onOpenModal: () => void;
  onScrollTo: (id: string) => void;
}

/* Todo item leva a um destino que existe. A lista anterior apontava para
   #services (secao que nao existe mais), #modal (formulario removido) e
   href="#" nas redes, que nao levava a lugar nenhum. Link que nao leva a
   nada e pior do que link ausente: quebra a confianca no resto. */
const cols = [
  {
    title: "Empresa",
    links: [
      { label: "Quem Somos", href: "#quem-somos" },
      { label: "Cultura", href: "#cultura" },
      { label: "COUT NEWS", href: "#cout-news" },
    ],
  },
  {
    title: "Infraestrutura",
    links: [
      { label: "Relacionamento", href: "#infraestrutura" },
      { label: "Inteligência", href: "#infraestrutura" },
      { label: "Operação", href: "#infraestrutura" },
      { label: "Crescimento", href: "#infraestrutura" },
      { label: "Comunicação", href: "#infraestrutura" },
    ],
  },
  {
    title: "Falar com a COUT",
    links: [
      { label: "Entre em contato", href: "#contato" },
    ],
  },
];

export default function Footer({ onOpenModal, onScrollTo }: FooterProps) {
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
    <footer
      className="relative overflow-hidden"
      style={{ background: "#0F2540", color: "#fff" }}
    >
      <div ref={ref} className="relative z-10 max-w-[88rem] mx-auto px-5 sm:px-8 pt-20 lg:pt-24 pb-10">
        {/* CTA row */}
        <div
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 pb-16 mb-16"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
        >
          <h2
            className="font-light tracking-tight max-w-[18ch] leading-tight"
            style={{
              fontSize: "clamp(2.25rem, 4vw, 3.75rem)",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 900ms cubic-bezier(0.215,0.61,0.355,1), transform 900ms cubic-bezier(0.215,0.61,0.355,1)",
            }}
          >
            Tem um projeto em mente? Vamos trabalhar juntos.
          </h2>

          <button
            onClick={onOpenModal}
            className="group inline-flex items-center gap-3 rounded-full text-sm font-medium shrink-0 transition-transform duration-300 hover:scale-[1.04]"
            style={{
              background: "#F7F9FC", color: "#0F2540",
              padding: "0.375rem 0.375rem 0.375rem 1.5rem",
            }}
          >
            Falar com um especialista
            <span
              className="inline-grid place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{ width: "2.25rem", height: "2.25rem", background: "#0F2540", color: "#fff" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17 17 7M8 7h9v9"/>
              </svg>
            </span>
          </button>
        </div>

        {/* Colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 mb-10"
             style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          {/* Marca */}
          <div>
            <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <MarcaCout altura="1.5rem" />
              COUT Group
            </div>
            <p className="text-sm leading-relaxed max-w-[20rem]" style={{ color: "rgba(255,255,255,0.55)" }}>
              {/* "Estúdio independente construindo marcas e produtos" era
                  descricao de agencia de design — o oposto do que o site
                  inteiro afirma. A COUT constroi infraestrutura. */}
              A infraestrutura que conecta pessoas, dados e decisões — invisível, silenciosa, inteligente.
            </p>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <p className="text-xs uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
                {col.title}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {"externo" in link && link.externo ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm opacity-65 transition-all duration-200 hover:translate-x-1 hover:opacity-100 inline-block"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => onScrollTo(link.href.slice(1))}
                        className="text-sm transition-all duration-200 hover:translate-x-1 hover:opacity-100 opacity-65 text-left"
                      >
                        {link.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
             style={{ color: "rgba(255,255,255,0.45)" }}>
          <span>© 2025 COUT Group. Todos os direitos reservados.</span>
          <div className="flex gap-6">
            <a href="https://wa.me/5511949545284" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-70 transition-opacity">Privacidade</a>
            <a href="https://wa.me/5511949545284" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 opacity-70 transition-opacity">Termos</a>
          </div>
        </div>
      </div>

      {/* A marca d'água gigante saiu: era ornamento, não informação, e
          suja o fundo do rodapé. A marca já se apresenta no header. */}
    </footer>
  );
}
