"use client";

import { useCallback, useEffect, useState } from "react";
import PageLoader from "@/components/PageLoader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PausaFilosofica from "@/components/PausaFilosofica";
import CreateBand from "@/components/CreateBand";
import CaseStudies from "@/components/CaseStudies";
import Services from "@/components/Services";
import Stats from "@/components/Stats";
import Footer from "@/components/Footer";
import NavMenu from "@/components/NavMenu";
import RequestModal from "@/components/RequestModal";

export default function Home() {
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Scroll lock quando menu ou modal está aberto
  useEffect(() => {
    if (menuOpen || modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen, modalOpen]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, []);

  const openModal = useCallback(() => {
    setMenuOpen(false);
    setTimeout(() => setModalOpen(true), 100);
  }, []);

  return (
    <>
      {/* Loader — aparece primeiro, bloqueia tudo */}
      {!ready && (
        <PageLoader onDone={() => setReady(true)} />
      )}

      {/* Skip link */}
      <a
        href="#main"
        className="fixed left-4 top-4 z-[60] -translate-y-20 focus:translate-y-0 rounded-[0.875rem] bg-cout-navy px-4 py-2 text-sm text-white transition-transform"
      >
        Ir para o conteúdo
      </a>

      {/* Header fixo sobre o hero */}
      <Header
        ready={ready}
        onOpenMenu={() => setMenuOpen(true)}
        onOpenModal={openModal}
        onScrollTo={scrollTo}
      />

      <main id="main">
        <Hero ready={ready} onOpenModal={openModal} onScrollTo={scrollTo} />
        <About />
        <PausaFilosofica />
        <CreateBand />
        <CaseStudies />
        <Services />
        <Stats />
      </main>

      <Footer onOpenModal={openModal} onScrollTo={scrollTo} />

      {/* Overlays */}
      <NavMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onOpenModal={openModal}
        onScrollTo={scrollTo}
      />
      <RequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
