import { useState } from 'react'
import { CrudTabs } from '../components/CrudTabs'
import { JsonViewer } from '../components/JsonViewer'
import { MessageBar } from '../components/MessageBar'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { useMountFetch } from '../hooks/useMountFetch'
import * as api from '../services/api'

export function ResultadoesPage() {
  const list = useMountFetch(() => api.listResultados())

  const [createFields, setCreateFields] = useState({
    code: '',
    parametroExamenCodigo: '',
    muestraCodigo: '',
    valor: '',
    equipoCodigo: '',
    fechaResultado: '',
  })
  const createAct = useAsyncAction((p) => api.createResultado(p))

  const [editCode, setEditCode] = useState('')
  const [editJson, setEditJson] = useState(`{
  "resultadoId": 1,
  "resultadoCodigo": "",
  "muestraId": 1,
  "parametroExamenId": 1,
  "valor": 0,
  "equipoCodigo": "",
  "fechaResultado": "",
  "estado": "Activo",
  "parametroExamen": null,
  "muestra": null,
  "validaciones": null
}`)
  const editLoad = useAsyncAction(() => api.getResultado(editCode.trim()))
  const editSave = useAsyncAction((payload) => api.updateResultado(editCode.trim(), payload))

  const [delCode, setDelCode] = useState('')
  const delAct = useAsyncAction(() => api.deleteResultado(delCode.trim()))

  const rows = () => list.data?.resultados ?? []

  async function plantillaDesdeGet() {
    const res = await editLoad.run()
    const dto = res?.resultado
    if (!dto) return
    setEditJson(
      JSON.stringify(
        {
          resultadoId: 0,
          resultadoCodigo: dto.resultadoCodigo,
          muestraId: 0,
          parametroExamenId: 0,
          valor: dto.valor,
          equipoCodigo: dto.equipoCodigo,
          fechaResultado: dto.fechaResultado,
          estado: 'Activo',
          parametroExamen: null,
          muestra: null,
          validaciones: null,
        },
        null,
        2,
      ),
    )
  }

  return (
    <CrudTabs
      title="Resultado"
      subtitle="Controlador Resultadoes. DELETE hace soft-delete (Estado Inactivo). POST usa query string."
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
                createAct.run({
                  code: createFields.code,
                  parametroExamenCodigo: createFields.parametroExamenCodigo,
                  muestraCodigo: createFields.muestraCodigo,
                  valor: createFields.valor,
                  equipoCodigo: createFields.equipoCodigo,
                  fechaResultado: createFields.fechaResultado,
                })
              }}
            >
              <label>
                Código resultado
                <input
                  value={createFields.code}
                  onChange={(e) => setCreateFields({ ...createFields, code: e.target.value })}
                  required
                />
              </label>
              <label>
                Parámetro examen código
                <input
                  value={createFields.parametroExamenCodigo}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, parametroExamenCodigo: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Muestra código
                <input
                  value={createFields.muestraCodigo}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, muestraCodigo: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Valor (decimal)
                <input
                  type="number"
                  step="any"
                  value={createFields.valor}
                  onChange={(e) => setCreateFields({ ...createFields, valor: e.target.value })}
                  required
                />
              </label>
              <label>
                Equipo código
                <input
                  value={createFields.equipoCodigo}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, equipoCodigo: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Fecha resultado
                <input
                  type="date"
                  value={createFields.fechaResultado}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, fechaResultado: e.target.value })
                  }
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn" disabled={createAct.loading}>
                  Crear resultado
                </button>
              </div>
            </form>
          </div>
        ),
        edit: (
          <div>
            <MessageBar
              loading={editLoad.loading || editSave.loading}
              error={editLoad.error || editSave.error}
              success={editSave.success}
            />
            <div className="form-grid">
              <label>
                Código resultado (ruta PUT)
                <input value={editCode} onChange={(e) => setEditCode(e.target.value)} />
              </label>
              <div className="actions-row">
                <button type="button" className="btn secondary" onClick={() => plantillaDesdeGet()}>
                  Cargar plantilla desde GET
                </button>
              </div>
              <label className="span-2">
                JSON Resultado (completa IDs en BD)
                <textarea className="code" rows={14} value={editJson} onChange={(e) => setEditJson(e.target.value)} />
              </label>
              <div className="span-2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => editSave.run(JSON.parse(editJson))}
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
                delAct.run()
              }}
            >
              <label>
                Código resultado
                <input
                  value={delCode}
                  onChange={(e) => setDelCode(e.target.value)}
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn danger" disabled={delAct.loading}>
                  Soft-delete
                </button>
              </div>
            </form>
          </div>
        ),
      }}
    />
  )
}
