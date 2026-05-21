const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// OBTENER TODOS LOS USUARIOS
router.get('/', (req, res) => {
  const sql = `SELECT u.*, r.nombre as rol_nombre 
               FROM usuarios u 
               JOIN roles r ON u.rol_id = r.id
               ORDER BY u.creado_en DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener usuarios' });
    res.json(results);
  });
});

// CAMBIAR ROL DE USUARIO
router.put('/:id/rol', (req, res) => {
  const { rol } = req.body;
  const sql = `UPDATE usuarios SET rol_id = (SELECT id FROM roles WHERE nombre = ?) WHERE id = ?`;
  db.query(sql, [rol, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al cambiar rol' });
    res.json({ mensaje: 'Rol actualizado correctamente' });
  });
});

// ELIMINAR USUARIO
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM usuarios WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  });
});

module.exports = router;