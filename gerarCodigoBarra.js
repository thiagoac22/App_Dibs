const bwipjs = require('bwip-js');
const fs = require('fs').promises;
const path = require('path');

const produtos = [
  { nome: "Tênis Branco Nike", codigo: "123456789012", preco: 150.00, setor: "Masculino" },
  { nome: "Sapatilha Preta", codigo: "123456789013", preco: 49.00, setor: "Feminino" },
  { nome: "Bota Couro", codigo: "123456789014", preco: 200.00, setor: "Masculino" },
  { nome: "Bolsa Preta Armani", codigo: "123456789015", preco: 300.00, setor: "Feminino" },
  { nome: "Relógio Rolex", codigo: "123456789016", preco: 1500.00, setor: "Masculino" }
];

const outputDir = path.resolve(__dirname, 'codigo_de_barras');

async function gerarCodigosBarras() {
  try {
    await fs.mkdir(outputDir, { recursive: true });

    for (const produto of produtos) {
      const filePath = path.join(outputDir, `${produto.codigo}.png`);
      try {
        const pngBuffer = await bwipjs.toBuffer({
          bcid: 'code128',
          text: produto.codigo,
          scale: 3,
          height: 10,
          includetext: true,
          textxalign: 'center',
        });
        await fs.writeFile(filePath, pngBuffer);
        console.log(`✅ Código de barras gerado: ${filePath}`);
      } catch (err) {
        console.error(`❌ Erro ao gerar código de barras para ${produto.nome}:`, err);
      }
    }
  } catch (err) {
    console.error('❌ Erro ao criar pasta de saída:', err);
  }
}

gerarCodigosBarras();
