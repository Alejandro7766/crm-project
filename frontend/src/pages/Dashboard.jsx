function Dashboard({ usuario, onLogout }) {
    return (
      <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
        
        {/* Sidebar */}
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
            <p style={{ padding: '10px', backgroundColor: '#534AB7', borderRadius: '8px', marginBottom: '8px', cursor: 'pointer' }}>Dashboard</p>
            <p style={{ padding: '10px', cursor: 'pointer', borderRadius: '8px' }}>Clientes</p>
            <p style={{ padding: '10px', cursor: 'pointer', borderRadius: '8px' }}>Empleados</p>
            {usuario.rol === 'administrador' && (
              <p style={{ padding: '10px', cursor: 'pointer', borderRadius: '8px' }}>Administración</p>
            )}
          </nav>
  
          <div style={{ borderTop: '1px solid #333', paddingTop: '16px' }}>
            <p style={{ fontSize: '13px', color: '#aaa' }}>{usuario.nombre} {usuario.apellido}</p>
            <p style={{ fontSize: '11px', color: '#534AB7', marginBottom: '12px' }}>{usuario.rol}</p>
            <button onClick={onLogout} style={{
              width: '100%',
              padding: '8px',
              backgroundColor: 'transparent',
              color: '#aaa',
              border: '1px solid #333',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>Cerrar sesión</button>
          </div>
        </div>
  
        {/* Contenido principal */}
        <div style={{ flex: 1, backgroundColor: '#f0f2f5', padding: '32px' }}>
          <h1 style={{ color: '#1a1a2e', marginBottom: '8px' }}>Bienvenido, {usuario.nombre}</h1>
          <p style={{ color: '#888', marginBottom: '32px' }}>Panel de control del CRM</p>
  
          {/* Tarjetas de métricas */}
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
        </div>
      </div>
    )
  }
  
  export default Dashboard