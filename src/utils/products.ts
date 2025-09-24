export const products = [
  {
    id: 1,
    name: "Produto Aleatório 1",
    brand: "Nike",
    slug: "produto-aleatorio-1",
    price: 465.0,
    originalPrice: 618.44,
    images: [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Acessórios",
    rating: 3.5,
    discount: 25,
    description: "Descrição detalhada do Produto Aleatório 1. Um produto de alta qualidade e durabilidade.",
    features: ["Design moderno", "Material de alta qualidade"],
    sizes: ["Único"],
    colors: [
      { name: "Preto", hex: "#000000" },
      { name: "Vermelho", hex: "#FF0000" },
      { name: "Cinza", hex: "#808080" }
    ],
    stock: 34,
    sku: "PROD-001",
    createdAt: "2025-01-05T10:20:23.355Z"
  },
  {
    id: 2,
    name: "Produto Aleatório 2",
    brand: "Adidas",
    slug: "produto-aleatorio-2",
    price: 299.9,
    originalPrice: 399.9,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Roupas",
    rating: 4.2,
    discount: 25,
    description: "Produto confortável e estiloso para o dia a dia.",
    features: ["Confortável", "Material respirável", "Design moderno"],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      { name: "Azul", hex: "#0000FF" },
      { name: "Branco", hex: "#FFFFFF" }
    ],
    stock: 25,
    sku: "PROD-002",
    createdAt: "2025-01-10T09:15:00.000Z"
  },
  {
    id: 3,
    name: "Produto Aleatório 3",
    brand: "Puma",
    slug: "produto-aleatorio-3",
    price: 189.99,
    originalPrice: 249.99,
    images: [
      "https://images.unsplash.com/photo-1528701800489-20beab12e010?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Calçados",
    rating: 4.7,
    discount: 24,
    description: "Tênis leve e resistente, ideal para atividades esportivas.",
    features: ["Leve", "Resistente", "Design ergonômico"],
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    colors: [{ name: "Preto", hex: "#000000" }],
    stock: 12,
    sku: "PROD-003",
    createdAt: "2025-02-01T12:00:00.000Z"
  },
  {
    id: 4,
    name: "Produto Aleatório 4",
    brand: "Samsung",
    slug: "produto-aleatorio-4",
    price: 2999.99,
    originalPrice: 3499.99,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1080&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581291519195-ef11498d1cf5?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.8,
    discount: 14,
    description: "Smartphone de última geração com câmera de alta resolução.",
    features: ["Tela AMOLED", "Câmera tripla", "Bateria de longa duração"],
    sizes: [],
    colors: [
      { name: "Preto", hex: "#000000" },
      { name: "Prata", hex: "#C0C0C0" }
    ],
    stock: 8,
    sku: "PROD-004",
    createdAt: "2025-02-15T14:30:00.000Z"
  },
  {
    id: 5,
    name: "Produto Aleatório 5",
    brand: "Apple",
    slug: "produto-aleatorio-5",
    price: 4999.99,
    originalPrice: 5999.99,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.9,
    discount: 17,
    description: "Notebook potente para trabalho e lazer.",
    features: ["Tela Retina", "Processador M2", "Bateria de longa duração"],
    sizes: [],
    colors: [
      { name: "Prata", hex: "#C0C0C0" },
      { name: "Cinza Espacial", hex: "#555555" }
    ],
    stock: 5,
    sku: "PROD-005",
    createdAt: "2025-03-01T08:00:00.000Z"
  },
  {
    id: 6,
    name: "Produto Aleatório 6",
    brand: "LG",
    slug: "produto-aleatorio-6",
    price: 2199.99,
    originalPrice: 2599.99,
    images: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.6,
    discount: 15,
    description: "Smart TV 4K com inteligência artificial.",
    features: ["4K UHD", "AI ThinQ", "HDR"],
    sizes: [],
    colors: [
      { name: "Preto", hex: "#000000" }
    ],
    stock: 10,
    sku: "PROD-006",
    createdAt: "2025-03-10T11:30:00.000Z"
  },
  {
    id: 7,
    name: "Produto Aleatório 7",
    brand: "Dell",
    slug: "produto-aleatorio-7",
    price: 3499.99,
    originalPrice: 3999.99,
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.5,
    discount: 13,
    description: "Notebook para uso profissional.",
    features: ["Processador Intel i7", "SSD 512GB", "Tela Full HD"],
    sizes: [],
    colors: [
      { name: "Prata", hex: "#C0C0C0" }
    ],
    stock: 7,
    sku: "PROD-007",
    createdAt: "2025-03-15T09:45:00.000Z"
  },
  {
    id: 8,
    name: "Produto Aleatório 8",
    brand: "Havaianas",
    slug: "produto-aleatorio-8",
    price: 39.99,
    originalPrice: 49.99,
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Calçados",
    rating: 4.3,
    discount: 20,
    description: "Chinelo confortável para o verão.",
    features: ["Solado antiderrapante", "Material resistente"],
    sizes: ["35", "36", "37", "38", "39", "40", "41", "42"],
    colors: [
      { name: "Azul", hex: "#0000FF" },
      { name: "Amarelo", hex: "#FFFF00" }
    ],
    stock: 50,
    sku: "PROD-008",
    createdAt: "2025-04-01T10:00:00.000Z"
  },
  {
    id: 9,
    name: "Produto Aleatório 9",
    brand: "Ray-Ban",
    slug: "produto-aleatorio-9",
    price: 599.99,
    originalPrice: 799.99,
    images: [
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Acessórios",
    rating: 4.7,
    discount: 25,
    description: "Óculos de sol clássico.",
    features: ["Proteção UV", "Design icônico"],
    sizes: ["Único"],
    colors: [
      { name: "Preto", hex: "#000000" },
      { name: "Marrom", hex: "#8B4513" }
    ],
    stock: 20,
    sku: "PROD-009",
    createdAt: "2025-04-10T13:20:00.000Z"
  },
  {
    id: 10,
    name: "Produto Aleatório 10",
    brand: "Levi's",
    slug: "produto-aleatorio-10",
    price: 199.99,
    originalPrice: 249.99,
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Roupas",
    rating: 4.4,
    discount: 20,
    description: "Calça jeans clássica.",
    features: ["Algodão premium", "Modelagem reta"],
    sizes: ["38", "40", "42", "44"],
    colors: [
      { name: "Azul", hex: "#0000FF" }
    ],
    stock: 30,
    sku: "PROD-010",
    createdAt: "2025-04-15T15:00:00.000Z"
  },
  {
    id: 11,
    name: "Produto Aleatório 11",
    brand: "Vans",
    slug: "produto-aleatorio-11",
    price: 249.99,
    originalPrice: 299.99,
    images: [
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3c8b?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Calçados",
    rating: 4.6,
    discount: 17,
    description: "Tênis casual para o dia a dia.",
    features: ["Solado vulcanizado", "Design clássico"],
    sizes: ["38", "39", "40", "41", "42"],
    colors: [
      { name: "Preto", hex: "#000000" },
      { name: "Branco", hex: "#FFFFFF" }
    ],
    stock: 18,
    sku: "PROD-011",
    createdAt: "2025-04-20T11:00:00.000Z"
  },
  {
    id: 12,
    name: "Produto Aleatório 12",
    brand: "Gucci",
    slug: "produto-aleatorio-12",
    price: 1299.99,
    originalPrice: 1599.99,
    images: [
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Acessórios",
    rating: 4.8,
    discount: 19,
    description: "Bolsa de luxo em couro legítimo.",
    features: ["Couro legítimo", "Design exclusivo"],
    sizes: ["Único"],
    colors: [
      { name: "Preto", hex: "#000000" },
      { name: "Vermelho", hex: "#FF0000" }
    ],
    stock: 6,
    sku: "PROD-012",
    createdAt: "2025-04-25T16:00:00.000Z"
  },
  {
    id: 13,
    name: "Produto Aleatório 13",
    brand: "Sony",
    slug: "produto-aleatorio-13",
    price: 899.99,
    originalPrice: 1099.99,
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.7,
    discount: 18,
    description: "Fone de ouvido com cancelamento de ruído.",
    features: ["Bluetooth", "Cancelamento de ruído", "Bateria longa"],
    sizes: [],
    colors: [
      { name: "Preto", hex: "#000000" }
    ],
    stock: 15,
    sku: "PROD-013",
    createdAt: "2025-05-01T12:00:00.000Z"
  },
  {
    id: 14,
    name: "Produto Aleatório 14",
    brand: "Samsung",
    slug: "produto-aleatorio-14",
    price: 1499.99,
    originalPrice: 1799.99,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.6,
    discount: 17,
    description: "Tablet com tela de alta resolução.",
    features: ["Tela AMOLED", "Processador Octa-core"],
    sizes: [],
    colors: [
      { name: "Prata", hex: "#C0C0C0" }
    ],
    stock: 9,
    sku: "PROD-014",
    createdAt: "2025-05-05T14:00:00.000Z"
  },
  {
    id: 15,
    name: "Produto Aleatório 15",
    brand: "Adidas",
    slug: "produto-aleatorio-15",
    price: 129.99,
    originalPrice: 159.99,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Roupas",
    rating: 4.3,
    discount: 19,
    description: "Camiseta esportiva.",
    features: ["Material respirável", "Secagem rápida"],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      { name: "Branco", hex: "#FFFFFF" },
      { name: "Preto", hex: "#000000" }
    ],
    stock: 40,
    sku: "PROD-015",
    createdAt: "2025-05-10T10:00:00.000Z"
  },
  {
    id: 16,
    name: "Produto Aleatório 16",
    brand: "Nike",
    slug: "produto-aleatorio-16",
    price: 349.99,
    originalPrice: 399.99,
    images: [
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Calçados",
    rating: 4.5,
    discount: 12,
    description: "Tênis esportivo para corrida.",
    features: ["Leve", "Amortecimento"],
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: [
      { name: "Azul", hex: "#0000FF" },
      { name: "Preto", hex: "#000000" }
    ],
    stock: 22,
    sku: "PROD-016",
    createdAt: "2025-05-15T09:00:00.000Z"
  },
  {
    id: 17,
    name: "Produto Aleatório 17",
    brand: "Puma",
    slug: "produto-aleatorio-17",
    price: 159.99,
    originalPrice: 199.99,
    images: [
      "https://images.unsplash.com/photo-1528701800489-20beab12e010?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Roupas",
    rating: 4.2,
    discount: 20,
    description: "Shorts esportivo.",
    features: ["Material leve", "Secagem rápida"],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      { name: "Preto", hex: "#000000" },
      { name: "Cinza", hex: "#808080" }
    ],
    stock: 35,
    sku: "PROD-017",
    createdAt: "2025-05-20T11:00:00.000Z"
  },
  {
    id: 18,
    name: "Produto Aleatório 18",
    brand: "Oakley",
    slug: "produto-aleatorio-18",
    price: 799.99,
    originalPrice: 999.99,
    images: [
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Acessórios",
    rating: 4.7,
    discount: 20,
    description: "Óculos de sol esportivo.",
    features: ["Proteção UV", "Design aerodinâmico"],
    sizes: ["Único"],
    colors: [
      { name: "Preto", hex: "#000000" },
      { name: "Azul", hex: "#0000FF" }
    ],
    stock: 14,
    sku: "PROD-018",
    createdAt: "2025-05-25T13:00:00.000Z"
  },
  {
    id: 19,
    name: "Produto Aleatório 19",
    brand: "Samsung",
    slug: "produto-aleatorio-19",
    price: 3999.99,
    originalPrice: 4499.99,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.9,
    discount: 11,
    description: "Smartphone dobrável.",
    features: ["Tela dobrável", "Câmera dupla"],
    sizes: [],
    colors: [
      { name: "Preto", hex: "#000000" },
      { name: "Prata", hex: "#C0C0C0" }
    ],
    stock: 4,
    sku: "PROD-019",
    createdAt: "2025-06-01T08:00:00.000Z"
  },
  {
    id: 20,
    name: "Produto Aleatório 20",
    brand: "Apple",
    slug: "produto-aleatorio-20",
    price: 5999.99,
    originalPrice: 6999.99,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.8,
    discount: 14,
    description: "iPad Pro com tela Liquid Retina.",
    features: ["Tela Liquid Retina", "Processador M2"],
    sizes: [],
    colors: [
      { name: "Prata", hex: "#C0C0C0" },
      { name: "Cinza Espacial", hex: "#555555" }
    ],
    stock: 6,
    sku: "PROD-020",
    createdAt: "2025-06-05T10:00:00.000Z"
  },
  {
    id: 21,
    name: "Produto Aleatório 21",
    brand: "LG",
    slug: "produto-aleatorio-21",
    price: 2599.99,
    originalPrice: 2999.99,
    images: [
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.7,
    discount: 13,
    description: "Monitor ultrawide para produtividade.",
    features: ["Tela ultrawide", "Resolução 4K"],
    sizes: [],
    colors: [
      { name: "Preto", hex: "#000000" }
    ],
    stock: 8,
    sku: "PROD-021",
    createdAt: "2025-06-10T09:00:00.000Z"
  },
  {
    id: 22,
    name: "Produto Aleatório 22",
    brand: "Dell",
    slug: "produto-aleatorio-22",
    price: 3999.99,
    originalPrice: 4499.99,
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.6,
    discount: 11,
    description: "Desktop para uso profissional.",
    features: ["Processador Intel i9", "SSD 1TB"],
    sizes: [],
    colors: [
      { name: "Preto", hex: "#000000" }
    ],
    stock: 5,
    sku: "PROD-022",
    createdAt: "2025-06-15T11:00:00.000Z"
  },
  {
    id: 23,
    name: "Produto Aleatório 23",
    brand: "Havaianas",
    slug: "produto-aleatorio-23",
    price: 49.99,
    originalPrice: 59.99,
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Calçados",
    rating: 4.4,
    discount: 17,
    description: "Chinelo estampado.",
    features: ["Solado antiderrapante", "Estampa exclusiva"],
    sizes: ["35", "36", "37", "38", "39", "40", "41", "42"],
    colors: [
      { name: "Verde", hex: "#008000" },
      { name: "Amarelo", hex: "#FFFF00" }
    ],
    stock: 45,
    sku: "PROD-023",
    createdAt: "2025-06-20T13:00:00.000Z"
  },
  {
    id: 24,
    name: "Produto Aleatório 24",
    brand: "Ray-Ban",
    slug: "produto-aleatorio-24",
    price: 699.99,
    originalPrice: 899.99,
    images: [
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Acessórios",
    rating: 4.8,
    discount: 22,
    description: "Óculos de sol aviador.",
    features: ["Proteção UV", "Design aviador"],
    sizes: ["Único"],
    colors: [
      { name: "Dourado", hex: "#FFD700" },
      { name: "Preto", hex: "#000000" }
    ],
    stock: 16,
    sku: "PROD-024",
    createdAt: "2025-06-25T15:00:00.000Z"
  },
  {
    id: 25,
    name: "Produto Aleatório 25",
    brand: "Levi's",
    slug: "produto-aleatorio-25",
    price: 249.99,
    originalPrice: 299.99,
    images: [
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Roupas",
    rating: 4.5,
    discount: 17,
    description: "Jaqueta jeans.",
    features: ["Algodão premium", "Modelagem moderna"],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      { name: "Azul", hex: "#0000FF" }
    ],
    stock: 28,
    sku: "PROD-025",
    createdAt: "2025-07-01T10:00:00.000Z"
  },
  {
    id: 26,
    name: "Produto Aleatório 26",
    brand: "Vans",
    slug: "produto-aleatorio-26",
    price: 299.99,
    originalPrice: 349.99,
    images: [
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3c8b?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Calçados",
    rating: 4.6,
    discount: 14,
    description: "Tênis slip-on.",
    features: ["Solado vulcanizado", "Fácil de calçar"],
    sizes: ["38", "39", "40", "41", "42"],
    colors: [
      { name: "Preto", hex: "#000000" },
      { name: "Branco", hex: "#FFFFFF" }
    ],
    stock: 20,
    sku: "PROD-026",
    createdAt: "2025-07-05T12:00:00.000Z"
  },
  {
    id: 27,
    name: "Produto Aleatório 27",
    brand: "Gucci",
    slug: "produto-aleatorio-27",
    price: 1499.99,
    originalPrice: 1799.99,
    images: [
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Acessórios",
    rating: 4.9,
    discount: 17,
    description: "Carteira de couro legítimo.",
    features: ["Couro legítimo", "Design sofisticado"],
    sizes: ["Único"],
    colors: [
      { name: "Preto", hex: "#000000" },
      { name: "Marrom", hex: "#8B4513" }
    ],
    stock: 10,
    sku: "PROD-027",
    createdAt: "2025-07-10T14:00:00.000Z"
  },
  {
    id: 28,
    name: "Produto Aleatório 28",
    brand: "Sony",
    slug: "produto-aleatorio-28",
    price: 1099.99,
    originalPrice: 1299.99,
    images: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.8,
    discount: 15,
    description: "Caixa de som bluetooth.",
    features: ["Bluetooth", "Resistente à água"],
    sizes: [],
    colors: [
      { name: "Preto", hex: "#000000" }
    ],
    stock: 12,
    sku: "PROD-028",
    createdAt: "2025-07-15T16:00:00.000Z"
  },
  {
    id: 29,
    name: "Produto Aleatório 29",
    brand: "Samsung",
    slug: "produto-aleatorio-29",
    price: 2499.99,
    originalPrice: 2999.99,
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.7,
    discount: 17,
    description: "Smartwatch com monitoramento de saúde.",
    features: ["Monitor cardíaco", "GPS integrado"],
    sizes: [],
    colors: [
      { name: "Preto", hex: "#000000" },
      { name: "Prata", hex: "#C0C0C0" }
    ],
    stock: 15,
    sku: "PROD-029",
    createdAt: "2025-07-20T10:00:00.000Z"
  },
  {
    id: 30,
    name: "Produto Aleatório 30",
    brand: "Apple",
    slug: "produto-aleatorio-30",
    price: 7999.99,
    originalPrice: 8999.99,
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1080&auto=format&fit=crop"
    ],
    category: "Eletrônicos",
    rating: 4.9,
    discount: 11,
    description: "MacBook Pro de última geração.",
    features: ["Tela Retina", "Processador M3", "SSD 2TB"],
    sizes: [],
    colors: [
      { name: "Prata", hex: "#C0C0C0" },
      { name: "Cinza Espacial", hex: "#555555" }
    ],
    stock: 3,
    sku: "PROD-030",
    createdAt: "2025-07-25T12:00:00.000Z"
  }
];