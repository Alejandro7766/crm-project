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
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  const jwt = require('jsonwebtoken');
  let usuario;
  try {
    usuario = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }

  let sql;
  let params;

  if (usuario.rol === 'administrador') {
    sql = `SELECT c.*, u.nombre as empleado_nombre, u.apellido as empleado_apellido 
           FROM clientes c
           LEFT JOIN empleados e ON c.empleado_asignado_id = e.id
           LEFT JOIN usuarios u ON e.usuario_id = u.id
           ORDER BY c.creado_en DESC`;
    params = [];
  } else {
    sql = `SELECT c.*, u.nombre as empleado_nombre, u.apellido as empleado_apellido 
           FROM clientes c
           LEFT JOIN empleados e ON c.empleado_asignado_id = e.id
           LEFT JOIN usuarios u ON e.usuario_id = u.id
           WHERE u.id = ?
           ORDER BY c.creado_en DESC`;
    params = [usuario.id];
  }

  db.query(sql, params, (err, results) => {
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
  const { nombre, apellido, email, telefono, empresa, categoria, direccion, notas, estado, empleado_asignado_id } = req.body;

  const sql = `UPDATE clientes SET nombre=?, apellido=?, email=?, telefono=?, empresa=?, categoria=?, direccion=?, notas=?, estado=?, empleado_asignado_id=? 
               WHERE id=?`;

  db.query(sql, [nombre, apellido, email, telefono, empresa, categoria, direccion, notas, estado, empleado_asignado_id || null, req.params.id], (err) => {
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