import { useState } from 'react'
import { CrudTabs } from '../components/CrudTabs'
import { JsonViewer } from '../components/JsonViewer'
import { MessageBar } from '../components/MessageBar'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { useMountFetch } from '../hooks/useMountFetch'
import * as api from '../services/api'

export function OrdenExamenPage() {
  const list = useMountFetch(() => api.listOrdenExamen())

  const [createFields, setCreateFields] = useState({
    ordenCodigo: '',
    examenCodigo: '',
    muestraCodigo: '',
    areaLaboratorio: '',
  })
  const createAct = useAsyncAction((p) => api.createOrdenExamen(p))

  const pend = useMountFetch(() => api.ordenExamenPendientes())

  const [editId, setEditId] = useState('')
  const [editJson, setEditJson] = useState(`{
  "ordenExamenId": 1,
  "ordenId": 1,
  "examenId": 1,
  "muestraId": 1,
  "areaLaboratorio": "Bioquímica",
  "estadoOrdenExamen": "Pendiente",
  "estado": "Activo",
  "ordenLaboratorio": null,
  "examen": null,
  "muestra": null
}`)
  const editAct = useAsyncAction((id, body) => api.updateOrdenExamen(id, body))

  const [delId, setDelId] = useState('')
  const delAct = useAsyncAction((id) => api.deleteOrdenExamen(id))

  const listaRows = () => list.data?.data ?? []

  return (
    <CrudTabs
      title="Orden de examen"
      subtitle={
        <>
          Ejemplo público (Render): POST{' '}
          <code>/api/OrdenExamen?OrdenCodigo=&ExamenCodigo=&MuestraCodigo=&AreaLaboratorio=</code>.{' '}
          Los GET no devuelven <code>ordenExamenId</code>; necesitas el ID numérico para PUT/DELETE
          (Swagger o BD).
        </>
      }
      tabs={{
        list: (
          <div>
            <MessageBar loading={list.loading} error={list.error} success={list.success} />
            <p>
              <button type="button" className="btn secondary" onClick={() => list.reload()}>
                Recargar activas
              </button>{' '}
              <button type="button" className="btn secondary" onClick={() => pend.reload()}>
                Ver pendientes
              </button>
            </p>
            <h3>Órdenes examen activas</h3>
            <JsonViewer value={listaRows()} />
            <details className="raw">
              <summary>Respuesta GET lista completa</summary>
              <JsonViewer value={list.data} />
            </details>
            <h3>Pendientes (endpoint /Pendientes)</h3>
            <MessageBar
              loading={pend.loading}
              error={pend.error}
              success={pend.success ? 'Cargado' : null}
            />
            <JsonViewer value={pend.data?.ordenExamenes ?? pend.data} />
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
                OrdenCodigo (laboratorio)
                <input
                  value={createFields.ordenCodigo}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, ordenCodigo: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                ExamenCodigo
                <input
                  value={createFields.examenCodigo}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, examenCodigo: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                MuestraCodigo
                <input
                  value={createFields.muestraCodigo}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, muestraCodigo: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                AreaLaboratorio
                <input
                  value={createFields.areaLaboratorio}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, areaLaboratorio: e.target.value })
                  }
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn" disabled={createAct.loading}>
                  Crear orden de examen
                </button>
              </div>
            </form>
            {createAct.data ? <JsonViewer value={createAct.data} /> : null}
          </div>
        ),
        edit: (
          <div>
            <MessageBar loading={editAct.loading} error={editAct.error} success={editAct.success} />
            <div className="form-grid">
              <label>
                OrdenExamenId
                <input
                  type="number"
                  value={editId}
                  onChange={(e) => setEditId(e.target.value)}
                  required
                />
              </label>
              <label className="span-2">
                JSON OrdenExamen
                <textarea className="code" rows={14} value={editJson} onChange={(e) => setEditJson(e.target.value)} />
              </label>
              <div className="span-2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => editAct.run(Number(editId), JSON.parse(editJson))}
                >
                  PUT /api/OrdenExamen/{'{id}'}
                </button>
              </div>
            </div>
          </div>
        ),
        remove: (
          <div>
            <MessageBar loading={delAct.loading} error={delAct.error} success={delAct.success} />
            <form
              className="form-grid"
              onSubmit={(e) => {
                e.preventDefault()
                delAct.run(Number(delId))
              }}
            >
              <label>
                OrdenExamenId
                <input
                  type="number"
                  value={delId}
                  onChange={(e) => setDelId(e.target.value)}
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn danger" disabled={delAct.loading}>
                  DELETE
                </button>
              </div>
            </form>
          </div>
        ),
      }}
    />
  )
}
