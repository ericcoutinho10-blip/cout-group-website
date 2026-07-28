"use client";

import { useEffect, useState } from "react";

interface HeaderProps {
  ready: boolean;
  onOpenMenu: () => void;
  onOpenModal: () => void;
  onScrollTo: (id: string) => void;
}

export default function Header({ ready, onOpenMenu, onOpenModal, onScrollTo }: HeaderProps) {
  const [time, setTime] = useState("9:41am");
  const [date, setDate] = useState("12 Março, 2025");

  useEffect(() => {
    const months = [
      "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
      "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",
    ];
    const update = () => {
      const now = new Date();
      const h = now.getHours() % 12 || 12;
      const m = String(now.getMinutes()).padStart(2, "0");
      const mer = now.getHours() < 12 ? "am" : "pm";
      setTime(`${h}:${m}${mer}`);
      setDate(`${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header
      className="absolute inset-x-0 top-0 z-50"
      style={{
        opacity: ready ? 1 : 0,
        transform: ready ? "translateY(0)" : "translateY(-14px)",
        transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s",
      }}
    >
      <div className="max-w-[88rem] mx-auto px-5 sm:px-8 flex items-center justify-between gap-6 py-5 sm:py-6">
        {/* Logo */}
        <button
          onClick={() => onScrollTo("home")}
          className="flex items-center gap-2 font-semibold text-lg tracking-tight transition-transform duration-300 hover:scale-[1.04]"
          style={{ color: "#0F2540" }}
        >
          <span style={{ color: "#3F7BD9", fontSize: "1.5rem", fontWeight: 700 }}>C</span>
          COUT Group
        </button>

        {/* Nav desktop */}
        <nav className="hidden lg:flex gap-8 text-sm font-medium" style={{ color: "#1F2937" }}>
          {[
            { label: "Início", id: "home" },
            { label: "Sobre", id: "about" },
            { label: "Produtos", id: "services" },
            { label: "Cases", id: "works" },
            { label: "Contato", id: "modal" },
          ].map(({ label, id }) => (
            <button
              key={id}
              onClick={() => id === "modal" ? onOpenModal() : onScrollTo(id)}
              className="transition-all duration-200 hover:opacity-100 hover:-translate-y-px opacity-70"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Relógio + menu */}
        <div className="flex items-center gap-3">
          <div
            className="hidden md:flex items-center gap-3 text-xs rounded-[0.875rem] px-3 py-2"
            style={{
              border: "1px solid rgba(15,37,64,0.15)",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(4px)",
              color: "rgba(31,41,55,0.7)",
            }}
          >
            <span style={{ color: "rgba(31,41,55,0.45)" }}>Horário local</span>
            <span className="tabular-nums font-medium" style={{ color: "#1F2937", minWidth: "3.5rem" }}>{time}</span>
            <span style={{ color: "rgba(31,41,55,0.3)" }}>•</span>
            <span className="font-medium">{date}</span>
          </div>

          <button
            onClick={onOpenMenu}
            className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest rounded-[0.875rem] px-4 py-2 transition-all duration-200 hover:bg-white/90"
            style={{
              border: "1px solid rgba(15,37,64,0.15)",
              background: "rgba(255,255,255,0.5)",
              backdropFilter: "blur(4px)",
              letterSpacing: "0.05em",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <span className="hidden sm:inline">Menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
