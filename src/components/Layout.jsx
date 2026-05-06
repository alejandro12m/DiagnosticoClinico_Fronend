import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/inicio', label: 'Inicio (CRUD)' },
  { to: '/examenes', label: 'Examen' },
  { to: '/muestras', label: 'Muestra' },
  { to: '/orden-laboratorio', label: 'Orden laboratorio' },
  { to: '/orden-examen', label: 'Orden examen' },
  { to: '/resultados', label: 'Resultado' },
  { to: '/parametro-examen', label: 'Parámetro examen' },
  { to: '/validacion-resultados', label: 'Validación resultado' },
  { to: '/informe', label: 'Informe' },
  { to: '/documento-solicitado/subir-archivo', label: 'Subir documento' },
]

export function Layout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <strong>Laboratorio</strong>
          <span className="muted small">Diagnóstico médico</span>
        </div>
        <nav className="side-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              end={l.to === '/'}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="main-area">
        <Outlet />
      </main>
    </div>
  )
}
