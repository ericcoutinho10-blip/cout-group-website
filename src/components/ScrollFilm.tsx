"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ *
 * Sequência de quadros do filme 001 — The Future Starts Now.
 * O scroll conduz o filme; os textos são HTML sobreposto, nunca queimados
 * na imagem. Cada beat é ancorado no progresso (0..1) do filme.
 * ------------------------------------------------------------------ */

/* Caminhos escritos à mão precisam do basePath: no GitHub Pages o site vive
 * numa subpasta, e sem o prefixo os quadros dariam 404. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const DESKTOP = { dir: `${BASE}/scroll/desktop`, count: 300 };
const MOBILE = { dir: `${BASE}/scroll/mobile`, count: 120 };

/**
 * Modelo de copy definido pelo Eric: a frase quebra em duas metades — a
 * primeira no alto à esquerda, a segunda embaixo à direita — ligadas por
 * reticências. Alguns beats trazem uma lista vertical no lugar da segunda
 * metade.
 */
type Beat = {
  from: number;
  to: number;
  /** metade de cima, alinhada à esquerda */
  top?: string[];
  /** metade de baixo; por padrão vai para a direita */
  bottom?: string[];
  bottomAlign?: "left" | "right";
  /** lista vertical (pilares), entra abaixo da metade de cima */
  list?: string[];
};

/**
 * Momentos de texto, ancorados no arco do filme.
 * REGRA: o intervalo entre dois beats precisa ser MAIOR que 2×FADE,
 * senão o de saída e o de entrada se sobrepõem na tela. Folga aqui: 0.032.
 */
const FADE = 0.014;

const BEATS: Beat[] = [
  // Falas em tamanho de legenda: uma ou duas linhas curtas. O texto do Eric
  // continua palavra por palavra; o que mudou foi a quebra — bloco de cinco
  // linhas nao e legenda, e cartaz.
  { from: 0.004, to: 0.058,
    top: ["O futuro da sua empresa começa agora."] },
  { from: 0.09, to: 0.15,
    top: ["Entre um paciente e o próximo ainda existe", "uma pilha de tarefas que ninguém escolheu fazer."] },
  { from: 0.182, to: 0.208,
    top: ["E se houvesse uma infraestrutura", "pensada para resolver isso?"] },
  { from: 0.23, to: 0.268,
    top: ["Decisões que geram emoções e conexões reais."] },
  { from: 0.3, to: 0.352,
    top: ["Não é sobre uma ferramenta.", "É sobre infraestrutura e tecnologia."] },
  { from: 0.384, to: 0.436,
    top: ["Invisível, silenciosa, inteligente.", "Trabalhando enquanto você cuida de pessoas."] },
  { from: 0.468, to: 0.63,
    top: ["Construímos previsibilidade com:"],
    list: ["Comunicação", "Gestão", "Organização", "Análise & dados"] },
  { from: 0.662, to: 0.7,
    top: ["Não substituímos humano,", "potencializamos o trabalho deles."] },
  { from: 0.724, to: 0.754,
    top: ["E você volta a ser quem sempre quis ser."] },
  { from: 0.788, to: 0.812,
    top: ["A melhor tecnologia é aquela", "que opera em silêncio."] },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 820px)");
    const set = () => setMobile(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return mobile;
}

