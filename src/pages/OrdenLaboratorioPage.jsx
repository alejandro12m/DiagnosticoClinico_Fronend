import { useState } from 'react'
import { CrudTabs } from '../components/CrudTabs'
import { JsonViewer } from '../components/JsonViewer'
import { MessageBar } from '../components/MessageBar'
import { useAsyncAction } from '../hooks/useAsyncAction'
import { useMountFetch } from '../hooks/useMountFetch'
import * as api from '../services/api'

export function OrdenLaboratorioPage() {
  const list = useMountFetch(() => api.listOrdenLaboratorio())

  const [createFields, setCreateFields] = useState({
    code: '',
    pacienteCodigo: '',
    medicoCodigo: '',
    fechaOrden: '',
    tipoAtencion: '',
    observaciones: '',
  })
  const createAct = useAsyncAction((p) => api.createOrdenLaboratorio(p))

  const [putCode, setPutCode] = useState('')
  const [putFields, setPutFields] = useState({
    pacienteCodigo: '',
    medicoCodigo: '',
    fechaOrden: '',
    tipoAtencion: '',
    observaciones: '',
  })
  const putAct = useAsyncAction((code, p) => api.updateOrdenLaboratorio(code, p))

  const [delCode, setDelCode] = useState('')
  const delAct = useAsyncAction((c) => api.deleteOrdenLaboratorio(c))

  const [listoCode, setListoCode] = useState('')
  const listoAct = useAsyncAction((c) => api.marcarOrdenLaboratorioComoListo(c))

  const rows = () => list.data?.ordenLaboratorio ?? []

  return (
    <CrudTabs
      title="Orden de laboratorio"
      subtitle="POST en /api/OrdenLaboratorio/HacerOrdenLaboratorio. PUT usa query string. PUT /MarcarComolisto/{code} cambia a Listo. DELETE marca Inactivo."
      tabs={{
        list: (
          <div>
            <MessageBar loading={list.loading} error={list.error} success={list.success} />
            <p>
              <button type="button" className="btn secondary" onClick={() => list.reload()}>
                Recargar
              </button>
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Paciente</th>
                    <th>Médico</th>
                    <th>Fecha</th>
                    <th>Atención</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {rows().map((r) => {
                    const code = r?.ordenLaboratorioCodigo ?? ''
                    const estado = r?.estadoOrden ?? r?.estadoOrdenLaboratorio ?? ''
                    const isListo = String(estado).toLowerCase() === 'listo'
                    return (
                      <tr key={code || JSON.stringify(r)}>
                        <td className="code">{code}</td>
                        <td className="code">{r?.pacienteCodigo ?? ''}</td>
                        <td className="code">{r?.medicoCodigo ?? ''}</td>
                        <td className="code">{r?.fechaOrden ?? ''}</td>
                        <td>{r?.tipoAtencion ?? ''}</td>
                        <td>
                          <span className="code">{estado}</span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn"
                            disabled={!code || isListo || listoAct.loading}
                            onClick={async () => {
                              await listoAct.run(code)
                              list.reload()
                            }}
                          >
                            Marcar listo
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                  {rows().length === 0 ? (
                    <tr>
                      <td className="muted" colSpan={7}>
                        Sin registros.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
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
                  pacienteCodigo: createFields.pacienteCodigo,
                  medicoCodigo: createFields.medicoCodigo,
                  fechaOrden: createFields.fechaOrden,
                  tipoAtencion: createFields.tipoAtencion,
                  observaciones: createFields.observaciones,
                })
              }}
            >
              <label>
                Código orden
                <input
                  value={createFields.code}
                  onChange={(e) => setCreateFields({ ...createFields, code: e.target.value })}
                  required
                />
              </label>
              <label>
                Paciente código
                <input
                  value={createFields.pacienteCodigo}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, pacienteCodigo: e.target.value })
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
                Fecha orden
                <input
                  type="date"
                  value={createFields.fechaOrden}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, fechaOrden: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Tipo atención
                <input
                  value={createFields.tipoAtencion}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, tipoAtencion: e.target.value })
                  }
                  required
                />
              </label>
              <label className="span-2">
                Observaciones
                <input
                  value={createFields.observaciones}
                  onChange={(e) =>
                    setCreateFields({ ...createFields, observaciones: e.target.value })
                  }
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn" disabled={createAct.loading}>
                  Crear orden
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
                putAct.run(putCode.trim(), {
                  pacienteCodigo: putFields.pacienteCodigo,
                  medicoCodigo: putFields.medicoCodigo,
                  fechaOrden: putFields.fechaOrden,
                  tipoAtencion: putFields.tipoAtencion,
                  observaciones: putFields.observaciones,
                })
              }}
            >
              <label>
                Código orden existente
                <input
                  value={putCode}
                  onChange={(e) => setPutCode(e.target.value)}
                  required
                />
              </label>
              <label>
                Paciente código
                <input
                  value={putFields.pacienteCodigo}
                  onChange={(e) =>
                    setPutFields({ ...putFields, pacienteCodigo: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Médico código
                <input
                  value={putFields.medicoCodigo}
                  onChange={(e) =>
                    setPutFields({ ...putFields, medicoCodigo: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Fecha orden
                <input
                  type="date"
                  value={putFields.fechaOrden}
                  onChange={(e) =>
                    setPutFields({ ...putFields, fechaOrden: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Tipo atención
                <input
                  value={putFields.tipoAtencion}
                  onChange={(e) =>
                    setPutFields({ ...putFields, tipoAtencion: e.target.value })
                  }
                  required
                />
              </label>
              <label className="span-2">
                Observaciones
                <input
                  value={putFields.observaciones}
                  onChange={(e) =>
                    setPutFields({ ...putFields, observaciones: e.target.value })
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
                delAct.run(delCode.trim())
              }}
            >
              <label>
                Código orden
                <input
                  value={delCode}
                  onChange={(e) => setDelCode(e.target.value)}
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn danger" disabled={delAct.loading}>
                  Eliminar (estado Inactivo)
                </button>
              </div>
            </form>
            {delAct.data ? <JsonViewer value={delAct.data} /> : null}
          </div>
        ),
        listo: (
          <div>
            <MessageBar
              loading={listoAct.loading}
              error={listoAct.error}
              success={listoAct.success}
            />
            <form
              className="form-grid"
              onSubmit={(e) => {
                e.preventDefault()
                Promise.resolve(listoAct.run(listoCode.trim())).then(() => list.reload())
              }}
            >
              <label>
                Código orden
                <input
                  value={listoCode}
                  onChange={(e) => setListoCode(e.target.value)}
                  required
                />
              </label>
              <div className="span-2">
                <button type="submit" className="btn" disabled={listoAct.loading}>
                  Marcar como listo (PUT)
                </button>
              </div>
            </form>
            {listoAct.data ? <JsonViewer value={listoAct.data} /> : null}
          </div>
        ),
      }}
    />
  )
}
