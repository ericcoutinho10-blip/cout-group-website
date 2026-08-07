"use client";

import { useEffect, useRef, useState } from "react";
import { AREAS, type AreaId, type Lead, WHATSAPP_ATIVO, linkWhatsApp } from "@/lib/contato";
import MarcaCout from "./MarcaCout";

/**
 * A COUT atendendo pelo próprio site.
 *
 * Um site que vende agentes de IA e atende por formulário de e-mail se
 * contradiz. Aqui a conversa faz a triagem — nome, organização, área e o
 * contexto — e entrega isso pronto para quem for responder, em vez de
 * despejar um formulário em branco na frente da pessoa.
 *
 * Roteiro fixo, de propósito. Site estático não tem servidor, e mandar a
 * conversa para um modelo pelo navegador exigiria chave de API exposta —
 * o erro que já existe nos workflows do Agente Integrativo e que não vou
 * repetir. Quando o n8n entrar, o webhook substitui `responder()` sem
 * mexer em mais nada: o formato do lead já é o final.
 */

type Fala = { de: "cout" | "pessoa"; texto: string };

const ABERTURA =
  "Oi. Sou o atendimento da COUT. Me conta em uma frase o que está travando hoje na sua operação — eu organizo o resto.";

type Etapa = "contexto" | "area" | "nome" | "organizacao" | "pronto";

