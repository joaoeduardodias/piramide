import logoTextWhite from '@/assets/logo-piramide-white.svg';
import logoImg from '@/assets/logo.png';
import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="inline-grid items-center justify-center">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src={logoImg}
                alt="Pirâmide Calçados Logo"
                width={40}
                height={40}
              />
              <Image
                src={logoTextWhite}
                alt="Pirâmide Calçados Logo Text"
                width={230}
                height={55}
              />
            </div>
            <p className="text-gray-400 mb-4">Qualidade e estilo em cada passo.</p>
            <div className="text-sm text-gray-400">
              <p>📍 Av Francisco Jales, 2465</p>
              <p>Centro - Jales, SP</p>
              <p>📞 (17) 3632-2574</p>
            </div>
          </div>

          <div className="inline-grid items-center justify-center">
            <h3 className="font-semibold mb-4">Produtos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/tenis" className="hover:text-white transition-colors">
                  Tênis
                </Link>
              </li>
              <li>
                <Link href="/social" className="hover:text-white transition-colors">
                  Social
                </Link>
              </li>
              <li>
                <Link href="/botas" className="hover:text-white transition-colors">
                  Botas
                </Link>
              </li>
              <li>
                <Link href="/sandalias" className="hover:text-white transition-colors">
                  Sandálias
                </Link>
              </li>
            </ul>
          </div>

          <div className="inline-grid items-center justify-end">
            <h3 className="font-semibold mb-4">Atendimento</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/contato" className="hover:text-white transition-colors">
                  Fale Conosco
                </Link>
              </li>
              <li>
                <Link href="/trocas" className="hover:text-white transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/entrega" className="hover:text-white transition-colors">
                  Entrega
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Pirâmide Calçados. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}