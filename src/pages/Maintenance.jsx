import { useState } from 'react'
import { Table, Group, Text, Modal, Loader, Center } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getMaintenanceRecords, deleteMaintenanceRecord } from '../lib/api/maintenance'
import MaintenanceForm from '../components/forms/MaintenanceForm'
import ActionButtons from '../components/ActionButtons'
import AddButton from '../components/forms/AddButton'

export default function Maintenance() {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const queryClient = useQueryClient()

  const { data: records, isLoading, error } = useQuery({
    queryKey: ['maintenance'],
    queryFn: getMaintenanceRecords
  })

  const deleteMutation = useMutation({
    mutationFn: deleteMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries(['maintenance'])
      notifications.show({
        title: 'Success',
        message: 'Maintenance record deleted successfully',
        color: 'green'
      })
    }
  })

  const handleEdit = (record) => {
    setSelectedRecord(record)
    open()
  }

  const handleAdd = () => {
    setSelectedRecord(null)
    open()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
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
        <Text c="red" size="lg">Error loading maintenance records: {error.message}</Text>
      </Center>
    )
  }

  return (
    <>
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Text size="xl" fw={700} style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>Maintenance Records</Text>
        <AddButton onClick={handleAdd} label="Record" />
      </Group>
      
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Vehicle</Table.Th>
              <Table.Th>Service Type</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Service Date</Table.Th>
              <Table.Th>Cost</Table.Th>
              <Table.Th>Next Service</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {records?.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={7}>
                  <Center p="xl">
                    <Text size="lg" c="dimmed">No maintenance records found. Click the Add Record button to create one.</Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              records?.map((record) => (
                <Table.Tr key={record.id}>
                  <Table.Td>{`${record.vehicles?.make} ${record.vehicles?.model}`}</Table.Td>
                  <Table.Td>{record.service_type}</Table.Td>
                  <Table.Td>{record.description}</Table.Td>
                  <Table.Td>{record.service_date ? new Date(record.service_date).toLocaleDateString() : 'N/A'}</Table.Td>
                  <Table.Td>${record.cost?.toFixed(2) || '0.00'}</Table.Td>
                  <Table.Td>{record.next_service_date ? new Date(record.next_service_date).toLocaleDateString() : 'N/A'}</Table.Td>
                  <Table.Td>
                    <ActionButtons
                      onEdit={() => handleEdit(record)}
                      onDelete={() => handleDelete(record.id)}
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
        title={selectedRecord ? "Edit Maintenance Record" : "Add Maintenance Record"}
        size="lg"
      >
        <MaintenanceForm 
          onClose={close} 
          initialData={selectedRecord}
        />
      </Modal>
    </>
  )
}
