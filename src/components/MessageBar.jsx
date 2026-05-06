export function MessageBar({ loading, error, success }) {
  if (loading) {
    return <div className="banner banner-info">Cargando…</div>
  }
  if (error) {
    return <div className="banner banner-error">{error}</div>
  }
  if (success) {
    return <div className="banner banner-success">{success}</div>
  }
  return null
}
