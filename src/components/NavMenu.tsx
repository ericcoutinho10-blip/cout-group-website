"use client";

import { useEffect } from "react";
import MarcaCout from "./MarcaCout";

interface NavMenuProps {
  open: boolean;
  onClose: () => void;
  onOpenModal: () => void;
  onScrollTo: (id: string) => void;
}

const items = [
  // Ordem SEQUENCIAL: a nav segue a ordem em que as secoes aparecem na
  // pagina. Clicar num destino leva para a tela correspondente, entao a
  // barra precisa ser um mapa do percurso — nao uma lista arbitraria.
  { label: "Cultura", id: "cultura" },
  { label: "Quem Somos", id: "quem-somos" },
  { label: "Infraestrutura", id: "infraestrutura" },
  { label: "Cout News", id: "cout-news" },
  { label: "Entre em Contato", id: "contato" },
];

export default function NavMenu({ open, onClose, onOpenModal, onScrollTo }: NavMenuProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handle = (id: string) => {
    onClose();
    setTimeout(() => {
      if (id === "modal") onOpenModal();
      else onScrollTo(id);
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-[115] flex flex-col"
      style={{
        background: "#fff",
        color: "#0F2540",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "all" : "none",
        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* Topo */}
      <div className="max-w-[88rem] mx-auto w-full px-5 sm:px-8 flex items-center justify-between py-5">
        <div className="flex items-center gap-2 text-lg font-semibold text-cout-navy">
          <MarcaCout altura="1.5rem" />
          COUT Group
        </div>
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest rounded-[0.875rem] px-4 py-2 transition-all duration-200"
          style={{
            border: "1px solid rgba(15,37,64,0.18)",
            color: "rgba(15,37,64,0.7)",
            letterSpacing: "0.05em",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l16 16M20 4 4 20"/>
          </svg>
          Fechar
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 max-w-[88rem] mx-auto w-full px-5 sm:px-8 flex flex-col justify-center">
        <ul className="flex flex-col gap-1">
          {items.map(({ label, id }, i) => (
            <li key={id}>
              <button
                onClick={() => handle(id)}
                className="flex items-center gap-4 w-full text-left py-2 font-semibold tracking-tight transition-all duration-300"
                style={{
                  fontSize: "var(--fs-h1)",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(1rem)",
                  transition: `opacity 0.5s ease-out ${i * 45 + 80}ms, transform 0.5s ease-out ${i * 45 + 80}ms`,
                }}
              >
                <span className="text-base font-normal" style={{ color: "rgba(15,37,64,0.35)" }}>
                  0{i + 1}
                </span>
                <span style={{ color: "rgba(15,37,64,0.75)" }} className="hover:text-cout-navy transition-colors duration-200">
                  {label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Rodapé do menu */}
      <div
        className="max-w-[88rem] mx-auto w-full px-5 sm:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-6 text-xs uppercase tracking-widest"
        style={{ borderTop: "1px solid rgba(15,37,64,0.10)", color: "rgba(15,37,64,0.5)" }}
      >
        {/* O "Horário local" saiu daqui também — ele não existe no mockup do
            Canva e não ajuda ninguém a decidir nada. Sobrou só o convite. */}
        <span>COUT Group</span>
        <button
          onClick={() => handle("modal")}
          className="text-left transition-colors duration-200 hover:underline"
          style={{ color: "rgba(15,37,64,0.75)" }}
        >
          Falar com um especialista →
        </button>
      </div>
    </div>
  );
}
