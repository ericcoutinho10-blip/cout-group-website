import type { Metadata, Viewport } from "next";
import { Poppins, Instrument_Serif } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Serifa editorial, usada só em citação e manifesto — o contraponto à
// geometria da Poppins. É o papel que no Rolex cabe à SangBleuKingdom.
const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "COUT Group — Infraestrutura Inteligente",
  description:
    "Construímos a infraestrutura digital que conecta pessoas, dados e decisões. Agentes de IA, automação e estratégia para o que vem a seguir.",
  // Preview: fora do índice do Google enquanto as métricas do Stats não forem
  // confirmadas e o site não estiver aprovado. REMOVER no lançamento.
  robots: { index: false, follow: false },
};

// themeColor vive em `viewport`, não em `metadata` — nesta versão do Next o
// campo em metadata é ignorado e emite aviso a cada render.
export const viewport: Viewport = {
  themeColor: "#0F2540",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} ${instrument.variable} antialiased`}
    >
      <body className="min-h-screen bg-white text-cout-graphite overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
