-- Esquema para crm_proyecto
-- Generado a partir de las columnas usadas en auth.js, clientes.js y empleados.js
-- Ejecutar dentro de la base de datos crm_proyecto (ya creada)

-- Tabla de roles
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO roles (id, nombre) VALUES
('1', 'administrador'),
('2', 'empleado');

-- Tabla de permisos
CREATE TABLE permisos (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(255)
);

-- Tabla intermedia roles <-> permisos
CREATE TABLE roles_permisos (
    rol_id VARCHAR(36) NOT NULL,
    permiso_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permiso_id) REFERENCES permisos(id) ON DELETE CASCADE
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id VARCHAR(36) PRIMARY KEY,
    rol_id VARCHAR(36) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    activo TINYINT(1) DEFAULT 1,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- Tabla de empleados (extiende usuarios)
CREATE TABLE empleados (
    id VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    salario DECIMAL(10, 2),
    fecha_contratacion DATE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de clientes
CREATE TABLE clientes (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100),
    email VARCHAR(150),
    telefono VARCHAR(30),
    empresa VARCHAR(150),
    categoria VARCHAR(100),
    direccion VARCHAR(255),
    notas TEXT,
    estado VARCHAR(50) DEFAULT 'activo',
    empleado_asignado_id VARCHAR(36),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empleado_asignado_id) REFERENCES empleados(id) ON DELETE SET NULL
);

-- Tabla de interacciones con clientes
CREATE TABLE interacciones_clientes (
    id VARCHAR(36) PRIMARY KEY,
    cliente_id VARCHAR(36) NOT NULL,
    empleado_id VARCHAR(36),
    tipo VARCHAR(50),
    descripcion TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (empleado_id) REFERENCES empleados(id) ON DELETE SET NULL
);

-- Tabla de sesiones
CREATE TABLE sesiones (
    id VARCHAR(36) PRIMARY KEY,
    usuario_id VARCHAR(36) NOT NULL,
    token VARCHAR(500),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expira_en TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
