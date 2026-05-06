import { Link } from 'react-router-dom'

const cards = [
  { to: '/examenes', title: 'Examen', note: 'CRUD + estadísticas disponibles en API' },
  { to: '/muestras', title: 'Muestra', note: 'Códigos, tipo, volumen' },
  { to: '/orden-laboratorio', title: 'Orden de laboratorio', note: 'Órdenes principales por paciente' },
  {
    to: '/orden-examen',
    title: 'Orden de examen',
    note: 'Vincula orden + examen + muestra por query (ej. Render)',
  },
  { to: '/resultados', title: 'Resultado', note: 'Valores cuantificados por parámetro' },
  { to: '/parametro-examen', title: 'Parámetro de examen', note: 'Rangos de referencia' },
  { to: '/validacion-resultados', title: 'Validación de resultado', note: 'Médico validador' },
  { to: '/informe', title: 'Informe', note: 'Emisión y observaciones' },
  {
    to: '/documento-solicitado/subir-archivo',
    title: 'Subir documento solicitado',
    note: 'POST multipart (archivo + metadatos) a Gestión Documental',
  },
]

export function HomePage() {
  return (
    <div>
      <h1>Panel de administración</h1>
      <p className="muted">
        Cliente React para la API ASP.NET Core. Las pestañas de cada recurso cubren lista, alta,
        edición y baja conforme tus controladores en <code>DiagnosticoMedico</code>.
      </p>
      <div className="cards">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="card">
            <h2>{c.title}</h2>
            <p className="small muted">{c.note}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
