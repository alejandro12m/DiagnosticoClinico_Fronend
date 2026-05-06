import { useMemo, useState } from 'react'
import { JsonViewer } from '../components/JsonViewer'
import { MessageBar } from '../components/MessageBar'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { subirArchivoDocumentoSolicitado } from '../services/gestionDocumental'

export function SubirDocumentoSolicitadoPage() {
  const [archivo, setArchivo] = useState(null)
  const [fields, setFields] = useState({
    NombreArchivo: '',
    DescripcionContenido: '',
    NombreMedico: '',
    NombreDepartamento: '',
    CodigoPaciente: '',
    CodigoSolicitud: '',
    CodigoTipoDoc: '',
  })

  const effectiveNombreArchivo = useMemo(() => {
    const typed = fields.NombreArchivo.trim()
    if (typed) return typed
    return archivo?.name || ''
  }, [archivo, fields.NombreArchivo])

  const uploadAct = useAsyncAction(async () => {
    if (!(archivo instanceof File)) throw new Error('Selecciona un archivo en "Archivo".')
    return subirArchivoDocumentoSolicitado({
      Archivo: archivo,
      ...fields,
      NombreArchivo: effectiveNombreArchivo,
    })
  })

  return (
    <div className="crud-panel">
      <header className="crud-header">
        <h1>Subir documento solicitado</h1>
        <div className="muted subtitle-block">
          POST a <code>/api/DocumentoSolicitadoes/SubirArchivo</code> (Gestión Documental).
        </div>
      </header>

      <div className="crud-body">
        <MessageBar loading={uploadAct.loading} error={uploadAct.error} success={uploadAct.success} />

        <form
          className="form-grid"
          onSubmit={(e) => {
            e.preventDefault()
            uploadAct.run()
          }}
        >
          <label className="span-2">
            Archivo
            <input
              type="file"
              onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
              required
            />
          </label>

          <label className="span-2">
            NombreArchivo (opcional; si lo dejas vacío se usa el nombre real del archivo)
            <input
              value={fields.NombreArchivo}
              onChange={(e) => setFields({ ...fields, NombreArchivo: e.target.value })}
              placeholder={archivo?.name || 'Ej: informe.pdf'}
            />
          </label>

          <label className="span-2">
            DescripcionContenido
            <textarea
              rows={3}
              value={fields.DescripcionContenido}
              onChange={(e) => setFields({ ...fields, DescripcionContenido: e.target.value })}
              placeholder="Ej: Resultados de laboratorio…"
            />
          </label>

          <label>
            NombreMedico
            <input
              value={fields.NombreMedico}
              onChange={(e) => setFields({ ...fields, NombreMedico: e.target.value })}
            />
          </label>

          <label>
            NombreDepartamento
            <input
              value={fields.NombreDepartamento}
              onChange={(e) => setFields({ ...fields, NombreDepartamento: e.target.value })}
            />
          </label>

          <label>
            CodigoPaciente
            <input
              value={fields.CodigoPaciente}
              onChange={(e) => setFields({ ...fields, CodigoPaciente: e.target.value })}
            />
          </label>

          <label>
            CodigoSolicitud
            <input
              value={fields.CodigoSolicitud}
              onChange={(e) => setFields({ ...fields, CodigoSolicitud: e.target.value })}
            />
          </label>

          <label>
            CodigoTipoDoc
            <input
              value={fields.CodigoTipoDoc}
              onChange={(e) => setFields({ ...fields, CodigoTipoDoc: e.target.value })}
            />
          </label>

          <div className="span-2">
            <button type="submit" className="btn" disabled={uploadAct.loading}>
              Subir archivo
            </button>
            <button
              type="button"
              className="btn secondary"
              style={{ marginLeft: '0.5rem' }}
              onClick={() => {
                setArchivo(null)
                setFields({
                  NombreArchivo: '',
                  DescripcionContenido: '',
                  NombreMedico: '',
                  NombreDepartamento: '',
                  CodigoPaciente: '',
                  CodigoSolicitud: '',
                  CodigoTipoDoc: '',
                })
                uploadAct.reset()
              }}
              disabled={uploadAct.loading}
            >
              Limpiar
            </button>
          </div>
        </form>

        {uploadAct.data ? (
          <div>
            <h3>Respuesta</h3>
            <JsonViewer value={uploadAct.data} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

