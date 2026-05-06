import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/Home'
import { DashboardPage } from './pages/DashboardPage'
import { ExamenesPage } from './pages/ExamenesPage'
import { MuestrasPage } from './pages/MuestrasPage'
import { OrdenLaboratorioPage } from './pages/OrdenLaboratorioPage'
import { OrdenExamenPage } from './pages/OrdenExamenPage'
import { ResultadoesPage } from './pages/ResultadoesPage'
import { ParametroExamenPage } from './pages/ParametroExamenPage'
import { ValidacionResultadoesPage } from './pages/ValidacionResultadoesPage'
import { InformePage } from './pages/InformePage'
import { SubirDocumentoSolicitadoPage } from './pages/SubirDocumentoSolicitadoPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="inicio" element={<HomePage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="examenes" element={<ExamenesPage />} />
        <Route path="muestras" element={<MuestrasPage />} />
        <Route path="orden-laboratorio" element={<OrdenLaboratorioPage />} />
        <Route path="orden-examen" element={<OrdenExamenPage />} />
        <Route path="resultados" element={<ResultadoesPage />} />
        <Route path="parametro-examen" element={<ParametroExamenPage />} />
        <Route path="validacion-resultados" element={<ValidacionResultadoesPage />} />
        <Route path="informe" element={<InformePage />} />
        <Route path="documento-solicitado/subir-archivo" element={<SubirDocumentoSolicitadoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
