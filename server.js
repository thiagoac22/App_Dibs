const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/enviar-email', async (req, res) => {
  const { nome, codigo, preco, setor, motivo } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thiagoalvez451@gmail.com',       // substitua pelo seu e-mail
      pass: 'vbur xmsi zufs tzsc',      // use uma senha de app
    },
  });

  const mailOptions = {
    from: 'thiagoalvez451@gmail.com',
    to: 'thiagoalvez451@gmail.com',         // e-mail da central
    subject: `Devolução: ${codigo} - ${nome}`,
    text: `
Produto devolvido:

Nome: ${nome}
Código: ${codigo}
Setor: ${setor}
Preço: R$${preco}
Motivo da devolução: ${motivo}
Data/Hora: ${new Date().toLocaleString()}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ mensagem: 'Email enviado com sucesso!' });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    res.status(500).json({ erro: 'Erro ao enviar e-mail' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
