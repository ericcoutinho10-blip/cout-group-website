# BRIEF — Site COUT Group com rolagem cinematográfica

> Adaptado de um prompt de referência para outro projeto. **A diferença estrutural: aquele projeto gerava os visuais do zero; o nosso já tem o filme pronto.** Toda a seção de geração virou inventário de uso.

---

## Objetivo

Transformar o site da COUT Group numa landing page contínua de qualidade premiada, com o filme institucional **001 — The Future Starts Now** dirigindo a experiência por rolagem: rolar para baixo avança o filme, rolar para cima o retorna, e os textos em HTML aparecem sincronizados com os momentos certos da imagem.

---

## 1. O que JÁ EXISTE — não gerar nada

Nenhum asset novo deve ser gerado no Higgsfield. O material está pronto e é lei:

| Asset | Caminho | O que é |
|---|---|---|
| Filme final | `cout-films/001-the-future-starts-now/assets/FILME_completo_v5.mp4` | 1:18, 1280×716, 24fps, mudo |
| Planos isolados | `.../assets/segments/*.mp4` | 16 planos, já normalizados |
| Stills 2K | `.../assets/keyframes/*.png` | 2752×1536, versão final de cada cena |
| Logo animada 4K | `.../assets/brand/logo_cout_animada_4k.mp4` | animação oficial da marca |
| Logo estática | `.../assets/brand/logo_cout_navy_trim.png` e `logo_cout_branca.png` | RGBA, fundo transparente |
| Sting de áudio | `.../assets/audio/logo_cout_sting.m4a` | som da animação da logo |
| DNA visual | `cout-films/001-the-future-starts-now/brief.md` | paleta, arquitetura, regras de câmera |

**Paleta obrigatória** (já implementada em `globals.css` como tokens `cout-*`): navy `#0F2540`, azul `#3F7BD9`, azul suave `#6C9DE4`, ice `#F7F9FC`, grafite `#1F2937`. Tipografia Poppins Light/Medium, já configurada via `next/font/google`. **Nada de âmbar, laranja ou preto puro** — o DNA do filme proíbe.

Se algum plano novo vier a ser necessário, ele sai do pipeline do filme (keyframe em `nano_banana_pro` → animação em `kling3_0`), respeitando o DNA e as correções registradas em `PRODUCTION.md`. Nunca inventar direção de arte nova.

---

## 2. Base técnica — o que o projeto já é

Não é um site estático para virar `index.html`. É **Next.js 16 (App Router) + Tailwind v4 + TypeScript**, com componentes já construídos em `src/components/`: `PageLoader`, `Header`, `Hero`, `About`, `PausaFilosofica`, `CreateBand`, `CaseStudies`, `Services`, `Stats`, `Footer`, `NavMenu`, `RequestModal`.

**Preservar todo o copy real desses componentes.** Eles não são placeholder: são o manifesto da marca já escrito em pt-BR. A tarefa é reencená-los sobre o filme, não substituí-los.

- `lenis` já está instalado.
- `gsap` **não** está — precisa ser adicionado, com `ScrollTrigger`.
- Componentes que usam GSAP/Lenis precisam de `'use client'` e registrar o plugin dentro de `useEffect`, nunca no topo do módulo (quebra no SSR).

---

## 3. A mecânica de rolagem

O filme não entra como `<video>` com `currentTime` — isso engasga em iOS e não faz scrub confiável. Entra como **sequência de quadros em `<canvas>`**, técnica de site de produto Apple.

**Extração:** 300 quadros de `FILME_completo_v5.mp4` distribuídos uniformemente pelos 78s, exportados em WebP a 1600px de largura, qualidade ~72, para `public/scroll/desktop/`. Uma segunda leva de 120 quadros a 800px para `public/scroll/mobile/`.

**Carregamento progressivo:** carregar primeiro 1 de cada 6 quadros (50 imagens) para que a rolagem já responda em segundos, e preencher os intermediários em segundo plano. Nunca travar a página esperando os 300.

**Sincronia:** `ScrollTrigger` com `pin` no canvas e `scrub: 1`, mapeando progresso de rolagem para índice de quadro. Lenis conduz o scroll suave e alimenta o `ScrollTrigger` via `lenis.on('scroll', ScrollTrigger.update)` e `gsap.ticker`.

