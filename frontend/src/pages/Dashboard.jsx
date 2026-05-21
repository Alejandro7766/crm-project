import { useState } from 'react'
import Clientes from './Clientes'
import Empleados from './Empleados'

function Dashboard({ usuario, onLogout }) {
  const [paginaActual, setPaginaActual] = useState('dashboard')

  const renderContenido = () => {
    if (paginaActual === 'clientes') return <Clientes />
    if (paginaActual === 'empleados') return <Empleados />
    
    return (
      <>
        <h1 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Bienvenido, {usuario.nombre}</h1>
        <p style={{ color: '#888', marginBottom: '32px' }}>Panel de control del CRM</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px' }}>
            <p style={{ color: '#888', fontSize: '13px' }}>Clientes</p>
            <h2 style={{ color: '#1a1a2e', fontSize: '32px' }}>0</h2>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px' }}>
            <p style={{ color: '#888', fontSize: '13px' }}>Empleados</p>
            <h2 style={{ color: '#1a1a2e', fontSize: '32px' }}>0</h2>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px' }}>
            <p style={{ color: '#888', fontSize: '13px' }}>Activos</p>
            <h2 style={{ color: '#1a1a2e', fontSize: '32px' }}>0</h2>
          </div>
        </div>

        <div style={{ background: 'white', padding: '24px', borderRadius: '12px' }}>
          <h3 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Actividad reciente</h3>
          <p style={{ color: '#aaa' }}>No hay actividad reciente</p>
        </div>
      </>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      
      <div style={{
        width: '220px',
        backgroundColor: '#1a1a2e',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px'
      }}>
        <h2 style={{ color: '#534AB7', marginBottom: '32px' }}>CRM</h2>
        
        <nav style={{ flex: 1 }}>
          <p onClick={() => setPaginaActual('dashboard')} style={{
            padding: '10px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer',
            backgroundColor: paginaActual === 'dashboard' ? '#534AB7' : 'transparent'
          }}>Dashboard</p>
          <p onClick={() => setPaginaActual('clientes')} style={{
            padding: '10px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer',
            backgroundColor: paginaActual === 'clientes' ? '#534AB7' : 'transparent'
          }}>Clientes</p>
          <p onClick={() => setPaginaActual('empleados')} style={{
            padding: '10px', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer',
            backgroundColor: paginaActual === 'empleados' ? '#534AB7' : 'transparent'
          }}>Empleados</p>
          {usuario.rol === 'administrador' && (
            <p onClick={() => setPaginaActual('admin')} style={{
              padding: '10px', borderRadius: '8px', cursor: 'pointer',
              backgroundColor: paginaActual === 'admin' ? '#534AB7' : 'transparent'
            }}>Administración</p>
          )}
        </nav>

        <div style={{ borderTop: '1px solid #333', paddingTop: '16px' }}>
          <p style={{ fontSize: '13px', color: '#aaa' }}>{usuario.nombre} {usuario.apellido}</p>
          <p style={{ fontSize: '11px', color: '#534AB7', marginBottom: '12px' }}>{usuario.rol}</p>
          <button onClick={onLogout} style={{
            width: '100%', padding: '8px', backgroundColor: 'transparent',
            color: '#aaa', border: '1px solid #333', borderRadius: '8px', cursor: 'pointer'
          }}>Cerrar sesión</button>
        </div>
      </div>

      <div style={{ flex: 1, backgroundColor: '#f0f2f5', padding: '32px', overflowY: 'auto' }}>
        {renderContenido()}
      </div>
    </div>
  )
}

export default Dashboard