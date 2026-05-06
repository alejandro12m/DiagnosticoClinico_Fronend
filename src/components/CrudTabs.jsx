import { useState } from 'react'

const KEYS = ['list', 'create', 'edit', 'remove']

export function CrudTabs({ title, subtitle, tabs }) {
  const [active, setActive] = useState('list')
  const labels = {
    list: 'Lista (GET)',
    create: 'Crear (POST)',
    edit: 'Editar (PUT)',
    remove: 'Eliminar (DELETE)',
  }

  return (
    <div className="crud-panel">
      <header className="crud-header">
        <h1>{title}</h1>
        {subtitle ? <div className="muted subtitle-block">{subtitle}</div> : null}
        <nav className="tab-nav">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              className={`tab-btn ${active === k ? 'active' : ''}`}
              onClick={() => setActive(k)}
            >
              {labels[k]}
            </button>
          ))}
        </nav>
      </header>
      <div className="crud-body">{tabs[active]}</div>
    </div>
  )
}
