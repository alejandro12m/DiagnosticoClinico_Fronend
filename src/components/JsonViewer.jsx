/** Muestra array u objeto como tabla simple o JSON indentado */
export function JsonViewer({ value }) {
  if (value === null || value === undefined) {
    return <p className="muted">Sin datos</p>
  }
  const rows = Array.isArray(value) ? value : null
  if (rows?.length === 0) {
    return <p className="muted">Lista vacía</p>
  }
  if (rows?.length && typeof rows[0] === 'object' && rows[0] !== null) {
    const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))]
    return (
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {keys.map((k) => (
                <th key={k}>{k}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {keys.map((k) => (
                  <td key={k}>{formatCell(row[k])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  return <pre className="json-pre">{JSON.stringify(value, null, 2)}</pre>
}

function formatCell(v) {
  if (v === null || v === undefined) return ''
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
