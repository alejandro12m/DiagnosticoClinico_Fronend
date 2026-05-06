import { useState } from 'react'
import { CrudTabs } from '../components/CrudTabs'
import { JsonViewer } from '../components/JsonViewer'
import { MessageBar } from '../components/MessageBar'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { useMountFetch } from '../hooks/useMountFetch'
import * as api from '../services/api'

export function ValidacionResultadoesPage() {
  const list = useMountFetch(() => api.listValidaciones())

  const [createFields, setCreateFields] = useState({
    code: '',
    codigoResultado: '',
    medicoCodigo: '',
    fechaValidacion: '',
    observacion: '',
  })
  const createAct = useAsyncAction((p) => api.createValidacion(p))

  const [editId, setEditId] = useState('')
  const [editJson, setEditJson] = useState(`{
  "validacionResultadoId": 1,
  "validacionResultadoCodigo": "",
  "resultadoId": 1,
  "medicoCodigo": "",
  "fechaValidacion": "",
  "observaciones": "",
  "estado": "Activo",
  "resultado": null
}`)
  const editAct = useAsyncAction((id, body) => api.updateValidacion(id, body))

  const [delId, setDelId] = useState('')
  const delAct = useAsyncAction((id) => api.deleteValidacion(id))

  const rows = () => list.data?.validaciones ?? []

  async function mergeFromListCode() {
    const code = window.prompt('ValidacionResultadoCodigo para cargar GET')
    if (!code?.trim()) return
    try {
      const res = await api.getValidacion(code.trim())
      const dto = res?.validacion
      setEditJson(
        JSON.stringify(
          {
            validacionResultadoId: 0,
            validacionResultadoCodigo: dto.validacionResultadoCodigo,
            resultadoId: 0,
            medicoCodigo: dto.medicoCodigo,
            fechaValidacion: dto.fechaValidacion,
            observaciones: dto.observaciones,
            estado: 'Activo',
            resultado: null,
          },
          null,
          2,
        ),
      )
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <CrudTabs
      title="Validación de resultado"
      subtitle="DELETE elimina físicamente el registro. PUT usa validacionResultadoId en ruta."
      tabs={{
        list: (
          <div>
            <MessageBar loading={list.loading} error={list.error} success={list.success} />
            <p>
              <button type="button" className="btn secondary" onClick={() => list.reload()}>
                Recargar
              </button>{' '}
              <button type="button" className="btn secondary" onClick={mergeFromListCode}>
                Rellenar JSON desde código
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
                Código validación
                <input
                  value={createFields.code}
                  onChange={(e) => setCreateFields({ ...createFields, code: e.target.value })}
                  required
                />
              </label>
              <label>
                Código resultado
                <input
                  value={createFields.codigoResultado}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, codigoResultado: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Médico código
                <input
                  value={createFields.medicoCodigo}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, medicoCodigo: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Fecha validación
                <input
                  type="date"
                  value={createFields.fechaValidacion}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, fechaValidacion: e.target.value })
                  }
                  required
                />
              </label>
              <label className="span-2">
                Observación (query observacion)
                <input
                  value={createFields.observacion}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, observacion: e.target.value })
                  }
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn" disabled={createAct.loading}>
                  Crear validación
                </button>
              </div>
            </form>
          </div>
        ),
        edit: (
          <div>
            <MessageBar loading={editAct.loading} error={editAct.error} success={editAct.success} />
            <div className="form-grid">
              <label>
                ValidacionResultadoId
                <input
                  type="number"
                  value={editId}
                  onChange={(e) => setEditId(e.target.value)}
                  required
                />
              </label>
              <label className="span-2">
                JSON ValidacionResultado
                <textarea className="code" rows={11} value={editJson} onChange={(e) => setEditJson(e.target.value)} />
              </label>
              <div className="span-2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => editAct.run(Number(editId), JSON.parse(editJson))}
                >
                  PUT
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
                ValidacionResultadoId
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
