import { useState } from 'react'
import { Table, Group, Text, Modal, Loader, Center } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getBookings, deleteBooking } from '../lib/api/bookings'
import BookingForm from '../components/forms/BookingForm'
import ActionButtons from '../components/ActionButtons'
import AddButton from '../components/forms/AddButton'

export default function Bookings() {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const queryClient = useQueryClient()

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings'],
    queryFn: getBookings
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
      notifications.show({
        title: 'Success',
        message: 'Booking deleted successfully',
        color: 'green'
      })
    }
  })

  const handleEdit = (booking) => {
    setSelectedBooking(booking)
    open()
  }

  const handleAdd = () => {
    setSelectedBooking(null)
    open()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader size="xl" />
      </Center>
    )
  }

  if (error) {
    return (
      <Center h={200}>
        <Text c="red" size="lg">Error loading bookings: {error.message}</Text>
      </Center>
    )
  }

  return (
    <>
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Text size="xl" fw={700} style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>Bookings</Text>
        <AddButton onClick={handleAdd} label="Booking" />
      </Group>
      
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Vehicle</Table.Th>
              <Table.Th>Start Date</Table.Th>
              <Table.Th>End Date</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Total Price</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {bookings?.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Center p="xl">
                    <Text size="lg" c="dimmed">No bookings found. Click the Add Booking button to create one.</Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              bookings?.map((booking) => (
                <Table.Tr key={booking.id}>
                  <Table.Td>{`${booking.customers?.first_name} ${booking.customers?.last_name}`}</Table.Td>
                  <Table.Td>{`${booking.vehicles?.make} ${booking.vehicles?.model}`}</Table.Td>
                  <Table.Td>{new Date(booking.start_date).toLocaleDateString()}</Table.Td>
                  <Table.Td>{new Date(booking.end_date).toLocaleDateString()}</Table.Td>
                  <Table.Td>{booking.status}</Table.Td>
                  <Table.Td>${booking.total_price}</Table.Td>
                  <Table.Td>
                    <ActionButtons
                      onEdit={() => handleEdit(booking)}
                      onDelete={() => handleDelete(booking.id)}
                    />
                  </Table.Td>
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </div>

      <Modal 
        opened={opened} 
        onClose={close} 
        title={selectedBooking ? "Edit Booking" : "Add New Booking"}
        size="lg"
      >
        <BookingForm 
          onClose={close} 
          initialData={selectedBooking}
        />
      </Modal>
    </>
  )
}
