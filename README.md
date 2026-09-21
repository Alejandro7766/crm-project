CRM Project

CRM funcional para la gestión de clientes y empleados, con control de acceso basado en roles y panel de administración.

¿Qué es este proyecto?

Es una aplicación web de tipo CRM (Customer Relationship Management) pensada para que una empresa gestione su cartera de clientes y su plantilla de empleados, con dos niveles de acceso:

Administrador: control total del sistema. Puede ver y gestionar todos los clientes, dar de alta/editar/eliminar empleados, y asignar clientes a empleados concretos.
Empleado: acceso limitado. Solo puede ver y trabajar con los clientes que tiene asignados; no tiene acceso a la sección de empleados ni a datos sensibles como salarios.

La autenticación se hace con JWT (JSON Web Tokens): al iniciar sesión, el servidor genera un token que el frontend guarda y envía en cada petición para demostrar quién es el usuario y qué puede hacer.

Funcionalidades
Login con email y contraseña (JWT)
Dashboard con estadísticas en tiempo real
Gestión de clientes: crear, ver, editar, eliminar, asignar a un empleado
Gestión de empleados: crear, ver, editar, eliminar (solo administrador)
Panel de administración de roles y permisos
Control de acceso por rol en todas las rutas del backend
Stack técnico

Backend: Node.js + Express, MySQL, JWT, bcryptjs para el hash de contraseñas Frontend: React (Vite), Axios

Estructura del proyecto
crm-project/
├── backend/
│   ├── routes/
│   │   ├── auth.js        # login y registro
│   │   ├── clientes.js    # CRUD de clientes
│   │   ├── empleados.js   # CRUD de empleados (solo admin)
│   │   └── usuarios.js
│   ├── middleware/
│   │   └── auth.js        # verificación de JWT y de rol admin
│   ├── schema.sql         # script para crear las tablas de la base de datos
│   ├── .env.example       # plantilla de variables de entorno
│   └── index.js
└── frontend/
    └── src/
        └── pages/
            ├── Dashboard.jsx
            ├── Clientes.jsx
            ├── Empleados.jsx
            └── Administracion.jsx
Requisitos previos
Node.js instalado
MySQL instalado y corriendo (por ejemplo con XAMPP)
Git
Instalación paso a paso
1. Clonar el repositorio
bash
git clone https://github.com/Alejandro7766/crm-project.git
cd crm-project
2. Crear la base de datos

Abre phpMyAdmin (o el cliente MySQL que uses) y crea una base de datos vacía llamada crm_proyecto.

Dentro de esa base de datos, ejecuta el contenido del archivo backend/schema.sql. Esto crea todas las tablas necesarias (usuarios, roles, empleados, clientes, etc.) e inserta los dos roles base: administrador y empleado.

3. Configurar el backend
bash
cd backend
npm install

Crea un archivo .env dentro de backend/ con este contenido, ajustando los valores a tu entorno:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=crm_proyecto
JWT_SECRET=pon_aqui_un_secreto_largo_y_aleatorio

Para generar un JWT_SECRET seguro puedes usar:

bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

Arranca el servidor:

bash
node index.js

Por defecto queda escuchando en http://localhost:3000.

4. Configurar el frontend

En otra terminal:

bash
cd frontend
npm install
npm run dev

Esto abre la aplicación en http://localhost:5173.

5. Crear el primer usuario administrador

Importante: la base de datos está vacía tras crear las tablas, y el frontend no tiene una pantalla de registro (por diseño, solo un administrador puede dar de alta usuarios). Por eso, el primer usuario admin hay que crearlo manualmente, con uno de estos dos métodos:

Opción A — vía API (recomendada)

Con el backend arrancado, haz una petición POST a /registro. Desde PowerShell:

powershell
$body = @{
    nombre = "Admin"
    apellido = "Sistema"
    email = "admin@test.com"
    contrasena = "123456"
    rol_id = "1"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/registro" -Method Post -Body $body -ContentType "application/json"

(rol_id: "1" corresponde al rol administrador).

Opción B — directamente en la base de datos

Si prefieres insertarlo a mano en phpMyAdmin, ten en cuenta que el campo contrasena no puede ir en texto plano: tiene que ser un hash de bcrypt, porque el login usa bcrypt.compare para verificarla. Genera el hash con:

bash
node -e "const bcrypt=require('bcryptjs'); console.log(bcrypt.hashSync('TU_CONTRASEÑA', 10));"

e inserta ese resultado en el campo contrasena de la tabla usuarios, junto con un id (UUID) y rol_id = 1.

6. Iniciar sesión

Abre http://localhost:5173 y entra con el email y la contraseña que hayas usado en el paso anterior.

Notas de seguridad
Todas las rutas de clientes y empleados requieren un token JWT válido; las de empleados requieren además rol de administrador.
Nunca subas tu archivo .env al repositorio (está incluido en .gitignore).
El JWT_SECRET debe ser único y aleatorio en cada entorno; no reutilices el mismo valor en desarrollo y producción.
Estado

Proyecto funcional en local. Pendiente de despliegue en producción.
