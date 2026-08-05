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
  /** hero: tipografia maior e palavra de destaque em azul */
  hero?: boolean;
  accent?: string;
};

/**
 * Momentos de texto, ancorados no arco do filme.
 * REGRA: o intervalo entre dois beats precisa ser MAIOR que 2×FADE,
 * senão o de saída e o de entrada se sobrepõem na tela. Folga aqui: 0.032.
 */
const FADE = 0.014;

const BEATS: Beat[] = [
  {
    // cidade ao amanhecer
    from: 0.004,
    to: 0.058,
    hero: true,
    top: ["O futuro da sua empresa", "começa AGORA"],
    accent: "AGORA",
  },
  {
    // a mesa tomada por notificações
    from: 0.09,
    to: 0.15,
    top: ["Entre um paciente", "e o próximo…"],
    bottom: ["…ainda existe uma pilha de tarefas", "que ninguém escolheu fazer."],
  },
  {
    // ele levanta os olhos para a janela
    from: 0.182,
    to: 0.208,
    top: ["E se houvesse", "uma infraestrutura…"],
    bottom: ["…pensada para resolver isso?"],
  },
  {
    // as mãos se tocam — o ponto de virada
    from: 0.23,
    to: 0.268,
    top: ["Decisões que geram…"],
    bottom: ["…emoções e conexões reais."],
  },
  {
    // a IA contemplando a cidade
    from: 0.3,
    to: 0.352,
    top: ["Não é sobre uma ferramenta."],
    bottom: ["É sobre infraestrutura e tecnologia."],
  },
  {
    // a IA no painel e na recepção
    from: 0.384,
    to: 0.436,
    top: ["Invisível, silenciosa, inteligente."],
    bottom: ["Trabalhando enquanto", "você cuida de pessoas."],
    bottomAlign: "left",
  },
  {
    // hall, whatsapp respondendo sozinho, a IA apresentando resultados
    from: 0.468,
    to: 0.63,
    top: ["Construímos previsibilidade com…"],
    list: ["Comunicação", "Gestão", "Organização", "Análise & dados"],
  },
  {
    // a recepcionista presente, sem tela entre ela e a paciente
    from: 0.662,
    to: 0.7,
    top: ["Não substituímos humanos…"],
    bottom: ["…potencializamos o trabalho deles."],
    bottomAlign: "left",
  },
  {
    // o médico saindo no fim de tarde
    from: 0.724,
    to: 0.754,
    top: ["E você volta a ser…"],
    bottom: ["…quem sempre quis ser."],
    bottomAlign: "left",
  },
  {
    // o campus visto de cima, em golden hour
    from: 0.788,
    to: 0.812,
    top: ["A melhor tecnologia"],
    bottom: ["é aquela que opera em silêncio."],
    bottomAlign: "left",
  },
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

      // object-fit: cover
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
        end: () => `+=${window.innerHeight * 9}`,
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

      const onResize = () => { current = -1; draw(Math.round(state.frame)); };
      window.addEventListener("resize", onResize);

      /* Quando a Camada 2 abre, o documento cresce. Sem refresh, o Lenis fica
       * com o limite antigo e a rolagem trava — o mesmo bug do pin. */
      const onLayout = () => { ScrollTrigger.refresh(); lenis.resize(); };
      window.addEventListener("cout:layout", onLayout);

      cleanup = () => {
        window.removeEventListener("resize", onResize);
        window.removeEventListener("cout:layout", onLayout);
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
          <p className="mb-6 text-xs uppercase tracking-[0.2em] text-cout-soft">
            Infraestrutura Inteligente
          </p>
          <h1 className="text-4xl font-light leading-[1.05] tracking-tight sm:text-6xl">
            O futuro da sua empresa começa{" "}
            <span className="font-medium text-cout-blue">AGORA</span>
          </h1>
          <div className="mt-14 space-y-8 text-lg font-light text-white/70">
            {BEATS.slice(1).map((b, i) => (
              <p key={i}>
                {[...(b.top ?? []), ...(b.list ?? []), ...(b.bottom ?? [])].join(" ")}
              </p>
            ))}
          </div>
          <button
            onClick={onOpenModal}
            className="mt-14 rounded-full bg-white px-8 py-4 text-sm font-medium text-cout-navy transition hover:bg-cout-ice"
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
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
          aria-hidden="true"
        />

        {/* véu de base: o filme é quase todo branco, então sem isso o texto branco some */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cout-navy/55 via-cout-navy/25 to-cout-navy/65" />

        {/* indicador de carregamento inicial */}
        {pct < 16 && (
          <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-[0.65rem] uppercase tracking-[0.25em] text-white/50">
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
          const fluid: React.CSSProperties = b.hero
            ? { fontSize: "clamp(2.1rem, 5vw, 4.4rem)" }
            : { fontSize: "clamp(1.45rem, 3.1vw, 3.05rem)" };
          const base =
            "font-light leading-[1.12] tracking-tight text-white drop-shadow-[0_2px_28px_rgba(15,37,64,0.7)] [text-wrap:balance] [hyphens:none]";

          /** Destaca uma palavra em azul dentro da linha, quando o beat pede. */
          const render = (line: string) => {
            if (!b.accent || !line.includes(b.accent)) return line;
            const [before, after] = line.split(b.accent);
            return (
              <>
                {before}
                <span className="font-medium text-cout-blue">{b.accent}</span>
                {after}
              </>
            );
          };

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
                  background:
                    "radial-gradient(70% 75% at 18% 22%, rgba(15,37,64,0.82) 0%, rgba(15,37,64,0.42) 45%, rgba(15,37,64,0) 78%)," +
                    "radial-gradient(70% 75% at 78% 80%, rgba(15,37,64,0.78) 0%, rgba(15,37,64,0.38) 45%, rgba(15,37,64,0) 78%)",
                }}
              />

              {/* metade de cima */}
              <div className="absolute left-0 top-[12%] w-full max-w-[min(92vw,66rem)] px-6 text-left sm:px-12 lg:px-20">
                {b.top && b.top.map((line, j) => (
                  <p key={j} className={base} style={fluid}>
                    {render(line)}
                  </p>
                ))}

                {/* lista de pilares, quando existe */}
                {b.list && (
                  <ul className="mt-[7vh] space-y-1.5 sm:space-y-2">
                    {b.list.map((item) => (
                      <li
                        key={item}
                        className="font-light leading-[1.22] tracking-tight text-white drop-shadow-[0_2px_28px_rgba(15,37,64,0.7)]"
                        style={{ fontSize: "clamp(1.25rem, 2.5vw, 2.4rem)" }}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
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
