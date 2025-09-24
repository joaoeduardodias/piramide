import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="inline-grid items-center justify-center">
            <div className="flex items-center space-x-2 mb-4">
              <div className="size-8 bg-white text-black flex items-center justify-center font-bold text-sm rounded-sm">P</div>
              <span className="font-bold text-xl">Pirâmide Calçados</span>
            </div>
            <p className="text-gray-400 mb-4">Qualidade e estilo em cada passo. Sua loja de confiança desde 2020.</p>
            <div className="text-sm text-gray-400">
              <p>📍 Rua das Palmeiras, 123</p>
              <p>Centro - São Paulo, SP</p>
              <p>📞 (11) 99999-9999</p>
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
          <p>&copy; 2024 Pirâmide Calçados. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}