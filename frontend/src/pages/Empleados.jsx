import { useState, useEffect } from 'react'
import axios from 'axios'

function Empleados() {
  const [empleados, setEmpleados] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', contrasena: '',
    telefono: '', cargo: '', departamento: '', salario: '', fecha_contratacion: ''
  })

  useEffect(() => {
    cargarEmpleados()
  }, [])

  const cargarEmpleados = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/empleados')
      setEmpleados(res.data)
    } catch (err) {
      console.error('Error cargando empleados')
    }
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3000/api/empleados', form)
      setMostrarFormulario(false)
      setForm({ nombre: '', apellido: '', email: '', contrasena: '', telefono: '', cargo: '', departamento: '', salario: '', fecha_contratacion: '' })
      cargarEmpleados()
    } catch (err) {
      alert('Error al guardar empleado. El email puede estar ya registrado.')
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este empleado?')) return
    try {
      await axios.delete(`http://localhost:3000/api/empleados/${id}`)
      cargarEmpleados()
    } catch (err) {
      console.error('Error eliminando empleado')
    }
  }

  const empleadosFiltrados = empleados.filter(e =>
    e.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (e.email && e.email.toLowerCase().includes(busqueda.toLowerCase())) ||
    (e.cargo && e.cargo.toLowerCase().includes(busqueda.toLowerCase()))
  )

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#1a1a2e' }}>Empleados</h1>
        <button onClick={() => setMostrarFormulario(true)} style={{
          padding: '10px 20px', backgroundColor: '#534AB7', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>+ Nuevo empleado</button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, email o cargo..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{
          width: '100%', padding: '10px', borderRadius: '8px',
          border: '1px solid #ddd', marginBottom: '24px',
          fontSize: '14px', boxSizing: 'border-box'
        }}
      />

      {mostrarFormulario && (
        <div style={{
          background: 'white', padding: '24px', borderRadius: '12px',
          marginBottom: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '16px', color: '#1a1a2e' }}>Nuevo empleado</h3>
          <form onSubmit={handleGuardar}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input placeholder="Nombre *" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Apellido" value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Email *" required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Contraseña *" required type="password" value={form.contrasena} onChange={e => setForm({ ...form, contrasena: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Cargo" value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Departamento" value={form.departamento} onChange={e => setForm({ ...form, departamento: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Salario" type="number" value={form.salario} onChange={e => setForm({ ...form, salario: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Fecha contratación" type="date" value={form.fecha_contratacion} onChange={e => setForm({ ...form, fecha_contratacion: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#534AB7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Guardar</button>
              <button type="button" onClick={() => setMostrarFormulario(false)} style={{ padding: '10px 20px', backgroundColor: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Nombre</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Email</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Cargo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Departamento</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleadosFiltrados.map(e => (
              <tr key={e.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px' }}>{e.nombre} {e.apellido}</td>
                <td style={{ padding: '12px 16px', color: '#888' }}>{e.email}</td>
                <td style={{ padding: '12px 16px', color: '#888' }}>{e.cargo}</td>
                <td style={{ padding: '12px 16px', color: '#888' }}>{e.departamento}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => handleEliminar(e.id)} style={{
                    padding: '6px 12px', backgroundColor: '#ffebee', color: '#c62828',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                  }}>Eliminar</button>
                </td>
              </tr>
            ))}
            {empleadosFiltrados.length === 0 && (
              <tr><td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#aaa' }}>No hay empleados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Empleados