import { SimpleGrid, Card, Text, Group } from '@mantine/core'
import { IconCar, IconUsers, IconCalendar } from '@tabler/icons-react'
import { useQuery } from '@tanstack/react-query'
import { getVehicles } from '../lib/api/vehicles'
import { getBookings } from '../lib/api/bookings'
import { getCustomers } from '../lib/api/customers'

export default function Dashboard() {
  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles
  })

  const { data: bookings } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings
  })

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  })

  const stats = [
    {
      title: 'Total Vehicles',
      value: vehicles?.length || 0,
      icon: IconCar,
      color: 'blue'
    },
    {
      title: 'Active Bookings',
      value: bookings?.filter(b => b.status === 'confirmed')?.length || 0,
      icon: IconCalendar,
      color: 'green'
    },
    {
      title: 'Total Customers',
      value: customers?.length || 0,
      icon: IconUsers,
      color: 'grape'
    }
  ]

  return (
    <div>
      <Text size="xl" fw={700} mb="lg">Dashboard</Text>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {stats.map((stat) => (
          <Card key={stat.title} withBorder shadow="sm" radius="md" padding="lg">
            <Group>
              <stat.icon size={30} style={{ color: `var(--mantine-color-${stat.color}-6)` }} />
              <div>
                <Text size="xs" c="dimmed" tt="uppercase">{stat.title}</Text>
                <Text size="lg" fw={500}>{stat.value}</Text>
              </div>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </div>
  )
}
