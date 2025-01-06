import { useState } from 'react'
import { Table, Group, Text, Modal, Button, Loader, Center } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getVehicles, deleteVehicle } from '../lib/api/vehicles'
import VehicleForm from '../components/forms/VehicleForm'
import ActionButtons from '../components/ActionButtons'
import AddButton from '../components/forms/AddButton'

export default function Vehicles() {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const queryClient = useQueryClient()

  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles
  })

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles'])
      notifications.show({
        title: 'Success',
        message: 'Vehicle deleted successfully',
        color: 'green'
      })
    }
  })

  const handleEdit = (vehicle) => {
    setSelectedVehicle(vehicle)
    open()
  }

  const handleAdd = () => {
    setSelectedVehicle(null)
    open()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
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
        <Text c="red" size="lg">Error loading vehicles: {error.message}</Text>
      </Center>
    )
  }

  return (
    <>
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Text size="xl" fw={700} style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>Vehicles</Text>
        <AddButton onClick={handleAdd} label="Vehicle" />
      </Group>
      
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Table highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Make</Table.Th>
            <Table.Th>Model</Table.Th>
            <Table.Th>Year</Table.Th>
            <Table.Th>License Plate</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {vehicles?.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Center p="xl">
                  <Text size="lg" c="dimmed">No vehicles found. Click the Add Vehicle button to create one.</Text>
                </Center>
              </Table.Td>
            </Table.Tr>
          ) : (
            vehicles?.map((vehicle) => (
              <Table.Tr key={vehicle.id}>
                <Table.Td>{vehicle.make}</Table.Td>
                <Table.Td>{vehicle.model}</Table.Td>
                <Table.Td>{vehicle.year}</Table.Td>
                <Table.Td>{vehicle.license_plate}</Table.Td>
                <Table.Td>{vehicle.status}</Table.Td>
                <Table.Td>
                  <ActionButtons
                    onEdit={() => handleEdit(vehicle)}
                    onDelete={() => handleDelete(vehicle.id)}
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
        title={selectedVehicle ? "Edit Vehicle" : "Add New Vehicle"}
        size="lg"
      >
        <VehicleForm 
          onClose={close} 
          initialData={selectedVehicle}
        />
      </Modal>
    </>
  )
}
