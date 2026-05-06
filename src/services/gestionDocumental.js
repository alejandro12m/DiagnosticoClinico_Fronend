const BASE = 'https://gestiondocumental-1.onrender.com'

async function requestAbsolute(path, options = {}) {
  const url = `${BASE}${path}`
  const res = await fetch(url, options)
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

/**
 * POST multipart/form-data:
 * /api/DocumentoSolicitadoes/SubirArchivo
 *
 * Campos según Swagger:
 * - Archivo (file)
 * - NombreArchivo (string)
 * - DescripcionContenido (string)
 * - NombreMedico (string)
 * - NombreDepartamento (string)
 * - CodigoPaciente (string)
 * - CodigoSolicitud (string)
 * - CodigoTipoDoc (string)
 */
export async function subirArchivoDocumentoSolicitado(payload) {
  const fd = new FormData()

  if (payload?.Archivo instanceof File) fd.append('Archivo', payload.Archivo)
  ;[
    'NombreArchivo',
    'DescripcionContenido',
    'NombreMedico',
    'NombreDepartamento',
    'CodigoPaciente',
    'CodigoSolicitud',
    'CodigoTipoDoc',
  ].forEach((k) => {
    const v = payload?.[k]
    if (v === undefined || v === null || String(v).trim() === '') return
    fd.append(k, String(v))
  })

  return requestAbsolute('/api/DocumentoSolicitadoes/SubirArchivo', {
    method: 'POST',
    body: fd,
  })
}

