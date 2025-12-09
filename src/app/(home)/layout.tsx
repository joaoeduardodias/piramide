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
      <main className="px-4">{children}</main>
      <Footer />
    </>
  );
}
