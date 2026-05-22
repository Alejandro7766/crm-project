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

// OBTENER TODOS LOS EMPLEADOS
router.get('/', (req, res) => {
  const sql = `SELECT e.*, u.nombre, u.apellido, u.email, u.activo 
               FROM empleados e 
               JOIN usuarios u ON e.usuario_id = u.id
               ORDER BY e.creado_en DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener empleados' });
    res.json(results);
  });
});

// OBTENER UN EMPLEADO POR ID
router.get('/:id', (req, res) => {
  const sql = `SELECT e.*, u.nombre, u.apellido, u.email 
               FROM empleados e 
               JOIN usuarios u ON e.usuario_id = u.id
               WHERE e.id = ?`;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener empleado' });
    if (results.length === 0) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(results[0]);
  });
});

// CREAR EMPLEADO
router.post('/', (req, res) => {
  const { nombre, apellido, email, contrasena, telefono, cargo, departamento, salario, fecha_contratacion } = req.body;

  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
  }

  const bcrypt = require('bcryptjs');
  const crypto = require('crypto');

  bcrypt.hash(contrasena, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Error al crear empleado' });

    const usuario_id = crypto.randomUUID();
    const empleado_id = crypto.randomUUID();
    const rol_id = '2';

    const sqlUsuario = `INSERT INTO usuarios (id, rol_id, nombre, apellido, email, contrasena) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sqlUsuario, [usuario_id, rol_id, nombre, apellido, email, hash], (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'El email ya está registrado' });
        return res.status(500).json({ error: 'Error al crear usuario' });
      }

      const sqlEmpleado = `INSERT INTO empleados (id, usuario_id, telefono, cargo, departamento, salario, fecha_contratacion) VALUES (?, ?, ?, ?, ?, ?, ?)`;

      db.query(sqlEmpleado, [empleado_id, usuario_id, telefono, cargo, departamento, salario, fecha_contratacion], (err) => {
        if (err) return res.status(500).json({ error: 'Error al crear empleado' });
        res.json({ mensaje: 'Empleado creado correctamente', id: empleado_id });
      });
    });
  });
});

// ELIMINAR EMPLEADO
router.delete('/:id', (req, res) => {
    const sqlBuscar = 'SELECT usuario_id FROM empleados WHERE id = ?';
    db.query(sqlBuscar, [req.params.id], (err, results) => {
      if (err || results.length === 0) return res.status(500).json({ error: 'Empleado no encontrado' });
      
      const usuario_id = results[0].usuario_id;
  
      const sqlEmpleado = 'DELETE FROM empleados WHERE id = ?';
      db.query(sqlEmpleado, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar empleado' });
  
        const sqlUsuario = 'DELETE FROM usuarios WHERE id = ?';
        db.query(sqlUsuario, [usuario_id], (err) => {
          if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
          res.json({ mensaje: 'Empleado eliminado correctamente' });
        });
      });
    });
  });

  // EDITAR EMPLEADO
router.put('/:id', (req, res) => {
  const { nombre, apellido, email, telefono, cargo, departamento, salario, fecha_contratacion } = req.body;

  const sqlUsuario = `UPDATE usuarios SET nombre=?, apellido=?, email=? WHERE id=(SELECT usuario_id FROM empleados WHERE id=?)`;
  db.query(sqlUsuario, [nombre, apellido, email, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar usuario' });

    const sqlEmpleado = `UPDATE empleados SET telefono=?, cargo=?, departamento=?, salario=?, fecha_contratacion=? WHERE id=?`;
    db.query(sqlEmpleado, [telefono, cargo, departamento, salario, fecha_contratacion, req.params.id], (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar empleado' });
      res.json({ mensaje: 'Empleado actualizado correctamente' });
    });
  });
});

module.exports = router;