export default function Concierge() {
  const [aberto, setAberto] = useState(false);
  const [etapa, setEtapa] = useState<Etapa>("contexto");
  const [falas, setFalas] = useState<Fala[]>([{ de: "cout", texto: ABERTURA }]);
  const [rascunho, setRascunho] = useState("");
  const [lead, setLead] = useState<Lead>({
    nome: "", organizacao: "", area: "", contexto: "", origem: "site",
  });
  const fimRef = useRef<HTMLDivElement>(null);
  const campoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fimRef.current?.scrollIntoView({ block: "end" });
  }, [falas, etapa]);

  useEffect(() => {
    if (aberto) campoRef.current?.focus();
  }, [aberto, etapa]);

  /* Qualquer CTA do site abre o atendimento por este evento — é o que
     substitui o modal de e-mail. Um lugar só para "quero falar". */
  useEffect(() => {
    const abrir = () => setAberto(true);
    window.addEventListener("cout:atendimento", abrir);
    return () => window.removeEventListener("cout:atendimento", abrir);
  }, []);

  /* Fecha no Esc — quem abriu por engano precisa de saída óbvia. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const diz = (texto: string) => setFalas((f) => [...f, { de: "cout", texto }]);
  const ouve = (texto: string) => setFalas((f) => [...f, { de: "pessoa", texto }]);

  function responder(valor: string) {
    const v = valor.trim();
    if (!v) return;
    ouve(v);
    setRascunho("");

    if (etapa === "contexto") {
      setLead((l) => ({ ...l, contexto: v }));
      diz("Entendi. Isso costuma cair em uma destas frentes — qual chega mais perto?");
      setEtapa("area");
    } else if (etapa === "nome") {
      setLead((l) => ({ ...l, nome: v }));
      diz("Prazer. E de qual organização você fala?");
      setEtapa("organizacao");
    } else if (etapa === "organizacao") {
      setLead((l) => ({ ...l, organizacao: v }));
      diz(
        WHATSAPP_ATIVO
          ? "Pronto. Levo tudo isso para o WhatsApp já escrito — é só apertar e enviar."
          : "Pronto. Já tenho o que precisava; nosso time responde com isso em mãos.",
      );
      setEtapa("pronto");
    }
  }

  function escolheArea(id: AreaId, label: string) {
    setLead((l) => ({ ...l, area: id }));
    ouve(label);
    diz("Certo. Como posso te chamar?");
    setEtapa("nome");
  }

  const bolha = (f: Fala, i: number) => (
    <div
      key={i}
      className={f.de === "cout" ? "self-start" : "self-end"}
      style={{ maxWidth: "88%" }}
    >
      <p
        className="rounded-[1.25rem] px-4 py-3 t-body leading-relaxed"
        style={
          f.de === "cout"
            ? { background: "rgb(var(--ice))", color: "rgb(var(--graphite))" }
            : { background: "rgb(var(--navy))", color: "#fff" }
        }
      >
        {f.texto}
      </p>
    </div>
  );

  return (
    <>
      {/* O convite. Discreto: quem quer conversar acha, quem não quer não
          tropeça. Sem balão pulsando nem "posso ajudar?" automático. */}
      <button
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        className="fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-full p-4 t-body shadow-lg sm:px-5 sm:py-3.5"
        style={{
          background: "rgb(var(--navy))",
          color: "#fff",
          transition: "transform 400ms cubic-bezier(.23,1,.32,1)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <MarcaCout altura="1.1rem" />
        {/* No celular so a marca: o rotulo por extenso ocupava metade da
            largura e cobria a legenda do filme. Medido em 390px. */}
        <span className="hidden sm:inline">{aberto ? "Fechar" : "Falar com a COUT"}</span>
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-label="Atendimento da COUT"
          className="fixed bottom-24 right-5 z-[70] flex w-[min(24rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[1.5rem]"
          style={{
            background: "rgb(var(--pure-white))",
            border: "1px solid rgb(var(--graphite) / 0.10)",
            boxShadow: "0 24px 60px rgb(15 37 64 / 0.18)",
            maxHeight: "min(32rem, calc(100dvh - 8rem))",
          }}
        >
          <div
            className="flex items-center gap-2.5 px-5 py-4"
            style={{ borderBottom: "1px solid rgb(var(--graphite) / 0.08)" }}
          >
            <MarcaCout altura="1.15rem" />
            <span className="t-body font-medium">COUT</span>
            <span className="t-label ml-auto" style={{ color: "rgb(var(--graphite) / 0.45)" }}>
              Atendimento
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-5">
            {falas.map(bolha)}

            {etapa === "area" && (
              <div className="mt-1 flex flex-wrap gap-2 self-start">
                {AREAS.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => escolheArea(a.id, a.label)}
                    className="rounded-full px-3.5 py-2 t-body"
                    style={{
                      border: "1px solid rgb(var(--graphite) / 0.18)",
                      color: "rgb(var(--graphite) / 0.85)",
                      transition: "background-color 400ms cubic-bezier(.23,1,.32,1)",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgb(var(--ice))")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            )}

            {etapa === "pronto" && WHATSAPP_ATIVO && (
              <a
                href={linkWhatsApp(lead)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 self-start rounded-full px-5 py-3 t-body"
                style={{ background: "rgb(var(--blue))", color: "#fff" }}
              >
                Continuar no WhatsApp →
              </a>
            )}

            <div ref={fimRef} />
          </div>

          {etapa !== "area" && etapa !== "pronto" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                responder(rascunho);
              }}
              className="flex items-center gap-2 px-4 py-4"
              style={{ borderTop: "1px solid rgb(var(--graphite) / 0.08)" }}
            >
              <input
                ref={campoRef}
                value={rascunho}
                onChange={(e) => setRascunho(e.target.value)}
                placeholder={
                  etapa === "contexto"
                    ? "Escreva em uma frase…"
                    : etapa === "nome"
                      ? "Seu nome"
                      : "Nome da organização"
                }
                className="flex-1 rounded-full px-4 py-2.5 t-body outline-none"
                style={{
                  background: "rgb(var(--ice))",
                  color: "rgb(var(--graphite))",
                }}
              />
              <button
                type="submit"
                aria-label="Enviar"
                className="grid shrink-0 place-items-center rounded-full"
                style={{
                  width: "2.5rem", height: "2.5rem",
                  background: "rgb(var(--navy))", color: "#fff",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
