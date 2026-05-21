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

// OBTENER TODOS LOS CLIENTES
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM clientes ORDER BY creado_en DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener clientes' });
    res.json(results);
  });
});

// OBTENER UN CLIENTE POR ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM clientes WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener cliente' });
    if (results.length === 0) return res.status(404).json({ error: 'Cliente no encontrado' });
    res.json(results[0]);
  });
});

// CREAR CLIENTE
router.post('/', (req, res) => {
  const { nombre, apellido, email, telefono, empresa, categoria, direccion, notas, estado } = req.body;

  if (!nombre) return res.status(400).json({ error: 'El nombre es obligatorio' });

  const id = require('crypto').randomUUID();
  const sql = `INSERT INTO clientes (id, nombre, apellido, email, telefono, empresa, categoria, direccion, notas, estado) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [id, nombre, apellido, email, telefono, empresa, categoria, direccion, notas, estado || 'activo'], (err) => {
    if (err) return res.status(500).json({ error: 'Error al crear cliente' });
    res.json({ mensaje: 'Cliente creado correctamente', id });
  });
});

// EDITAR CLIENTE
router.put('/:id', (req, res) => {
  const { nombre, apellido, email, telefono, empresa, categoria, direccion, notas, estado } = req.body;

  const sql = `UPDATE clientes SET nombre=?, apellido=?, email=?, telefono=?, empresa=?, categoria=?, direccion=?, notas=?, estado=? 
               WHERE id=?`;

  db.query(sql, [nombre, apellido, email, telefono, empresa, categoria, direccion, notas, estado, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al editar cliente' });
    res.json({ mensaje: 'Cliente actualizado correctamente' });
  });
});

// ELIMINAR CLIENTE
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM clientes WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar cliente' });
    res.json({ mensaje: 'Cliente eliminado correctamente' });
  });
});

module.exports = router;