const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Variável para guardar o e-mail da central (padrão inicial)
let emailCentral = 'thiagoalvez451@gmail.com';

app.post('/enviar-email', async (req, res) => {
  const { nome, codigo, preco, setor, motivo } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'thiagoalvez451@gmail.com',       // seu e-mail para autenticação SMTP
      pass: 'vbur xmsi zufs tzsc',            // sua senha de app
    },
  });

  const mailOptions = {
    from: 'thiagoalvez451@gmail.com',
    to: emailCentral,    // aqui usa a variável dinâmica
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

// Nova rota para atualizar o e-mail da central
app.post('/config/email-central', (req, res) => {
  const { novoEmail } = req.body;
  if (!novoEmail || !novoEmail.includes('@')) {
    return res.status(400).json({ erro: 'E-mail inválido' });
  }
  emailCentral = novoEmail;
  console.log(`E-mail da central atualizado para: ${emailCentral}`);
  res.json({ mensagem: 'E-mail atualizado com sucesso', emailCentral });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
