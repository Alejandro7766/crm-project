import { useState, useEffect } from 'react'
import axios from 'axios'

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [empleados, setEmpleados] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', telefono: '',
    empresa: '', categoria: '', notas: '', estado: 'activo',
    empleado_asignado_id: ''
  })

  useEffect(() => {
    cargarClientes()
    cargarEmpleados()
  }, [])

  const cargarClientes = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await axios.get('http://localhost:3000/api/clientes', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setClientes(res.data)
    } catch (err) {
      console.error('Error cargando clientes')
    }
  }

  const cargarEmpleados = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/empleados')
      setEmpleados(res.data)
    } catch (err) {
      console.error('Error cargando empleados')
    }
  }

  const handleNuevo = () => {
    setClienteEditando(null)
    setForm({ nombre: '', apellido: '', email: '', telefono: '', empresa: '', categoria: '', notas: '', estado: 'activo', empleado_asignado_id: '' })
    setMostrarFormulario(true)
  }

  const handleEditar = (cliente) => {
    setClienteEditando(cliente)
    setForm({
      nombre: cliente.nombre || '',
      apellido: cliente.apellido || '',
      email: cliente.email || '',
      telefono: cliente.telefono || '',
      empresa: cliente.empresa || '',
      categoria: cliente.categoria || '',
      notas: cliente.notas || '',
      estado: cliente.estado || 'activo',
      empleado_asignado_id: cliente.empleado_asignado_id || ''
    })
    setMostrarFormulario(true)
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    try {
      if (clienteEditando) {
        await axios.put(`http://localhost:3000/api/clientes/${clienteEditando.id}`, form)
      } else {
        await axios.post('http://localhost:3000/api/clientes', form)
      }
      setMostrarFormulario(false)
      setClienteEditando(null)
      setForm({ nombre: '', apellido: '', email: '', telefono: '', empresa: '', categoria: '', notas: '', estado: 'activo', empleado_asignado_id: '' })
      cargarClientes()
    } catch (err) {
      console.error('Error guardando cliente')
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este cliente?')) return
    try {
      await axios.delete(`http://localhost:3000/api/clientes/${id}`)
      cargarClientes()
    } catch (err) {
      console.error('Error eliminando cliente')
    }
  }

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    (c.email && c.email.toLowerCase().includes(busqueda.toLowerCase())) ||
    (c.empresa && c.empresa.toLowerCase().includes(busqueda.toLowerCase()))
  )

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#1a1a2e' }}>Clientes</h1>
        <button onClick={handleNuevo} style={{
          padding: '10px 20px', backgroundColor: '#534AB7', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer'
        }}>+ Nuevo cliente</button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre, email o empresa..."
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
          <h3 style={{ marginBottom: '16px', color: '#1a1a2e' }}>
            {clienteEditando ? 'Editar cliente' : 'Nuevo cliente'}
          </h3>
          <form onSubmit={handleGuardar}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <input placeholder="Nombre *" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Apellido" value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Empresa" value={form.empresa} onChange={e => setForm({ ...form, empresa: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <input placeholder="Categoría" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              <select value={form.estado} onChange={e => setForm({ ...form, estado: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="potencial">Potencial</option>
              </select>
              <select value={form.empleado_asignado_id} onChange={e => setForm({ ...form, empleado_asignado_id: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <option value="">Sin empleado asignado</option>
                {empleados.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre} {e.apellido}</option>
                ))}
              </select>
            </div>
            <textarea placeholder="Notas" value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '12px', boxSizing: 'border-box' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#534AB7', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                {clienteEditando ? 'Actualizar' : 'Guardar'}
              </button>
              <button type="button" onClick={() => { setMostrarFormulario(false); setClienteEditando(null) }} style={{ padding: '10px 20px', backgroundColor: '#eee', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancelar</button>
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
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Empresa</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Estado</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Empleado asignado</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', color: '#555', fontWeight: '500' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map(c => (
              <tr key={c.id} style={{ borderTop: '1px solid #f0f0f0' }}>
                <td style={{ padding: '12px 16px' }}>{c.nombre} {c.apellido}</td>
                <td style={{ padding: '12px 16px', color: '#888' }}>{c.email}</td>
                <td style={{ padding: '12px 16px', color: '#888' }}>{c.empresa}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px',
                    backgroundColor: c.estado === 'activo' ? '#e8f5e9' : c.estado === 'potencial' ? '#fff3e0' : '#ffebee',
                    color: c.estado === 'activo' ? '#2e7d32' : c.estado === 'potencial' ? '#e65100' : '#c62828'
                  }}>{c.estado}</span>
                </td>
                <td style={{ padding: '12px 16px', color: '#888' }}>
                  {c.empleado_nombre ? `${c.empleado_nombre} ${c.empleado_apellido}` : 'Sin asignar'}
                </td>
                <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleEditar(c)} style={{
                    padding: '6px 12px', backgroundColor: '#e8eaf6', color: '#534AB7',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                  }}>Editar</button>
                  <button onClick={() => handleEliminar(c.id)} style={{
                    padding: '6px 12px', backgroundColor: '#ffebee', color: '#c62828',
                    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'
                  }}>Eliminar</button>
                </td>
              </tr>
            ))}
            {clientesFiltrados.length === 0 && (
              <tr><td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#aaa' }}>No hay clientes</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Clientes