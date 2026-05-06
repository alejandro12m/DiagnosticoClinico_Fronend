/**
 * Cliente HTTP centralizado para DiagnosticoMedico API.
 * En desarrollo con Vite: deja VITE_API_URL vacío y usa el proxy hacia /api.
 * En producción: VITE_API_URL=https://diagnosticoseguro2-3.onrender.com
 */
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

function buildQuery(params) {
  const sp = new URLSearchParams()
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return
    sp.append(k, String(v))
  })
  const q = sp.toString()
  return q ? `?${q}` : ''
}

export async function apiRequest(path, options = {}) {
  const url = `${BASE}${path}`
  const headers = { ...options.headers }
  if (
    options.body !== undefined &&
    !(options.body instanceof FormData) &&
    typeof options.body === 'object'
  ) {
    headers['Content-Type'] = 'application/json'
    options = { ...options, body: JSON.stringify(options.body) }
  }
  const res = await fetch(url, { ...options, headers })
  const text = await res.text()
  let parsed
  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    parsed = text
  }
  if (!res.ok) {
    const msg =
      typeof parsed === 'object' && parsed !== null && parsed.mensaje != null
        ? String(parsed.mensaje)
        : typeof parsed === 'string' && parsed
          ? parsed
          : `${res.status} ${res.statusText}`
    throw new Error(msg)
  }
  return parsed
}

export async function apiGet(path) {
  return apiRequest(path, { method: 'GET' })
}

export async function apiPost(path, body) {
  return apiRequest(path, { method: 'POST', body })
}

export async function apiPostQuery(path, queryParams) {
  return apiRequest(`${path}${buildQuery(queryParams)}`, { method: 'POST' })
}

export async function apiPut(path, body) {
  return apiRequest(path, { method: 'PUT', body })
}

export async function apiPutQuery(path, queryParams) {
  return apiRequest(`${path}${buildQuery(queryParams)}`, { method: 'PUT' })
}

export async function apiDelete(path) {
  return apiRequest(path, { method: 'DELETE' })
}

// --- Examen ---
export const listExamenes = () => apiGet('/api/Examen')
export const getExamen = (code) => apiGet(`/api/Examen/${encodeURIComponent(code)}`)
export const createExamen = (p) =>
  apiPostQuery('/api/Examen', {
    code: p.code,
    nombre: p.nombre,
    descripcion: p.descripcion,
    tiempoProcesamiento: p.tiempoProcesamiento,
    ayuno: p.ayuno,
  })
export const updateExamen = (code, body) =>
  apiPut(`/api/Examen/${encodeURIComponent(code)}`, body)
export const deleteExamen = (code) => apiDelete(`/api/Examen/${encodeURIComponent(code)}`)

// --- Muestras ---
export const listMuestras = () => apiGet('/api/Muestras')
export const getMuestra = (code) => apiGet(`/api/Muestras/${encodeURIComponent(code)}`)
export const createMuestra = (p) =>
  apiPostQuery('/api/Muestras', {
    code: p.code,
    TipoMuestra: p.tipoMuestra,
    FechaRecoleccion: p.fechaRecoleccion,
    Volumen: p.volumen,
    Codicion: p.condicion,
  })
export const updateMuestra = (id, body) => apiPut(`/api/Muestras/${id}`, body)
export const deleteMuestra = (id) => apiDelete(`/api/Muestras/${id}`)

// --- OrdenLaboratorio ---
export const listOrdenLaboratorio = () => apiGet('/api/OrdenLaboratorio')
export const getOrdenLaboratorio = (code) =>
  apiGet(`/api/OrdenLaboratorio/${encodeURIComponent(code)}`)
export const createOrdenLaboratorio = (p) =>
  apiPostQuery('/api/OrdenLaboratorio/HacerOrdenLaboratorio', {
    code: p.code,
    PacienteCodigo: p.pacienteCodigo,
    MedicoCodigo: p.medicoCodigo,
    FechaOrden: p.fechaOrden,
    TipoAtencion: p.tipoAtencion,
    Observaciones: p.observaciones,
  })
export const updateOrdenLaboratorio = (code, p) =>
  apiPutQuery(`/api/OrdenLaboratorio/${encodeURIComponent(code)}`, {
    PacienteCodigo: p.pacienteCodigo,
    MedicoCodigo: p.medicoCodigo,
    FechaOrden: p.fechaOrden,
    TipoAtencion: p.tipoAtencion,
    Observaciones: p.observaciones,
  })
