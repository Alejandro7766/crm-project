const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// REGISTRO
router.post('/registro', async (req, res) => {
  const { nombre, apellido, email, contrasena, rol_id } = req.body;

  if (!nombre || !email || !contrasena || !rol_id) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const hash = await bcrypt.hash(contrasena, 10);
    const id = require('crypto').randomUUID();

    const sql = `INSERT INTO usuarios (id, rol_id, nombre, apellido, email, contrasena) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [id, rol_id, nombre, apellido, email, hash], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'El email ya está registrado' });
        }
        return res.status(500).json({ error: 'Error al registrar usuario' });
      }
      res.json({ mensaje: 'Usuario registrado correctamente' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const sql = `SELECT u.*, r.nombre as rol FROM usuarios u 
               JOIN roles r ON u.rol_id = r.id 
               WHERE u.email = ?`;

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error en el servidor' });
    if (results.length === 0) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

    const usuario = results[0];
    const valido = await bcrypt.compare(contrasena, usuario.contrasena);

    if (!valido) return res.status(401).json({ error: 'Email o contraseña incorrectos' });

    const token = jwt.sign(
  { id: usuario.id, email: usuario.email, rol: usuario.rol },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  });
});

module.exports = router;
