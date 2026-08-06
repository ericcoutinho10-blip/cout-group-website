/**
 * Ponto único de configuração do contato.
 *
 * O número de WhatsApp é do Eric e eu não invento dado real dele — um número
 * errado num site publicado manda visitante para desconhecido. Enquanto
 * `WHATSAPP` estiver vazio, a interface não oferece o caminho do WhatsApp:
 * ela recolhe o contexto e diz que o time responde. Nada quebra, e nada mente.
 *
 * Para ligar: preencher com DDI+DDD+número, só dígitos. Ex.: "5511999999999".
 */
export const WHATSAPP = "";

export const WHATSAPP_ATIVO = /^\d{12,15}$/.test(WHATSAPP);

/** Áreas que a triagem reconhece. Espelham a faixa de Infraestrutura. */
export const AREAS = [
  { id: "atendimento", label: "Atendimento e agendamento" },
  { id: "dados", label: "Dados e decisão" },
  { id: "operacao", label: "Operação e processos" },
  { id: "outro", label: "Outra coisa" },
] as const;

export type AreaId = (typeof AREAS)[number]["id"];

export type Lead = {
  nome: string;
  organizacao: string;
  area: AreaId | "";
  contexto: string;
  /** de onde veio, para o time saber o que a pessoa já viu */
  origem: string;
};

/**
 * Monta a mensagem que abre no WhatsApp já com a pré-análise feita.
 *
 * O ponto do pré-atendimento é este: quem recebe não começa do zero. A
 * conversa chega com nome, organização, área e o que a pessoa descreveu.
 */
export function mensagemWhatsApp(lead: Lead): string {
  const area = AREAS.find((a) => a.id === lead.area)?.label ?? "não informada";
  return [
    `Olá! Vim pelo site da COUT.`,
    ``,
    `Nome: ${lead.nome || "—"}`,
    `Organização: ${lead.organizacao || "—"}`,
    `Área: ${area}`,
    ``,
    `O que eu preciso:`,
    lead.contexto || "—",
  ].join("\n");
}

export function linkWhatsApp(lead: Lead): string {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagemWhatsApp(lead))}`;
}
