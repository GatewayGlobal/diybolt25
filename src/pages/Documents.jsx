import { Table, Group, Text, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { getDocuments } from '../lib/api/documents'
import DocumentForm from '../components/forms/DocumentForm'
import AddButton from '../components/forms/AddButton'

export default function Documents() {
  const [opened, { open, close }] = useDisclosure(false)
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: getDocuments
  })

  if (isLoading) return <Text>Loading...</Text>

  return (
    <>
      <Group justify="space-between" mb="md">
        <Text size="xl" fw={700}>Documents</Text>
        <AddButton onClick={open} label="Document" />
      </Group>
      
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Document Type</Table.Th>
            <Table.Th>Related To</Table.Th>
            <Table.Th>File Name</Table.Th>
            <Table.Th>Uploaded By</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {documents?.map((doc) => (
            <Table.Tr key={doc.id}>
              <Table.Td>{doc.document_type}</Table.Td>
              <Table.Td>{doc.related_to}</Table.Td>
              <Table.Td>{doc.file_name}</Table.Td>
              <Table.Td>{doc.uploaded_by}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal 
        opened={opened} 
        onClose={close} 
        title="Add Document"
        size="lg"
      >
        <DocumentForm onClose={close} />
      </Modal>
    </>
  )
}
