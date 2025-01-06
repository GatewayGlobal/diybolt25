import React from 'react'
import { AppShell, Burger, Group, Title, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Vehicles from './pages/Vehicles'
import Companies from './pages/Companies'
import Customers from './pages/Customers'
import Bookings from './pages/Bookings'
import Maintenance from './pages/Maintenance'
import Documents from './pages/Documents'

function Header({ opened, toggle }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <Group h="100%" px="md" justify="space-between">
      <Group>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <Title order={3} style={{ fontSize: 'clamp(1rem, 3vw, 1.25rem)' }}>Gateway Fleet System</Title>
      </Group>
      {user && (
        <Button variant="subtle" onClick={handleSignOut} visibleFrom="sm">
          Sign Out
        </Button>
      )}
    </Group>
  )
}

function AppContent() {
  const [opened, { toggle, close }] = useDisclosure(false)
  const { user } = useAuth()
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  // Close sidebar when route changes
  React.useEffect(() => {
    close()
  }, [location.pathname, close])

  // If on login page, render without AppShell
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
      </Routes>
    )
  }

  return (
    <AppShell
      padding="md"
      navbar={{ 
        width: { base: 270, sm: 300 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
        style: { 
          padding: 0
        }
      }}
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <Header opened={opened} toggle={toggle} />
      </AppShell.Header>

      {user && (
        <AppShell.Navbar>
          <Sidebar onClose={close} />
        </AppShell.Navbar>
      )}

      <AppShell.Main>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <Vehicles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <Companies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <Customers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/maintenance"
            element={
              <ProtectedRoute>
                <Maintenance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents"
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppShell.Main>
    </AppShell>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}
