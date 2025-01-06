import { NavLink, Stack, Text, Button, Box } from '@mantine/core'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  IconDashboard, 
  IconCar, 
  IconBuilding,
  IconUsers, 
  IconCalendar,
  IconTool,
  IconFolder,
  IconCreditCard,
  IconLogout
} from '@tabler/icons-react'
import { useAuth } from '../lib/auth/AuthContext'

export default function Sidebar({ onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()

  const navLinks = [
    { label: 'Dashboard', icon: IconDashboard, path: '/' },
    { label: 'Vehicles', icon: IconCar, path: '/vehicles' },
    { label: 'Companies', icon: IconBuilding, path: '/companies' },
    { label: 'Customers', icon: IconUsers, path: '/customers' },
    { label: 'Bookings', icon: IconCalendar, path: '/bookings' },
    { label: 'Maintenance', icon: IconTool, path: '/maintenance' },
    { label: 'Documents', icon: IconFolder, path: '/documents' },
    { label: 'Subscriptions', icon: IconCreditCard, path: '/subscriptions' }
  ]

  const handleNavigation = (path) => {
    navigate(path)
    onClose?.()
  }

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (!error) {
      onClose?.()
      navigate('/login', { replace: true })
    }
  }

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'white',
      position: 'relative'
    }}>
      <div style={{ 
        flex: '1 1 auto',
        overflowY: 'auto',
        padding: '1rem',
        paddingBottom: '70px'
      }}>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            active={location.pathname === link.path}
            label={<Text size="sm">{link.label}</Text>}
            leftSection={<link.icon size="1.2rem" stroke={1.5} />}
            onClick={() => handleNavigation(link.path)}
            style={{ marginBottom: '0.5rem' }}
          />
        ))}
      </div>
      
      <div style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: '1px solid #eee',
        backgroundColor: 'white'
      }}>
        <Button
          variant="subtle"
          color="red"
          leftSection={<IconLogout size="1.2rem" stroke={1.5} />}
          onClick={handleSignOut}
          hiddenFrom="sm"
          fullWidth
          style={{ 
            height: '60px',
            borderRadius: 0
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  )
}
