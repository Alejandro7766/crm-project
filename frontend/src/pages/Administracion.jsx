import { useState, useEffect } from 'react'
import axios from 'axios'

function Administracion() {
  const [usuarios, setUsuarios] = useState([])
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/usuarios')
      setUsuarios(res.data)
    } catch (err) {
      console.error('Error cargando usuarios')
    }
  }

  const handleCambiarRol = async (id, nuevoRol) => {
    try {
      await axios.put(`http://localhost:3000/api/usuarios/${id}/rol`, { rol: nuevoRol })
      cargarUsuarios()
    } catch (err) {
      console.error('Error cambiando rol')
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este usuario?')) return
    try {
      await axios.delete(`http://localhost:3000/api/usuarios/${id}`)
      cargarUsuarios()
    } catch (err) {
      console.error('Error eliminando usuario')
    }
  }

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ color: '#1a1a2e' }}>Administración</h1>
        <p style={{ color: '#888' }}>Gestión de usuarios y roles del sistema</p>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o email..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: '100%', padding: '10px', borderRadius: '8px',
          border: '1px solid #ddd', marginBottom: '24px',
          fontSize: '14px', boxSizing: 'border-box'
        }}
      />

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Nombre</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Email</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Rol</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Estado</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map(u => (
              <tr key={u.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px' }}>{u.nombre} {u.apellido}</td>
                <td style={{ padding: '12px 16px', color: '#888' }}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <select
                    value={u.rol_nombre}
                    onChange={(e) => handleCambiarRol(u.id, e.target.value)}
                    style={{
                      padding: '6px 10px', borderRadius: '6px',
                      border: '1px solid #ddd', fontSize: '13px', cursor: 'pointer'
                    }}
                  >
                    <option value="administrador">Administrador</option>
                    <option value="empleado">Empleado</option>
                  </select>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                    backgroundColor: u.activo ? '#e8f5e9' : '#ffebee',
                    color: u.activo ? '#2e7d32' : '#c62828'
                  }}>{u.activo ? 'Activo' : 'Inactivo'}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => handleEliminar(u.id)} style={{
                    padding: '6px 12px', backgroundColor: '#ffebee', color: '#c62828',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                  }}>Eliminar</button>
                </td>
              </tr>
            ))}
            {usuariosFiltrados.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#aaa' }}>No hay usuarios</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Administracion