import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] })

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pirâmide Calçados - Estilo e Conforto para seus pés",
  description:
    "Descubra nossa coleção exclusiva de calçados premium. Qualidade, design e conforto em cada passo. Tênis, sapatos sociais, botas e sandálias.",
  keywords: "calçados, sapatos, tênis, botas, sandálias, moda, conforto, qualidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="pt-BR">
      <body className={`${inter.className}  antialiased`}>
        <>{children}</>
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="light"
        />
      </body>
    </html>
  );
}