export default function ScrollFilm({
  onOpenModal,
}: {
  onOpenModal: () => void;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const beatRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);
  const isMobile = useIsMobile();
  const [loaded, setLoaded] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const source = isMobile ? MOBILE : DESKTOP;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const images: (HTMLImageElement | undefined)[] = new Array(source.count);
    let current = -1;
    let killed = false;

    const src = (i: number) =>
      `${source.dir}/f${String(i).padStart(4, "0")}.webp`;

    /** Desenha o quadro mais próximo já carregado — nunca deixa o canvas vazio. */
    const draw = (index: number) => {
      let i = Math.max(0, Math.min(source.count - 1, index));
      let img = images[i];
      if (!img?.complete) {
        // procura o vizinho carregado mais próximo
        for (let d = 1; d < source.count; d++) {
          const a = images[i - d];
          const b = images[i + d];
          if (a?.complete) { img = a; i = i - d; break; }
          if (b?.complete) { img = b; i = i + d; break; }
        }
      }
      if (!img?.complete || i === current) return;
      current = i;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* Desktop: `cover` em tela cheia.
       *
       * Celular: o canvas nao e mais a tela inteira — e uma FAIXA de 4:3
       * centrada, e o navy ao redor faz parte da composicao. O motivo e
       * aritmetico: encher uma tela 9:19,5 com filme 16:9 obriga a jogar
       * fora 68% da largura e ampliar o resto, o que dava super zoom e
       * perda visivel. A faixa guarda 75% da largura do master e chega
       * nitida num telefone de alta densidade.
       *
       * Nao e tarja acidental: e enquadramento. A faixa ocupa a maior
       * parte da tela, a legenda encosta nela, e o navy ao redor e o mesmo
       * do resto do site. */
      const ir = img.width / img.height;
      const cr = w / h;
      let dw = w, dh = h, dx = 0, dy = 0;
      if (ir > cr) { dw = h * ir; dx = (w - dw) / 2; }
      else { dh = w / ir; dy = (h - dh) / 2; }
      ctx.fillStyle = "#0F2540";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    /** Carrega em duas ondas: esparsa primeiro (scroll responde já), densa depois. */
    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (images[i]) return resolve();
        const img = new Image();
        img.decoding = "async";
        img.onload = img.onerror = () => {
          setLoaded((n) => n + 1);
          if (i === 0 || current === -1) draw(Math.round(progressRef.current * (source.count - 1)));
          resolve();
        };
        img.src = src(i);
        images[i] = img;
      });

    const boot = async () => {
      const step = 6;
      const sparse: number[] = [];
      for (let i = 0; i < source.count; i += step) sparse.push(i);
      await Promise.all(sparse.map(load));
      if (killed) return;
      for (let i = 0; i < source.count && !killed; i++) {
        if (!images[i]) await load(i);
      }
    };
    boot();

    let cleanup = () => {};

    (async () => {
      const { default: gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const Lenis = (await import("lenis")).default;
      if (killed) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      const raf = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);

      const state = { frame: 0 };
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        /* `clientHeight`, nao `innerHeight`.
         *
         * No celular a barra de endereco some ao rolar e o `innerHeight`
         * muda no meio do caminho. O fim do pin era recalculado com o valor
         * novo, o Lenis ficava com o teto antigo e o visitante travava no
         * meio do filme — parava na cena da recepcao e nao passava disso.
         * `clientHeight` ignora a barra e nao oscila. */
        end: () => `+=${document.documentElement.clientHeight * 5}`,
        pin: ".film-stage",
        pinSpacing: true,
        scrub: 0.8,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          state.frame = self.progress * (source.count - 1);
          draw(Math.round(state.frame));

          // textos: entram e saem conforme a janela de cada beat
          BEATS.forEach((b, i) => {
            const el = beatRefs.current[i];
            if (!el) return;
            const p = self.progress;
            const fade = FADE;
            let o = 0;
            if (p >= b.from - fade && p <= b.to + fade) {
              if (p < b.from) o = (p - (b.from - fade)) / fade;
              else if (p > b.to) o = 1 - (p - b.to) / fade;
              else o = 1;
            }
            o = Math.max(0, Math.min(1, o));
            el.style.opacity = String(o);
            el.style.transform = `translateY(${(1 - o) * 18}px)`;
            el.style.pointerEvents = o > 0.6 ? "auto" : "none";
          });

        },
      });

      /* O Lenis fixa seu limite de rolagem na inicialização. O ScrollTrigger só
       * insere o pin-spacer depois — então sem religar os dois, o Lenis mantém o
       * limite antigo e o visitante trava antes do fim do filme. */
      ScrollTrigger.addEventListener("refresh", () => lenis.resize());
      ScrollTrigger.refresh();
      requestAnimationFrame(() => lenis.resize());

      // afordância de teste: permite dirigir a rolagem em dev sem lutar com o Lenis
      if (process.env.NODE_ENV !== "production") {
        (window as unknown as { __film?: unknown }).__film = { lenis, st, source };
      }

      /* Redesenha o quadro E religa o teto de rolagem.
       *
       * No celular a barra de endereco some ao rolar, a altura muda, e o
       * Lenis fica com o limite antigo — o visitante travava no meio do
       * filme, na cena da recepcao, sem conseguir passar. O `setTimeout`
       * espera a altura assentar antes de recalcular. */
      let reajuste: ReturnType<typeof setTimeout>;
      const onResize = () => {
        current = -1;
        draw(Math.round(state.frame));
        clearTimeout(reajuste);
        reajuste = setTimeout(() => { ScrollTrigger.refresh(); lenis.resize(); }, 180);
      };
      window.addEventListener("resize", onResize);
      window.addEventListener("orientationchange", onResize);

      /* Quando a Camada 2 abre, o documento cresce. Sem refresh, o Lenis fica
       * com o limite antigo e a rolagem trava — o mesmo bug do pin. */
      const onLayout = () => { ScrollTrigger.refresh(); lenis.resize(); };


      window.addEventListener("cout:layout", onLayout);

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("cout:layout", onLayout);
        window.removeEventListener("orientationchange", onResize);
        clearTimeout(reajuste);
        st.kill();
        gsap.ticker.remove(raf);
        lenis.destroy();
      };
    })();

    return () => {
      killed = true;
      cleanup();
    };
  }, [isMobile, reduced]);

  const pct = Math.round((loaded / (isMobile ? MOBILE.count : DESKTOP.count)) * 100);

  /* -------- fallback sem animação -------- */
  if (reduced) {
    return (
      <section className="relative bg-cout-navy px-6 py-32 text-white sm:px-10">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 t-label uppercase tracking-[0.2em] text-cout-soft">
            Infraestrutura Inteligente
          </p>
          <h1 className="text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            O futuro da sua empresa começa{" "}
            <span className="font-medium text-cout-blue">AGORA</span>
          </h1>
          <div className="mt-14 space-y-8 t-lead font-light text-white/70">
            {BEATS.slice(1).map((b, i) => (
              <p key={i}>
                {[...(b.top ?? []), ...(b.list ?? []), ...(b.bottom ?? [])].join(" ")}
              </p>
            ))}
          </div>
          <button
            onClick={onOpenModal}
            className="mt-14 rounded-full bg-white px-8 py-4 t-body font-medium text-cout-navy transition hover:bg-cout-ice"
          >
            Agendar conversa
          </button>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative bg-cout-navy" aria-label="Filme institucional COUT">
      <div className="film-stage relative h-screen w-full overflow-hidden">
        {/* No celular o canvas e uma faixa centrada, nao a tela inteira:
            encher 9:19,5 com filme 16:9 exigia jogar fora 68% da largura e
            ampliar o resto. A faixa ocupa a maior parte da tela, chega
            nitida, e o navy ao redor e composicao — nao sobra. */}
        <canvas
          ref={canvasRef}
          className="absolute inset-x-0 top-[11vh] block h-[60vh] w-full sm:inset-0 sm:top-0 sm:h-full"
          aria-hidden="true"
        />

        {/* Véu de base. Existe porque boa parte do filme é branco e o texto
            branco sumiria. Mas ele SOMA com a queda de luz radial de cada
            beat: nos planos já escuros os dois juntos matavam a imagem — a
            cidade ao amanhecer virava quase preta, longe do dourado do
            mockup. Aliviado aqui; quem garante a leitura do texto é o radial,
            que age só onde o texto está. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cout-navy/34 via-cout-navy/10 to-cout-navy/42" />

        {/* indicador de carregamento inicial */}
        {pct < 16 && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 t-label uppercase tracking-[0.25em] text-white/50">
            carregando {pct}%
          </div>
        )}

        {/* textos sincronizados — metade em cima à esquerda, metade embaixo */}
        {BEATS.map((b, i) => {
          /* Tipografia fluida: a linha escrita no BEATS precisa CABER, senão o
           * CSS re-quebra num ponto arbitrário e o texto sai raggedo. O clamp
           * acompanha a largura da janela; onde a quebra é inevitável (celular),
           * `text-wrap: balance` divide em linhas parelhas em vez de deixar
           * palavra órfã. */
          /* Menor no celular: a legenda divide a tela com a faixa do filme
             e precisa ficar discreta para o quadro seguir sendo o assunto. */
          const fluid: React.CSSProperties = {
            fontSize: "clamp(0.92rem, 3.4vw, var(--fs-lead))",
            lineHeight: 1.35,
          };
          const base =
            "font-normal tracking-normal text-white [text-wrap:balance] [hyphens:none] drop-shadow-[0_1px_10px_rgba(0,0,0,0.85)]";

          /* O destaque em azul dentro da frase saiu junto com o modelo de
             cartaz. Legenda de filme nao tem palavra colorida — a enfase
             vem do corte e do que esta na tela, nao da tinta. */

          return (
            <div
              key={i}
              data-beat={i}
              ref={(el) => { beatRefs.current[i] = el; }}
              style={{ opacity: 0 }}
              className="absolute inset-0 transition-none"
            >
              {/* Queda de luz diagonal: escurece o canto de cima-esquerda e o de
                  baixo-direita, que é exatamente onde as duas metades pousam. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  /* Antes eram duas quedas de luz nos cantos opostos, porque
                     o texto pousava em dois lugares. Com a legenda fixa na
                     base, basta um degrade de baixo para cima — mais leve, e
                     preserva a imagem inteira acima da linha do texto. */
                  background:
                    "linear-gradient(to top, rgba(10,22,40,0.78) 0%, rgba(10,22,40,0.45) 14%, rgba(10,22,40,0.10) 26%, rgba(10,22,40,0) 38%)",
                }}
              />

              {/* metade de cima */}
              {/* Faixa de legenda: base da tela, centralizada, medida curta.
                  Sempre no mesmo lugar — e isso que faz o olho parar de
                  procurar o texto e voltar para a imagem. */}
              <div className="absolute inset-x-0 top-[71vh] bottom-0 mx-auto flex w-full max-w-[min(92vw,54rem)] flex-col items-center justify-center px-6 text-center sm:top-auto sm:bottom-[9vh] sm:block">
                {b.top && b.top.map((line, j) => (
                  <p key={j} className={base} style={fluid}>
                    {line}
                  </p>
                ))}

                {/* No celular a lista vira frase corrida, separada por
                    virgulas: quatro itens com traco quebravam em duas linhas
                    desalinhadas e destoavam das outras legendas, que sao
                    frases. No desktop segue em linha com traco. */}
                {b.list && (
                  <p
                    className="mt-2 font-normal text-white/85 [text-wrap:balance] drop-shadow-[0_1px_10px_rgba(0,0,0,0.85)]"
                    style={fluid}
                  >
                    {b.list.join(", ")}.
                  </p>
                )}
              </div>

              {/* metade de baixo */}
              {b.bottom && (
                <div
                  className={`absolute bottom-[12%] w-full max-w-[min(94vw,68rem)] px-6 sm:px-12 lg:px-20 ${
                    b.bottomAlign === "left"
                      ? "left-0 text-left"
                      : "right-0 text-right"
                  }`}
                >
                  {b.bottom.map((line, j) => (
                    <p key={j} className={base} style={fluid}>
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Sem CTA aqui, de propósito. O filme termina puro; a porta está na
            dobradiça, depois da pausa de 3s. Dois CTAs seguidos matariam o
            silêncio que o último quadro precisa ter. */}
      </div>
    </section>
  );
}
