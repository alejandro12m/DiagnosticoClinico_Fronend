import { useState } from 'react'
import { CrudTabs } from '../components/CrudTabs'
import { JsonViewer } from '../components/JsonViewer'
import { MessageBar } from '../components/MessageBar'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { useMountFetch } from '../hooks/useMountFetch'
import * as api from '../services/api'

export function InformePage() {
  const list = useMountFetch(() => api.listInformes())

  const [createFields, setCreateFields] = useState({
    code: '',
    ordenCode: '',
    fechaEmision: '',
    observacionesGenerales: '',
  })
  const createAct = useAsyncAction((p) => api.createInforme(p))

  const [putFields, setPutFields] = useState({
    code: '',
    ordenCode: '-',
    fechaEmision: '',
    observacionesGenerales: '',
  })
  const putAct = useAsyncAction(() =>
    api.updateInforme(
      putFields.code.trim(),
      putFields.ordenCode.trim(),
      putFields.fechaEmision,
      putFields.observacionesGenerales,
    ),
  )

  const [delCode, setDelCode] = useState('')
  const delAct = useAsyncAction(() => api.deleteInforme(delCode.trim()))

  const rows = () => list.data?.informeDTOs ?? []

  return (
    <CrudTabs
      title="Informe"
      subtitle="PUT /api/Informe/actualizar/{code}/{ordenCode}/{fecha}/{observaciones} — evita '/' en textos o codifica."
      tabs={{
        list: (
          <div>
            <MessageBar loading={list.loading} error={list.error} success={list.success} />
            <p>
              <button type="button" className="btn secondary" onClick={() => list.reload()}>
                Recargar
              </button>
            </p>
            <JsonViewer value={rows()} />
            <details className="raw">
              <summary>Respuesta completa</summary>
              <JsonViewer value={list.data} />
            </details>
          </div>
        ),
        create: (
          <div>
            <MessageBar
              loading={createAct.loading}
              error={createAct.error}
              success={createAct.success}
            />
            <form
              className="form-grid"
              onSubmit={(e) => {
                e.preventDefault()
                createAct.run(createFields)
              }}
            >
              <label>
                Código informe
                <input
                  value={createFields.code}
                  onChange={(e) => setCreateFields({ ...createFields, code: e.target.value })}
                  required
                />
              </label>
              <label>
                Código orden laboratorio
                <input
                  value={createFields.ordenCode}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, ordenCode: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Fecha emisión
                <input
                  type="date"
                  value={createFields.fechaEmision}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, fechaEmision: e.target.value })
                  }
                  required
                />
              </label>
              <label className="span-2">
                Observaciones generales
                <input
                  value={createFields.observacionesGenerales}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, observacionesGenerales: e.target.value })
                  }
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn" disabled={createAct.loading}>
                  Crear informe
                </button>
              </div>
            </form>
          </div>
        ),
        edit: (
          <div>
            <MessageBar loading={putAct.loading} error={putAct.error} success={putAct.success} />
            <form
              className="form-grid"
              onSubmit={(e) => {
                e.preventDefault()
                putAct.run()
              }}
            >
              <label>
                Informe código
                <input
                  value={putFields.code}
                  onChange={(e) => setPutFields({ ...putFields, code: e.target.value })}
                  required
                />
              </label>
              <label>
                Orden código (segmento URL; el backend no lo usa en el método)
                <input
                  value={putFields.ordenCode}
                  onChange={(e) => setPutFields({ ...putFields, ordenCode: e.target.value })}
                />
              </label>
              <label>
                Fecha emisión
                <input
                  type="date"
                  value={putFields.fechaEmision}
                  onChange={(e) =>
                    setPutFields({ ...putFields, fechaEmision: e.target.value })
                  }
                  required
                />
              </label>
              <label className="span-2">
                Observaciones
                <input
                  value={putFields.observacionesGenerales}
                  onChange={(e) =>
                    setPutFields({ ...putFields, observacionesGenerales: e.target.value })
                  }
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn" disabled={putAct.loading}>
                  Actualizar (PUT)
                </button>
              </div>
            </form>
            {putAct.data ? <JsonViewer value={putAct.data} /> : null}
          </div>
        ),
        remove: (
          <div>
            <MessageBar loading={delAct.loading} error={delAct.error} success={delAct.success} />
            <form
              className="form-grid"
              onSubmit={(e) => {
                e.preventDefault()
                delAct.run()
              }}
            >
              <label>
                Código informe
                <input
                  value={delCode}
                  onChange={(e) => setDelCode(e.target.value)}
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn danger" disabled={delAct.loading}>
                  Eliminar (inactivar)
                </button>
              </div>
            </form>
            {delAct.data ? <JsonViewer value={delAct.data} /> : null}
          </div>
        ),
      }}
    />
  )
}
