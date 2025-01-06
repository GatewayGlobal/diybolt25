import { Table, Group, Text, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { getMaintenanceRecords } from '../lib/api/maintenance'
import MaintenanceForm from '../components/forms/MaintenanceForm'
import AddButton from '../components/forms/AddButton'

export default function Maintenance() {
  const [opened, { open, close }] = useDisclosure(false)
  const { data: records, isLoading } = useQuery({
    queryKey: ['maintenance'],
    queryFn: getMaintenanceRecords
  })

  if (isLoading) return <Text>Loading...</Text>

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>Maintenance Records</Text>
        <AddButton onClick={open} label="Record" />
      </Group>
      
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Vehicle</Table.Th>
            <Table.Th>Service Type</Table.Th>
            <Table.Th>Service Date</Table.Th>
            <Table.Th>Cost</Table.Th>
            <Table.Th>Next Service</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {records?.map((record) => (
            <Table.Tr key={record.id}>
              <Table.Td>{`${record.vehicles?.make} ${record.vehicles?.model}`}</Table.Td>
              <Table.Td>{record.service_type}</Table.Td>
              <Table.Td>{new Date(record.service_date).toLocaleDateString()}</Table.Td>
              <Table.Td>${record.cost}</Table.Td>
              <Table.Td>{record.next_service_date ? new Date(record.next_service_date).toLocaleDateString() : 'N/A'}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal 
        opened={opened} 
        onClose={close} 
        title="Add Maintenance Record"
        size="lg"
      >
        <MaintenanceForm onClose={close} />
      </Modal>
    </>
  )
}
