import { Table, Group, Text, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { getCustomers } from '../lib/api/customers'
import CustomerForm from '../components/forms/CustomerForm'
import AddButton from '../components/forms/AddButton'

export default function Customers() {
  const [opened, { open, close }] = useDisclosure(false)
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  })

  if (isLoading) return <Text>Loading...</Text>

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>Customers</Text>
        <AddButton onClick={open} label="Customer" />
      </Group>
      
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>License Number</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {customers?.map((customer) => (
            <Table.Tr key={customer.id}>
              <Table.Td>{`${customer.first_name} ${customer.last_name}`}</Table.Td>
              <Table.Td>{customer.email}</Table.Td>
              <Table.Td>{customer.phone}</Table.Td>
              <Table.Td>{customer.driver_license_number}</Table.Td>
              <Table.Td>{customer.status}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal 
        opened={opened} 
        onClose={close} 
        title="Add New Customer"
        size="lg"
      >
        <CustomerForm onClose={close} />
      </Modal>
    </>
  )
}
