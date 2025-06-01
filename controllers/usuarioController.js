const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.buscarDados = async (req, res) => {
  try {
    const userId = req.usuarioId;  // do middleware
    const usuario = await Usuario.findById(userId).select('-senhaHash'); // remove senhaHash
    if (!usuario) return res.status(404).json({ mensagem: "Usuário não encontrado" });
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const userId = req.userId; // Pega do middleware de autenticação (token)
    const { nome, email, senha } = req.body;

    const updateData = { nome, email };

    if (senha) {
      updateData.senhaHash = bcrypt.hashSync(senha, 10);
    }

    const usuarioAtualizado = await Usuario.findByIdAndUpdate(userId, updateData, { new: true });

    if (!usuarioAtualizado) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const userId = req.userId; // Pega do middleware de autenticação

    const usuarioDeletado = await Usuario.findByIdAndDelete(userId);

    if (!usuarioDeletado) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.status(200).json({ mensagem: "Usuário deletado com sucesso" });
  } catch (err) {
    res.status(500).json({ mensagem: err.message });
  }
};

exports.registrar = async (req, res) => {
  const { nome, email, senha } = req.body;
  const senhaHash = bcrypt.hashSync(senha, 10);
  try {
    const usuario = new Usuario({ nome, email, senhaHash });
    await usuario.save();
    res.status(201).json({ mensagem: 'Usuário criado' });
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado' });

    const senhaValida = bcrypt.compareSync(senha, usuario.senhaHash);
    if (!senhaValida) return res.status(401).json({ mensagem: 'Senha incorreta' });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json(err);
  }
};
