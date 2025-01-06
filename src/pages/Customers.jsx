import { useState } from 'react'
import { Table, Group, Text, Modal, Button, Loader, Center } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getCustomers, deleteCustomer } from '../lib/api/customers'
import CustomerForm from '../components/forms/CustomerForm'
import ActionButtons from '../components/ActionButtons'
import AddButton from '../components/forms/AddButton'

export default function Customers() {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const queryClient = useQueryClient()

  const { data: customers, isLoading, error } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers'])
      notifications.show({
        title: 'Success',
        message: 'Customer deleted successfully',
        color: 'green'
      })
    }
  })

  const handleEdit = (customer) => {
    setSelectedCustomer(customer)
    open()
  }

  const handleAdd = () => {
    setSelectedCustomer(null)
    open()
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
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
        <Text c="red" size="lg">Error loading customers: {error.message}</Text>
      </Center>
    )
  }

  return (
    <>
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Text size="xl" fw={700} style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>Customers</Text>
        <AddButton onClick={handleAdd} label="Customer" />
      </Group>
      
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Table highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>License Number</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {customers?.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={6}>
                  <Center p="xl">
                    <Text size="lg" c="dimmed">No customers found. Click the Add Customer button to create one.</Text>
                  </Center>
                </Table.Td>
              </Table.Tr>
            ) : (
              customers?.map((customer) => (
                <Table.Tr key={customer.id}>
                  <Table.Td>{`${customer.first_name} ${customer.last_name}`}</Table.Td>
                  <Table.Td>{customer.email}</Table.Td>
                  <Table.Td>{customer.phone}</Table.Td>
                  <Table.Td>{customer.driver_license_number}</Table.Td>
                  <Table.Td>{customer.status}</Table.Td>
                  <Table.Td>
                    <ActionButtons
                      onEdit={() => handleEdit(customer)}
                      onDelete={() => handleDelete(customer.id)}
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
        title={selectedCustomer ? "Edit Customer" : "Add New Customer"}
        size="lg"
      >
        <CustomerForm 
          onClose={close} 
          initialData={selectedCustomer}
        />
      </Modal>
    </>
  )
}
