const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ✅ ROTA GET - Busca os produtos do banco
app.get('/api/produtos', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, nome, descricao, preco, imagem FROM produtos');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err.message);
    res.status(500).json({ mensagem: 'Erro ao buscar produtos.' });
  }
});

// ✅ ROTA POST - Salva o e-mail na tabela inscritos
app.post('/api/inscricao', async (req, res) => {
  const { email_inscrito } = req.body;

  if (!email_inscrito) {
    return res.status(400).json({ mensagem: 'O campo e-mail é obrigatório.' });
  }

  try {
    await db.execute(
      'INSERT INTO inscritos (email_inscrito) VALUES (?)',
      [email_inscrito]
    );
    res.status(201).json({ mensagem: 'Inscrição realizada com sucesso!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ mensagem: 'Este e-mail já está inscrito.' });
    } else {
      console.error('Erro ao salvar e-mail:', err.message);
      res.status(500).json({ mensagem: 'Erro ao salvar no banco de dados.' });
    }
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});