import { Footer } from "@/components/footer";
import { Header } from "@/components/header/header";


export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
