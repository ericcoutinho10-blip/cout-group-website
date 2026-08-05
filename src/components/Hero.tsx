"use client";

interface HeroProps {
  ready: boolean;
  onOpenModal: () => void;
  onScrollTo: (id: string) => void;
}

export default function Hero({ ready, onOpenModal, onScrollTo }: HeroProps) {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden"
      style={{
        borderRadius: "0 0 2rem 2rem",
        background: "#D8E5F7",
        minHeight: "100svh",
      }}
    >
      {/* Imagem de fundo com Ken Burns */}
      <div className="absolute inset-0 z-0 overflow-hidden" style={{ borderRadius: "0 0 2rem 2rem" }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(160deg, #0F2540 0%, #1a3a6b 35%, #3F7BD9 65%, #A7C4F0 85%, #D8E5F7 100%)`,
            animation: "ken-burns 20s ease-in-out infinite alternate",
            transformOrigin: "center center",
          }}
        />
        {/* Vinheta de legibilidade */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(15,37,64,0.55) 0%, rgba(15,37,64,0.1) 50%, rgba(15,37,64,0.4) 100%)",
          }}
        />
      </div>

      {/* Watermark COUT */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-24 z-[1] text-center select-none font-semibold leading-none"
        style={{
          fontSize: "13rem",
          color: "rgba(15,37,64,0.12)",
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s, transform 0.8s cubic-bezier(0.22,1,0.36,1) 0.3s",
        }}
      >
        COUT
      </div>

      {/* Conteúdo */}
      <div className="relative z-20 max-w-[88rem] mx-auto px-5 sm:px-8 flex flex-col gap-7 pt-28 pb-20 lg:min-h-screen lg:justify-center">
        {/* Eyebrow */}
        <div
          className="flex items-center gap-2 text-sm font-medium"
          style={{
            color: "rgba(255,255,255,0.75)",
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s",
          }}
        >
          <span
            className="inline-block rounded-full"
            style={{ width: "0.375rem", height: "0.375rem", background: "#6C9DE4" }}
          />
          Infraestrutura Inteligente
        </div>

        {/* H1 com line-reveal */}
        <h1
          className="font-semibold leading-[0.98] tracking-tight text-white max-w-[18ch]"
          style={{ fontSize: "clamp(2.25rem, 5vw, 3.75rem)" }}
        >
          {[
            { text: "O futuro não é um destino.", delay: "0.25s" },
            { text: "É uma infraestrutura.", delay: "0.37s" },
          ].map(({ text, delay }, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                className="block"
                style={{
                  opacity: ready ? 1 : 0,
                  transform: ready ? "translateY(0)" : "translateY(100%)",
                  transition: `opacity 900ms cubic-bezier(0.215,0.61,0.355,1) ${delay}, transform 900ms cubic-bezier(0.215,0.61,0.355,1) ${delay}`,
                }}
              >
                {text}
              </span>
            </span>
          ))}
        </h1>

        {/* CTAs */}
        <div
          className="flex flex-wrap gap-3"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 0.6s ease 0.75s, transform 0.6s ease 0.75s",
          }}
        >
          {/* Conhecer a COUT — navy */}
          <button
            onClick={onOpenModal}
            className="group inline-flex items-center gap-3 rounded-full text-sm font-medium transition-transform duration-300 hover:scale-[1.04]"
            style={{
              background: "#0F2540",
              color: "#fff",
              padding: "0.375rem 0.375rem 0.375rem 1.5rem",
            }}
          >
            Conhecer a COUT
            <span
              className="inline-grid place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
              style={{ width: "2.25rem", height: "2.25rem", background: "#3F7BD9", color: "#fff", fontSize: "1rem" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </span>
          </button>

          {/* Ver produtos — outline */}
          <button
            onClick={() => onScrollTo("services")}
            className="group inline-flex items-center gap-3 rounded-full text-sm font-medium transition-transform duration-300 hover:scale-[1.04]"
            style={{
              border: "1px solid rgba(255,255,255,0.35)",
              color: "#fff",
              padding: "0.375rem 0.375rem 0.375rem 1.5rem",
              background: "transparent",
            }}
          >
            Ver produtos
            <span
              className="inline-grid place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-1"
              style={{ width: "2.25rem", height: "2.25rem", background: "#0F2540", color: "#fff", fontSize: "1rem" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* Status bar inferior */}
      <div
        className="relative z-20 max-w-[88rem] mx-auto px-5 sm:px-8 flex items-center justify-between gap-3 border-t py-5 text-xs font-medium uppercase tracking-wide"
        style={{
          borderColor: "rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.6)",
          letterSpacing: "0.025em",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.6s ease 0.9s",
        }}
      >
        <span>Desde 2021</span>
        <span className="hidden sm:block">Remota, com presença global</span>
        <span className="inline-flex items-center gap-2">
          Explorar <span>↓</span>
        </span>
      </div>
    </section>
  );
}
