import { TextInput, Select, Button, Stack } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDocument } from '../../lib/api/documents'

export default function DocumentForm({ onClose }) {
  const queryClient = useQueryClient()
  const form = useForm({
    initialValues: {
      document_type: '',
      related_to: '',
      related_id: '',
      file_name: '',
      file_path: ''
    },
    validate: {
      document_type: (value) => !value && 'Document type is required',
      file_name: (value) => !value && 'File name is required'
    }
  })

  const mutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      queryClient.invalidateQueries(['documents'])
      onClose()
    }
  })

  const handleSubmit = (values) => {
    mutation.mutate({
      ...values,
      company_id: '00000000-0000-0000-0000-000000000000', // Replace with actual company ID
      uploaded_by: '00000000-0000-0000-0000-000000000000' // Replace with actual user ID
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Select
          label="Document Type"
          data={[
            'Vehicle Registration',
            'Insurance',
            'Driver License',
            'Maintenance Report',
            'Other'
          ]}
          {...form.getInputProps('document_type')}
        />
        <Select
          label="Related To"
          data={[
            'Vehicle',
            'Customer',
            'Booking',
            'Maintenance'
          ]}
          {...form.getInputProps('related_to')}
        />
        <TextInput
          label="File Name"
          {...form.getInputProps('file_name')}
        />
        <TextInput
          label="File Path"
          {...form.getInputProps('file_path')}
        />
        <Button type="submit" loading={mutation.isPending}>
          Upload Document
        </Button>
      </Stack>
    </form>
  )
}
