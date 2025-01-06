import { Table, Group, Text, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { getBookings } from '../lib/api/bookings'
import BookingForm from '../components/forms/BookingForm'
import AddButton from '../components/forms/AddButton'

export default function Bookings() {
  const [opened, { open, close }] = useDisclosure(false)
  const { data: bookings, isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings
  })

  if (isLoading) return <Text>Loading...</Text>

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>Bookings</Text>
        <AddButton onClick={open} label="Booking" />
      </Group>
      
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Vehicle</Table.Th>
            <Table.Th>Start Date</Table.Th>
            <Table.Th>End Date</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Total Price</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {bookings?.map((booking) => (
            <Table.Tr key={booking.id}>
              <Table.Td>{`${booking.customers?.first_name} ${booking.customers?.last_name}`}</Table.Td>
              <Table.Td>{`${booking.vehicles?.make} ${booking.vehicles?.model}`}</Table.Td>
              <Table.Td>{new Date(booking.start_date).toLocaleDateString()}</Table.Td>
              <Table.Td>{new Date(booking.end_date).toLocaleDateString()}</Table.Td>
              <Table.Td>{booking.status}</Table.Td>
              <Table.Td>${booking.total_price}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal 
        opened={opened} 
        onClose={close} 
        title="Add New Booking"
        size="lg"
      >
        <BookingForm onClose={close} />
      </Modal>
    </>
  )
}
