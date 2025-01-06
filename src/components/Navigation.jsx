import { Group, Text } from '@mantine/core'
import { Link } from 'react-router-dom'

export default function Navigation() {
  return (
    <Group h="100%" px="md">
      <Text size="xl" component={Link} to="/" style={{ textDecoration: 'none' }}>
        Rental Management
      </Text>
      <Group ml="auto">
        <Text component={Link} to="/vehicles" style={{ textDecoration: 'none' }}>
          Vehicles
        </Text>
        <Text component={Link} to="/customers" style={{ textDecoration: 'none' }}>
          Customers
        </Text>
        <Text component={Link} to="/bookings" style={{ textDecoration: 'none' }}>
          Bookings
        </Text>
      </Group>
    </Group>
  )
}
