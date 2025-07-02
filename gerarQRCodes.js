const QRCode = require('qrcode');
const fs = require('fs');

// Lista de produtos (pode ser importada de um arquivo CSV futuramente)
const produtos = [
  { nome: "Tênis Branco Nike", codigo: "NIKE-001", preco: 150.00, setor: "Masculino" },
  { nome: "Sapatilha Preta", codigo: "SAP-002", preco: 49.00, setor: "Feminino" },
  { nome: "Bota Couro", codigo: "BOT-003", preco: 200.00, setor: "Masculino" },
  { nome: "Bolsa Preta Armani", codigo: "ARMANI-001", preco: 300.00, setor: "feminino" }
];

// Garante que a pasta qrcodes existe
if (!fs.existsSync('./qrcodes')) {
  fs.mkdirSync('./qrcodes');
}

produtos.forEach(async (item) => {
  if (item.preco === undefined || item.preco === null) {
    console.warn(`⚠️ Produto "${item.nome}" (código: ${item.codigo}) não tem preço definido!`);
  }

  const data = JSON.stringify(item);
  const path = `./qrcodes/${item.codigo}.png`;

  try {
    await QRCode.toFile(path, data);
    console.log(`✅ QR Code gerado: ${path}`);
  } catch (err) {
    console.error(`❌ Erro ao gerar QR Code para ${item.nome}:`, err);
  }
});
