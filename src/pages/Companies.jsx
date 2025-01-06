import { useState } from 'react'
import { Table, Group, Text, Modal, Button, Loader, Center, Badge } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { getCompanies, deleteCompany } from '../lib/api/companies'
import CompanyForm from '../components/forms/CompanyForm'
import ActionButtons from '../components/ActionButtons'
import AddButton from '../components/forms/AddButton'

export default function Companies() {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const queryClient = useQueryClient()

  const { data: companies, isLoading, error } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      notifications.show({
        title: 'Success',
        message: 'Company deleted successfully',
        color: 'green'
      })
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete company',
        color: 'red'
      })
    }
  })

  const handleEdit = (company) => {
    setSelectedCompany(company)
    open()
  }

  const handleAdd = () => {
    setSelectedCompany(null)
    open()
  }

  const handleDelete = async (id) => {
    // Check if company has any vehicles
    const company = companies.find(c => c.id === id)
    if (company.vehicles?.length > 0) {
      notifications.show({
        title: 'Error',
        message: 'Cannot delete company with associated vehicles',
        color: 'red'
      })
      return
    }

    if (window.confirm('Are you sure you want to delete this company?')) {
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
        <Text c="red" size="lg">Error loading companies: {error.message}</Text>
      </Center>
    )
  }

  return (
    <>
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Text size="xl" fw={700} style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>Companies</Text>
        <AddButton onClick={handleAdd} label="Company" />
      </Group>
      
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <Table highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Phone</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th>Subscription</Table.Th>
            <Table.Th>Plan</Table.Th>
            <Table.Th>Vehicles</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {companies?.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={8}>
                <Center p="xl">
                  <Text size="lg" c="dimmed">No companies found. Click the Add Company button to create one.</Text>
                </Center>
              </Table.Td>
            </Table.Tr>
          ) : (
            companies?.map((company) => (
              <Table.Tr key={company.id}>
                <Table.Td>{company.name}</Table.Td>
                <Table.Td>{company.email}</Table.Td>
                <Table.Td>{company.phone}</Table.Td>
                <Table.Td>{company.address}</Table.Td>
                <Table.Td>
                  <Badge 
                    variant="light" 
                    color={company.subscription_status === 'active' ? 'green' : company.subscription_status === 'pending' ? 'yellow' : 'red'}
                  >
                    {company.subscription_status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge variant="filled">
                    {company.subscription_plan}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light">
                    {company.vehicles?.length || 0} vehicles
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <ActionButtons
                    onEdit={() => handleEdit(company)}
                    onDelete={() => handleDelete(company.id)}
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
        title={selectedCompany ? "Edit Company" : "Add New Company"}
        size="lg"
      >
        <CompanyForm 
          onClose={close} 
          initialData={selectedCompany}
        />
      </Modal>
    </>
  )
}
