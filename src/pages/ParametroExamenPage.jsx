import { useState } from 'react'
import { CrudTabs } from '../components/CrudTabs'
import { JsonViewer } from '../components/JsonViewer'
import { MessageBar } from '../components/MessageBar'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { useMountFetch } from '../hooks/useMountFetch'
import * as api from '../services/api'

export function ParametroExamenPage() {
  const list = useMountFetch(() => api.listParametroExamen())

  const [createFields, setCreateFields] = useState({
    code: '',
    codeExamen: '',
    nombre: '',
    unidad: '',
    valorMin: '',
    valorMax: '',
  })
  const createAct = useAsyncAction((p) => api.createParametroExamen(p))

  const [editCode, setEditCode] = useState('')
  const [editJson, setEditJson] = useState(`{
  "parametroExamenId": 1,
  "parametroExamenCodigo": "",
  "examenId": 1,
  "nombre": "",
  "unidad": "",
  "valorMin": 0,
  "valorMax": 0,
  "estado": "Activo",
  "resultados": null,
  "examen": null
}`)
  const editLoad = useAsyncAction(() => api.getParametroExamen(editCode.trim()))
  const editSave = useAsyncAction((payload) =>
    api.updateParametroExamen(editCode.trim(), payload),
  )

  const [delCode, setDelCode] = useState('')
  const delAct = useAsyncAction(() => api.deleteParametroExamen(delCode.trim()))

  const rows = () => list.data?.parametros ?? []

  async function plantilla() {
    const res = await editLoad.run()
    const dto = res?.parametro
    if (!dto) return
    setEditJson(
      JSON.stringify(
        {
          parametroExamenId: 0,
          parametroExamenCodigo: dto.parametroCodigo ?? dto.ParametroCodigo,
          examenId: 0,
          nombre: dto.nombre,
          unidad: dto.unidad,
          valorMin: dto.valorMin,
          valorMax: dto.valorMax,
          estado: 'Activo',
          resultados: null,
          examen: null,
        },
        null,
        2,
      ),
    )
  }

  return (
    <CrudTabs
      title="Parámetro de examen"
      subtitle="Referencias min/max por examen. DELETE = estado Inactivo."
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
                  codeExamen: createFields.codeExamen,
                  nombre: createFields.nombre,
                  unidad: createFields.unidad,
                  valorMin: Number(createFields.valorMin),
                  valorMax: Number(createFields.valorMax),
                })
              }}
            >
              <label>
                Código parámetro
                <input
                  value={createFields.code}
                  onChange={(e) => setCreateFields({ ...createFields, code: e.target.value })}
                  required
                />
              </label>
              <label>
                Código examen
                <input
                  value={createFields.codeExamen}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, codeExamen: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Nombre
                <input
                  value={createFields.nombre}
                  onChange={(e) => setCreateFields({ ...createFields, nombre: e.target.value })}
                  required
                />
              </label>
              <label>
                Unidad
                <input
                  value={createFields.unidad}
                  onChange={(e) => setCreateFields({ ...createFields, unidad: e.target.value })}
                  required
                />
              </label>
              <label>
                Valor mínimo
                <input
                  type="number"
                  step="any"
                  value={createFields.valorMin}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, valorMin: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Valor máximo
                <input
                  type="number"
                  step="any"
                  value={createFields.valorMax}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, valorMax: e.target.value })
                  }
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn" disabled={createAct.loading}>
                  Crear parámetro
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
                Parámetro examen código
                <input value={editCode} onChange={(e) => setEditCode(e.target.value)} />
              </label>
              <div className="actions-row">
                <button type="button" className="btn secondary" onClick={() => plantilla()}>
                  Plantilla desde GET
                </button>
              </div>
              <label className="span-2">
                JSON ParametroExamen
                <textarea className="code" rows={12} value={editJson} onChange={(e) => setEditJson(e.target.value)} />
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
                Código parámetro
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
          </div>
        ),
      }}
    />
  )
}
