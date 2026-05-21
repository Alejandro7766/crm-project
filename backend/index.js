const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');
const empleadosRoutes = require('./routes/empleados');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/empleados', empleadosRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'CRM API funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});