import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../services/api'

function asArray(v) {
  return Array.isArray(v) ? v : []
}

function keysFromRows(rows, maxKeys = 8) {
  const r0 = rows && rows.length ? rows[0] : null
  if (!r0 || typeof r0 !== 'object') return []
  return Object.keys(r0).slice(0, maxKeys)
}

function CompactTable({ rows, title, emptyText = 'Sin datos.' }) {
  const data = asArray(rows)
  const cols = useMemo(() => keysFromRows(data), [data])

  return (
    <div className="crud-panel" style={{ marginTop: '1rem' }}>
      <div className="crud-header">
        <h1 style={{ fontSize: '1.05rem' }}>{title}</h1>
      </div>
      <div className="crud-body">
        {data.length === 0 ? (
          <div className="muted">{emptyText}</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  {cols.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.slice(0, 30).map((row, idx) => (
                  <tr key={idx}>
                    {cols.map((c) => (
                      <td key={c} className="code">
                        {row?.[c] == null ? '' : String(row[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [pendientes, setPendientes] = useState(null)
  const [pendientesTotal, setPendientesTotal] = useState(null)
  const [tiempoPorArea, setTiempoPorArea] = useState([])
  const [examenesSinMuestra, setExamenesSinMuestra] = useState([])
  const [topExamenes, setTopExamenes] = useState([])
  const [muestrasEstado, setMuestrasEstado] = useState([])

  useEffect(() => {
    let alive = true
    setLoading(true)
    setError('')

    Promise.all([
      api.ordenExamenPendientes(),
      api.pendientesTodasLasOrdenes(),
      api.tiempoPorArea(),
      api.examenesSinMuestra(),
      api.examenesMasSolicitados(),
      api.muestrasPorEstado(),
    ])
      .then(([p, total, tArea, sinMuestra, top, muestras]) => {
        if (!alive) return
        setPendientes(p)
        setPendientesTotal(total)
        setTiempoPorArea(asArray(tArea))
        setExamenesSinMuestra(asArray(sinMuestra))
        setTopExamenes(asArray(top))
        setMuestrasEstado(asArray(muestras))
      })
      .catch((e) => {
        if (!alive) return
        setError(e?.message ? String(e.message) : 'Error cargando dashboard.')
      })
      .finally(() => {
        if (!alive) return
        setLoading(false)
      })

    return () => {
      alive = false
    }
  }, [])

  const pendientesList = asArray(pendientes?.ordenExamenes)
  const pendientesCount = pendientesList.length
  const pendientesTotalValue =
    pendientesTotal && typeof pendientesTotal === 'object' && pendientesTotal.pendientes != null
      ? Number(pendientesTotal.pendientes)
      : null
  const pendientesMsg =
    pendientes && typeof pendientes === 'object' && pendientes.mensaje != null
      ? String(pendientes.mensaje)
      : ''

  return (
    <div>
      <h1>Dashboard laboratorio</h1>
      <p className="muted">
        Vista rápida para operación diaria: pendientes, cuellos de botella y métricas básicas.
      </p>

      {loading ? (
        <div className="banner banner-info">Cargando métricas…</div>
      ) : error ? (
        <div className="banner banner-error">{error}</div>
      ) : null}

      <div className="cards">
        <div className="card" style={{ cursor: 'default' }}>
          <h2>Pendientes</h2>
          <div className="small muted">{pendientesMsg || 'Órdenes de examen pendientes.'}</div>
          <div style={{ fontSize: '1.6rem', marginTop: '0.35rem', fontWeight: 700 }}>
            {pendientesTotalValue ?? pendientesCount}
          </div>
          <div style={{ marginTop: '0.65rem' }}>
            <Link className="btn secondary" to="/orden-examen">
              Ir a Orden examen
            </Link>
          </div>
        </div>

        <div className="card" style={{ cursor: 'default' }}>
          <h2>Muestras por estado</h2>
          <div className="small muted">Distribución (Activo/Listo/…)</div>
          <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.35rem' }}>
            {muestrasEstado.length === 0 ? (
              <div className="muted small">Sin datos.</div>
            ) : (
              muestrasEstado.slice(0, 6).map((x, idx) => (
                <div key={idx} className="small">
                  <span className="code">{x?.estadoOrden ?? '—'}</span> →{' '}
                  <strong>{x?.totalMuestras ?? 0}</strong>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card" style={{ cursor: 'default' }}>
          <h2>Top exámenes</h2>
          <div className="small muted">Más solicitados</div>
          <div style={{ marginTop: '0.5rem', display: 'grid', gap: '0.35rem' }}>
            {topExamenes.length === 0 ? (
              <div className="muted small">Sin datos.</div>
            ) : (
              topExamenes.slice(0, 6).map((x, idx) => (
                <div key={idx} className="small">
                  <span>{x?.examen ?? '—'}</span> · <strong>{x?.total ?? 0}</strong>
                </div>
              ))
            )}
          </div>
          <div style={{ marginTop: '0.65rem' }}>
            <Link className="btn secondary" to="/examenes">
              Ver catálogo de exámenes
            </Link>
          </div>
        </div>
      </div>

      <CompactTable
        title="Tiempo por área (indicador operativo)"
        rows={tiempoPorArea}
        emptyText="Sin datos de tiempo por área."
      />

      <CompactTable
        title="Exámenes sin muestra (alerta operativa)"
        rows={examenesSinMuestra}
        emptyText="No hay exámenes sin muestra."
      />

      {pendientesList.length > 0 ? (
        <CompactTable
          title="Listado de pendientes (primeros 30)"
          rows={pendientesList}
          emptyText="Sin pendientes."
        />
      ) : null}
    </div>
  )
}

