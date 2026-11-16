import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteNav } from './components/SiteNav'
import { RequireAuth } from './components/RequireAuth'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePlanningPage from './pages/HomePlanningPage'
import PlanOverviewPage from './pages/PlanOverviewPage'
import HomeSimulatorPage from './pages/HomeSimulatorPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteNav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/simulate" element={<HomeSimulatorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/plan/setup" element={<RequireAuth><HomePlanningPage /></RequireAuth>} />
          <Route path="/plan/overview" element={<RequireAuth><PlanOverviewPage /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
