import { NavLink, Stack, Text } from '@mantine/core'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  IconDashboard, 
  IconCar, 
  IconUsers, 
  IconCalendar,
  IconTool,
  IconFolder,
  IconCreditCard
} from '@tabler/icons-react'

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { label: 'Dashboard', icon: IconDashboard, path: '/' },
    { label: 'Vehicles', icon: IconCar, path: '/vehicles' },
    { label: 'Customers', icon: IconUsers, path: '/customers' },
    { label: 'Bookings', icon: IconCalendar, path: '/bookings' },
    { label: 'Maintenance', icon: IconTool, path: '/maintenance' },
    { label: 'Documents', icon: IconFolder, path: '/documents' },
    { label: 'Subscriptions', icon: IconCreditCard, path: '/subscriptions' }
  ]

  return (
    <Stack gap="xs" p="md">
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          active={location.pathname === link.path}
          label={<Text size="sm">{link.label}</Text>}
          leftSection={<link.icon size="1.2rem" stroke={1.5} />}
          onClick={() => navigate(link.path)}
        />
      ))}
    </Stack>
  )
}
