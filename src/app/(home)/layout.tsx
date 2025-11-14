import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "../providers";


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