export const deleteOrdenLaboratorio = (code) =>
  apiDelete(`/api/OrdenLaboratorio/${encodeURIComponent(code)}`)

// --- OrdenExamen ---
export const listOrdenExamen = () => apiGet('/api/OrdenExamen')
export const createOrdenExamen = (p) =>
  apiPostQuery('/api/OrdenExamen', {
    OrdenCodigo: p.ordenCodigo,
    ExamenCodigo: p.examenCodigo,
    MuestraCodigo: p.muestraCodigo,
    AreaLaboratorio: p.areaLaboratorio,
  })
export const updateOrdenExamen = (id, body) => apiPut(`/api/OrdenExamen/${id}`, body)
export const deleteOrdenExamen = (id) => apiDelete(`/api/OrdenExamen/${id}`)

// Lecturas útiles extra
export const ordenExamenPendientes = () => apiGet('/api/OrdenExamen/Pendientes')
export const ordenExamenPorMedico = (code) =>
  apiGet(`/api/OrdenExamen/Mostrar-Datos-A-Doctores/${encodeURIComponent(code)}`)

// --- Resultadoes ---
export const listResultados = () => apiGet('/api/Resultadoes')
export const getResultado = (code) => apiGet(`/api/Resultadoes/${encodeURIComponent(code)}`)
export const createResultado = (p) =>
  apiPostQuery('/api/Resultadoes', {
    code: p.code,
    parametroexamencodigo: p.parametroExamenCodigo,
    muestracodigo: p.muestraCodigo,
    valor: p.valor,
    equipoCodigo: p.equipoCodigo,
    fecharesultado: p.fechaResultado,
  })
export const updateResultado = (code, body) =>
  apiPut(`/api/Resultadoes/${encodeURIComponent(code)}`, body)
export const deleteResultado = (code) => apiDelete(`/api/Resultadoes/${encodeURIComponent(code)}`)

// --- ParametroExamen ---
export const listParametroExamen = () => apiGet('/api/ParametroExamen')
export const getParametroExamen = (code) =>
  apiGet(`/api/ParametroExamen/${encodeURIComponent(code)}`)
export const createParametroExamen = (p) =>
  apiPostQuery('/api/ParametroExamen', {
    code: p.code,
    codeExamen: p.codeExamen,
    nombre: p.nombre,
    unidad: p.unidad,
    valuemin: p.valorMin,
    valuemax: p.valorMax,
  })
export const updateParametroExamen = (code, body) =>
  apiPut(`/api/ParametroExamen/${encodeURIComponent(code)}`, body)
export const deleteParametroExamen = (code) =>
  apiDelete(`/api/ParametroExamen/${encodeURIComponent(code)}`)

// --- ValidacionResultadoes ---
export const listValidaciones = () => apiGet('/api/ValidacionResultadoes')
export const getValidacion = (code) =>
  apiGet(`/api/ValidacionResultadoes/${encodeURIComponent(code)}`)
export const createValidacion = (p) =>
  apiPostQuery('/api/ValidacionResultadoes', {
    code: p.code,
    coderesultado: p.codigoResultado,
    medicoCodigo: p.medicoCodigo,
    fechaValidacion: p.fechaValidacion,
    observacion: p.observacion,
  })
export const updateValidacion = (id, body) =>
  apiPut(`/api/ValidacionResultadoes/${id}`, body)
export const deleteValidacion = (id) => apiDelete(`/api/ValidacionResultadoes/${id}`)

// --- Informe ---
export const listInformes = () => apiGet('/api/Informe')
export const getInforme = (code) => apiGet(`/api/Informe/${encodeURIComponent(code)}`)
export const createInforme = (p) =>
  apiPostQuery('/api/Informe/CrearInforme', {
    code: p.code,
    ordenCode: p.ordenCode,
    fechaEmision: p.fechaEmision,
    observacionesGenerales: p.observacionesGenerales,
  })
export const updateInforme = (code, ordenCode, fechaEmision, observacionesGenerales) => {
  const path = [
    '/api/Informe/actualizar',
    encodeURIComponent(code),
    encodeURIComponent(ordenCode || '-'),
    encodeURIComponent(fechaEmision),
    encodeURIComponent(observacionesGenerales || ''),
  ].join('/')
  return apiPut(path, {})
}
export const deleteInforme = (code) => apiDelete(`/api/Informe/${encodeURIComponent(code)}`)