**Regra de ouro:** rolar para trás tem que voltar os quadros exatamente. Nenhum salto, nenhum quadro vazio, nenhum flash branco entre seções.

---

## 4. O mapa — filme × seções

Os cinco atos do filme já têm objetivo emocional definido no brief, e eles casam com as seções do site. Este é o esqueleto da página:

| Trecho do filme | Seção do site | Texto que entra |
|---|---|---|
| **0–13s** — cidade ao amanhecer, médico chega, a mesa cheia de notificações, mãos digitando | **Hero + O problema** | H1 com line-reveal: "O futuro não é um destino." / "É uma infraestrutura." Depois, o reconhecimento: a pilha de tarefas que ninguém escolheu fazer |
| **13–34s** — a pergunta, as mãos se tocando, a IA na janela, a IA no painel, a recepção, o médico presente | **O que a COUT é** | Copy do `About` — "Existimos por um motivo". O toque das mãos é o clímax da seção: texto some, só imagem |
| **34–54s** — o hall com humanoides, WhatsApp respondendo sozinho, a IA apresentando resultados, a recepcionista presente | **Os pilares** | `Services` recolocado: COUT OS, Agentes de IA, Automação, HealthOS. Cada pilar entra quando o plano correspondente está na tela |
| **54–61s** — pausa preta, o médico sai no fim de tarde, o campus visto de cima | **Filosofia + Cases** | `PausaFilosofica` sobre o preto, e `CaseStudies` sobre o afastamento aéreo |
| **61–78s** — "The Future Starts Now." e a logo se formando | **CTA final** | O canvas assume sozinho. Sobre a logo formada, o CTA "Agendar conversa" abrindo o `RequestModal` |

**Regra:** nenhum texto, nome ou logo dentro do vídeo. Todo título, pilar e CTA é HTML real sobreposto — assim continua editável, acessível e indexável.

---

## 5. Conversão

A conversão é **"Agendar conversa"**, abrindo o `RequestModal` que já existe. Não é WhatsApp: a COUT vende infraestrutura para clínicas, o ciclo é consultivo. O CTA aparece no header (discreto), ao fim do Ato III (quando o espectador já viu o que a coisa faz) e no fechamento sobre a logo.

---

## 6. Desempenho e acessibilidade

- **Mobile:** sequência de 120 quadros a 800px. Se a conexão for lenta (`navigator.connection.saveData` ou `effectiveType` 2g/3g), cair para poster estático + as seções em rolagem normal.
- **`prefers-reduced-motion: reduce`:** sem pin, sem scrub. A página vira uma landing normal com os stills 2K como imagens de seção e nenhuma animação de rolagem.
- **Sem JS:** o conteúdo tem que existir e ser legível. O canvas é enriquecimento, não estrutura.
- Alvo: LCP < 2,5s no 4G simulado. O hero não pode esperar a sequência carregar.

---

## 7. Verificação antes de dizer que está pronto

Rodar o site em localhost e conferir num navegador de verdade:

- [ ] Rolagem para frente e para trás, com os quadros acompanhando sem salto nem quadro vazio
- [ ] Pin do canvas entrando e saindo sem pulo de layout
- [ ] Textos aparecendo no momento certo do filme, sem sobreposição entre si
- [ ] Lenis e ScrollTrigger sincronizados, sem drift depois de rolagem longa
- [ ] Console limpo, sem erro nem warning de hidratação
- [ ] Desktop e mobile
- [ ] Âncoras do menu levando às seções certas com o scroll suave
- [ ] `RequestModal` abrindo, fechando e devolvendo o foco
- [ ] `prefers-reduced-motion` desligando as animações de verdade

---

## 8. O que não fazer

- Não gerar imagem ou vídeo novo — está tudo pronto.
- Não jogar fora o copy dos componentes existentes.
- Não usar preto puro, âmbar ou laranja.
- Não colocar texto dentro do vídeo.
- Não deixar o site inteiro virar "filme" sem saída: depois da experiência cinematográfica, o site precisa abrir para o funcional — pilares, cases, contato.
- Não declarar pronto sem ter aberto no navegador e rolado para os dois lados.
