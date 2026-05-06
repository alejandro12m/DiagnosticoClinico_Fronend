import { useState } from 'react'
import { CrudTabs } from '../components/CrudTabs'
import { JsonViewer } from '../components/JsonViewer'
import { MessageBar } from '../components/MessageBar'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { useMountFetch } from '../hooks/useMountFetch'
import * as api from '../services/api'

export function ExamenesPage() {
  const list = useMountFetch(() => api.listExamenes())

  const [createFields, setCreateFields] = useState({
    code: '',
    nombre: '',
    descripcion: '',
    tiempoProcesamiento: '',
    ayuno: 'false',
  })
  const createAct = useAsyncAction((p) => api.createExamen(p))

  const [editCode, setEditCode] = useState('')
  const [editBodyText, setEditBodyText] = useState('')
  const editLoad = useAsyncAction(() => api.getExamen(editCode.trim()))
  const editSave = useAsyncAction((payload) =>
    api.updateExamen(editCode.trim(), payload),
  )

  const [delCode, setDelCode] = useState('')
  const delAct = useAsyncAction(() => api.deleteExamen(delCode.trim()))

  const unwrapList = () => list.data?.examenes ?? []

  async function fillEditFromApi() {
    const res = await editLoad.run()
    const dto = res?.examen
    if (!dto) return
    const template = {
      examenId: 0,
      examenCodigo: dto.examenCodigo,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      tiempoProcesamiento: dto.tiempoProcesamiento,
      requiereAyuno: dto.requiereAyuno,
      estado: 'Activo',
      parametroExamenes: null,
      ordenExamenes: null,
    }
    setEditBodyText(JSON.stringify(template, null, 2))
  }

  return (
    <CrudTabs
      title="Examen"
      subtitle="GET/POST/PUT/DELETE en /api/Examen. El PUT requiere el cuerpo completo de la entidad (incluye examenId desde BD/Swagger si hace falta)."
      tabs={{
        list: (
          <div>
            <MessageBar loading={list.loading} error={list.error} success={list.success} />
            <p>
              <button type="button" className="btn secondary" onClick={() => list.reload()}>
                Recargar
              </button>
            </p>
            <JsonViewer value={unwrapList()} />
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
                  nombre: createFields.nombre,
                  descripcion: createFields.descripcion,
                  tiempoProcesamiento: Number(createFields.tiempoProcesamiento),
                  ayuno: createFields.ayuno === 'true',
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
                Nombre
                <input
                  value={createFields.nombre}
                  onChange={(e) => setCreateFields({ ...createFields, nombre: e.target.value })}
                  required
                />
              </label>
              <label className="span-2">
                Descripción
                <input
                  value={createFields.descripcion}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, descripcion: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Tiempo procesamiento (h)
                <input
                  type="number"
                  value={createFields.tiempoProcesamiento}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, tiempoProcesamiento: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Requiere ayuno
                <select
                  value={createFields.ayuno}
                  onChange={(e) => setCreateFields({ ...createFields, ayuno: e.target.value })}
                >
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </label>
              <div className="span-2">
                <button type="submit" className="btn" disabled={createAct.loading}>
                  Crear examen
                </button>
              </div>
            </form>
            {createAct.data ? <JsonViewer value={createAct.data} /> : null}
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
                Código del examen
                <input value={editCode} onChange={(e) => setEditCode(e.target.value)} />
              </label>
              <div className="actions-row">
                <button type="button" className="btn secondary" onClick={() => fillEditFromApi()}>
                  Cargar desde API (plantilla JSON)
                </button>
              </div>
              <label className="span-2">
                Cuerpo JSON (entidad Examen)
                <textarea
                  rows={14}
                  value={editBodyText}
                  onChange={(e) => setEditBodyText(e.target.value)}
                  className="code"
                />
              </label>
              <div className="span-2">
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    const payload = JSON.parse(editBodyText)
                    return editSave.run(payload)
                  }}
                >
                  Guardar (PUT)
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
                Código a eliminar (soft-delete Inactivo)
                <input
                  value={delCode}
                  onChange={(e) => setDelCode(e.target.value)}
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn danger" disabled={delAct.loading}>
                  Eliminar
                </button>
              </div>
            </form>
          </div>
        ),
      }}
    />
  )
}
