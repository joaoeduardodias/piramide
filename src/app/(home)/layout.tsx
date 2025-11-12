import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "../providers";

export const dynamic = "force-static";
export const revalidate = 3600;

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <Header />
      <main>{children}</main>
      <Footer />
    </Providers>
  );
}
