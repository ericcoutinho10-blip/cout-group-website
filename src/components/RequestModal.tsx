"use client";

import { useEffect, useRef, useState } from "react";

interface RequestModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RequestModal({ open, onClose }: RequestModalProps) {
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setTimeout(() => { setSuccess(false); setSending(false); }, 300);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => setSuccess(true), 900);
  };

  const inputCls = {
    width: "100%",
    border: "1px solid #E5E7EB",
    background: "rgba(247,249,252,0.5)",
    borderRadius: "0.875rem",
    padding: "0.75rem 1rem",
    fontSize: "0.875rem",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s, background 0.2s",
  } as React.CSSProperties;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4"
      style={{
        background: "rgba(31,41,55,0.3)",
        backdropFilter: "blur(16px)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "all" : "none",
        transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}
      onClick={onClose}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-lg rounded-[2rem] bg-white p-6 sm:p-8"
        style={{
          boxShadow: "0 24px 48px -12px rgba(0,0,0,0.25)",
          outline: "1px solid #E5E7EB",
          transform: open ? "translateY(0)" : "translateY(28px)",
          opacity: open ? 1 : 0,
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-grid place-items-center rounded-full transition-colors duration-200"
          style={{ width: "2.25rem", height: "2.25rem", background: "#F7F9FC", color: "rgba(31,41,55,0.6)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 4l16 16M20 4 4 20"/>
          </svg>
        </button>

        {!success ? (
          <>
            {/* Cabeçalho */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 text-sm font-medium mb-1" style={{ color: "rgba(31,41,55,0.6)" }}>
                <span className="inline-block rounded-full" style={{ width: "0.375rem", height: "0.375rem", background: "#3F7BD9" }}/>
                Agendar conversa
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Conta o que você está construindo.
              </h2>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "rgba(31,41,55,0.5)" }}>
                  Nome
                </label>
                <input type="text" required placeholder="Seu nome" style={inputCls}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(31,41,55,0.3)"; e.currentTarget.style.background = "#fff"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "rgba(247,249,252,0.5)"; }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "rgba(31,41,55,0.5)" }}>
                  E-mail
                </label>
                <input type="email" required placeholder="voce@empresa.com" style={inputCls}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(31,41,55,0.3)"; e.currentTarget.style.background = "#fff"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "rgba(247,249,252,0.5)"; }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest mb-1.5" style={{ color: "rgba(31,41,55,0.5)" }}>
                  Projeto
                </label>
                <textarea required rows={4} placeholder="Alguns detalhes sobre o projeto, prazo e orçamento."
                  style={{ ...inputCls, resize: "none" }}
                  onFocus={e => { e.currentTarget.style.borderColor = "rgba(31,41,55,0.3)"; e.currentTarget.style.background = "#fff"; }}
                  onBlur={e => { e.currentTarget.style.borderColor = "#E5E7EB"; e.currentTarget.style.background = "rgba(247,249,252,0.5)"; }}
                />
              </div>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs" style={{ color: "rgba(31,41,55,0.45)" }}>
                  Respondemos em até um dia útil.
                </p>
                <button
                  type="submit"
                  disabled={sending}
                  className="group inline-flex items-center gap-3 rounded-full text-sm font-medium transition-transform duration-300 hover:scale-[1.04] disabled:opacity-60"
                  style={{ background: "#0F2540", color: "#fff", padding: "0.375rem 0.375rem 0.375rem 1.5rem" }}
                >
                  {sending ? "Enviando…" : "Enviar"}
                  {!sending && (
                    <span className="inline-grid place-items-center rounded-full" style={{ width: "2.25rem", height: "2.25rem", background: "#3F7BD9", color: "#fff" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M7 17 17 7M8 7h9v9"/>
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center py-8 gap-4">
            <div className="inline-grid place-items-center rounded-full text-2xl" style={{ width: "3.5rem", height: "3.5rem", background: "#0F2540", color: "#3F7BD9" }}>
              C
            </div>
            <h2 className="text-2xl font-semibold">Mensagem recebida!</h2>
            <p className="max-w-[30ch] text-sm leading-relaxed" style={{ color: "rgba(31,41,55,0.6)" }}>
              Obrigado pelo contato — retornamos em até um dia útil.
            </p>
            <button
              onClick={onClose}
              className="mt-2 inline-flex items-center gap-3 rounded-full text-sm font-medium transition-transform duration-300 hover:scale-[1.04]"
              style={{ background: "#0F2540", color: "#fff", padding: "0.875rem 1.75rem" }}
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
