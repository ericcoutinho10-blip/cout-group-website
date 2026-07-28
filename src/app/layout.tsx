import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "COUT Group — Infraestrutura Inteligente",
  description:
    "Construímos a infraestrutura digital que conecta pessoas, dados e decisões. Agentes de IA, automação e estratégia para o que vem a seguir.",
  themeColor: "#0F2540",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} antialiased`}>
      <body className="min-h-screen bg-white text-cout-graphite overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
