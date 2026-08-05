"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import PageLoader from "@/components/PageLoader";
import Header from "@/components/Header";
import BarraProgresso from "@/components/BarraProgresso";
import ScrollFilm from "@/components/ScrollFilm";
import PosFilme from "@/components/PosFilme";
import Manifesto from "@/components/Manifesto";
import About from "@/components/About";
import PausaFilosofica from "@/components/PausaFilosofica";
import CreateBand from "@/components/CreateBand";
import Services from "@/components/Services";
import CoutNews from "@/components/CoutNews";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";
import RequestModal from "@/components/RequestModal";

/* ─────────────────────────────────────────────────────────────────────
 * DUAS CAMADAS
 *
 * Camada 1 — o filme e a dobradiça. É tudo que existe quando se chega.
 * Camada 2 — o Universo COUT. Só passa a existir quando o visitante
 *            escolhe abrir. Antes disso não está escondido por CSS:
 *            não está no documento.
 *
 * Primeiro se vive a marca. Só depois, se quiser, se conhece a empresa.
 * ──────────────────────────────────────────────────────────────────── */

export default function Home() {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [universoAberto, setUniversoAberto] = useState(false);
  const universoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen || modalOpen ? "hidden" : "";
  }, [menuOpen, modalOpen]);

  /* Navegar para um destino do Universo abre a Camada 2 primeiro, se ainda
   * estiver fechada — é a saída de emergência para quem não quer o filme. */
  const irPara = useCallback((id: string) => {
    setUniversoAberto(true);
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("cout:layout"));
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    });
  }, []);

  const openModal = useCallback(() => {
    setMenuOpen(false);
    setTimeout(() => setModalOpen(true), 100);
  }, []);

  /* Abrir o Universo cresce o documento. O ScrollTrigger e o Lenis guardam
   * a altura antiga, então precisam ser avisados — senão a rolagem trava
   * antes do fim, que foi exatamente o bug do pin do filme. */
  const abrirUniverso = useCallback(() => {
    setUniversoAberto(true);
    requestAnimationFrame(() => {
      window.dispatchEvent(new Event("cout:layout"));
      universoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <>
      {!ready && <PageLoader onDone={() => setReady(true)} />}

      <BarraProgresso />

      <a
        href="#universo"
        className="fixed left-4 top-4 z-[60] -translate-y-20 rounded-[0.875rem] bg-cout-navy px-4 py-2 text-sm text-white transition-transform focus:translate-y-0"
        onClick={abrirUniverso}
      >
        Pular o filme e ir para o conteúdo
      </a>

      <Header
        ready={ready}
        onOpenMenu={() => setMenuOpen(true)}
        onIrPara={irPara}
      />

      {/* ── CAMADA 1 — a experiência ── */}
      <main id="main">
        <ScrollFilm onOpenModal={openModal} />
        <PosFilme onAbrir={abrirUniverso} />

        {/* ── CAMADA 2 — o Universo COUT ── */}
        {universoAberto && (
          <div id="universo" ref={universoRef}>
            <Manifesto />
            <div id="filosofia"><PausaFilosofica /></div>
            <div id="quem-somos"><About /></div>
            <div id="como-pensamos"><CreateBand /></div>
            <div id="infraestrutura"><Services /></div>
            <div id="cout-news"><CoutNews /></div>
            <Stats />
          </div>
        )}
      </main>

      {/* "Entre em Contato" na nav aponta para cá — o contato mora no rodapé,
          junto com "Vamos construir algo único." e as organizações. */}
      {universoAberto && (
        <div id="contato">
          <Footer onOpenModal={openModal} onScrollTo={irPara} />
        </div>
      )}

      <NavMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenModal={openModal}
        onScrollTo={irPara}
      />
      <RequestModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
