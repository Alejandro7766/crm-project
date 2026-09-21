CRM Project

CRM funcional para la gestión de clientes y empleados, con control de acceso basado en roles y panel de administración.

Descripción

Aplicación full-stack que permite a una empresa gestionar su cartera de clientes, sus empleados y los permisos de acceso al sistema. Los administradores tienen control total (usuarios, clientes, permisos), mientras que los empleados solo acceden a los clientes que tienen asignados.

Funcionalidades
Autenticación: registro y login con JWT
Roles y permisos: administrador y empleado, con accesos diferenciados
Gestión de clientes: CRUD completo (crear, ver, editar, eliminar), con asignación a empleados
Gestión de empleados: CRUD completo, incluyendo borrado en cascada del usuario asociado
Panel de administración: gestión de roles y permisos, solo accesible para administradores
Dashboard: estadísticas en tiempo real obtenidas directamente de la base de datos
Stack técnico

Backend

Node.js + Express
MySQL
JWT para autenticación

Frontend

React (Vite)
Axios para las llamadas a la API, con el token Bearer incluido en cada petición
Estructura del proyecto
crm-project/
├── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── clientes.js
│   │   ├── empleados.js
│   │   └── usuarios.js
│   ├── middleware/
│   │   └── auth.js
│   └── index.js
└── frontend/
    └── src/
        └── pages/
            ├── Dashboard.jsx
            ├── Clientes.jsx
            ├── Empleados.jsx
            └── Administracion.jsx
Base de datos

Tablas principales: roles, permisos, roles_permisos, usuarios, empleados, clientes, interacciones_clientes, sesiones.

Roles disponibles: administrador y empleado.

Instalación y uso local
Clona el repositorio:
   git clone https://github.com/Alejandro7766/crm-project.git
   cd crm-project
Configura la base de datos MySQL (por ejemplo con XAMPP) y crea la base de datos crm_proyecto a partir del esquema incluido.
Backend:
   cd backend
   npm install

Crea un archivo .env con tus propias variables (no incluidas en el repositorio):

   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=crm_proyecto
   JWT_SECRET=tu_secreto

Inicia el servidor:

   node index.js
Frontend:
   cd frontend
   npm install
   npm run dev
Abre http://localhost:5173 en el navegador.
Notas técnicas
El control de acceso por rol se implementa filtrando en el backend según el usuario.id extraído del token JWT.
Al eliminar un empleado, primero se consulta su usuario_id en la tabla empleados para poder eliminar también el registro de usuario asociado (borrado en cascada).
Estado

Proyecto funcional en local. Pendiente de despliegue en producción.
