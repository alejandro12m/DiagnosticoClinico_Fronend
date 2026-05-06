import { useState } from 'react'
import { CrudTabs } from '../components/CrudTabs'
import { JsonViewer } from '../components/JsonViewer'
import { MessageBar } from '../components/MessageBar'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { useMountFetch } from '../hooks/useMountFetch'
import * as api from '../services/api'

export function MuestrasPage() {
  const list = useMountFetch(() => api.listMuestras())

  const [createFields, setCreateFields] = useState({
    code: '',
    tipoMuestra: '',
    fechaRecoleccion: '',
    volumen: '',
    condicion: 'Buena',
  })
  const createAct = useAsyncAction((p) => api.createMuestra(p))

  const [editId, setEditId] = useState('')
  const [editBodyText, setEditBodyText] = useState(`{
  "muestraId": 1,
  "muestraCodigo": "",
  "tipoMuestra": "",
  "fechaRecoleccion": "",
  "volumen": 0,
  "condicion": "",
  "ordenExamen": null,
  "resultados": null
}`)
  const editSave = useAsyncAction((id, payload) => api.updateMuestra(id, payload))

  const [delId, setDelId] = useState('')
  const delAct = useAsyncAction((id) => api.deleteMuestra(id))

  const rows = () => list.data?.muestras ?? []

  async function cargarPorCodigo() {
    const code = window.prompt('Código de muestra')
    if (!code?.trim()) return
    try {
      const res = await api.getMuestra(code.trim())
      const dto = res?.muestra
      alert(
        dto
          ? 'El endpoint devuelve DTO sin ID. Indica muestraId numérico a mano o consulta Swagger/BD.'
          : 'Sin datos',
      )
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <CrudTabs
      title="Muestra"
      subtitle="POST usa query param Codicion (sic en backend). PUT/DELETE usan muestraId entero."
      tabs={{
        list: (
          <div>
            <MessageBar loading={list.loading} error={list.error} success={list.success} />
            <p>
              <button type="button" className="btn secondary" onClick={() => list.reload()}>
                Recargar
              </button>{' '}
              <button type="button" className="btn secondary" onClick={cargarPorCodigo}>
                GET por código (alerta)
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
                createAct.run({
                  code: createFields.code,
                  tipoMuestra: createFields.tipoMuestra,
                  fechaRecoleccion: createFields.fechaRecoleccion,
                  volumen: Number(createFields.volumen),
                  condicion: createFields.condicion,
                })
              }}
            >
              <label>
                Código
                <input
                  value={createFields.code}
                  onChange={(e) => setCreateFields({ ...createFields, code: e.target.value })}
                  required
                />
              </label>
              <label>
                Tipo muestra
                <input
                  value={createFields.tipoMuestra}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, tipoMuestra: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Fecha recolección (yyyy-MM-dd)
                <input
                  type="date"
                  value={createFields.fechaRecoleccion}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, fechaRecoleccion: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Volumen
                <input
                  type="number"
                  step="any"
                  value={createFields.volumen}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, volumen: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Condición (query Codicion)
                <input
                  value={createFields.condicion}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, condicion: e.target.value })
                  }
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn" disabled={createAct.loading}>
                  Crear muestra
                </button>
              </div>
            </form>
          </div>
        ),
        edit: (
          <div>
            <MessageBar loading={editSave.loading} error={editSave.error} success={editSave.success} />
            <div className="form-grid">
              <label>
                MuestraId
                <input
                  type="number"
                  value={editId}
                  onChange={(e) => setEditId(e.target.value)}
                  required
                />
              </label>
              <label className="span-2">
                JSON entidad Muestra
                <textarea
                  rows={12}
                  className="code"
                  value={editBodyText}
                  onChange={(e) => setEditBodyText(e.target.value)}
                />
              </label>
              <div className="span-2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => editSave.run(Number(editId), JSON.parse(editBodyText))}
                >
                  Guardar PUT
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
                MuestraId a borrar
                <input
                  type="number"
                  value={delId}
                  onChange={(e) => setDelId(e.target.value)}
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn danger" disabled={delAct.loading}>
                  DELETE físico
                </button>
              </div>
            </form>
          </div>
        ),
      }}
    />
  )
}
