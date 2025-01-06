import { TextInput, Button, Stack, Group, Select } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { createCompany, updateCompany } from '../../lib/api/companies'
import { v4 as uuidv4 } from 'uuid'

export default function CompanyForm({ onClose, initialData = null }) {
  const queryClient = useQueryClient()
  const isEditing = !!initialData

  const form = useForm({
    initialValues: initialData || {
      name: '',
      address: '',
      phone: '',
      email: '',
      subscription_status: 'active',
      subscription_plan: 'basic',
      paddle_customer_id: ''
    },
    validate: {
      name: (value) => !value && 'Company name is required',
      email: (value) => {
        if (!value) return 'Email is required'
        if (!/^\S+@\S+$/.test(value)) return 'Invalid email'
        return null
      },
      phone: (value) => !value && 'Phone number is required'
    }
  })

  const createMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      notifications.show({
        title: 'Success',
        message: 'Company added successfully',
        color: 'green'
      })
      onClose()
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to add company',
        color: 'red'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      notifications.show({
        title: 'Success',
        message: 'Company updated successfully',
        color: 'green'
      })
      onClose()
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update company',
        color: 'red'
      })
    }
  })

  const handleSubmit = (values) => {
    if (isEditing) {
      updateMutation.mutate({ id: initialData.id, ...values })
    } else {
      createMutation.mutate({
        ...values,
        id: uuidv4()
      })
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Company Name"
          required
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Address"
          {...form.getInputProps('address')}
        />
        <TextInput
          label="Phone"
          required
          {...form.getInputProps('phone')}
        />
        <TextInput
          label="Email"
          required
          {...form.getInputProps('email')}
        />
        <Select
          label="Subscription Status"
          required
          data={['active', 'inactive', 'pending']}
          {...form.getInputProps('subscription_status')}
        />
        <Select
          label="Subscription Plan"
          required
          data={['basic', 'premium', 'enterprise']}
          {...form.getInputProps('subscription_plan')}
        />
        <TextInput
          label="Paddle Customer ID"
          {...form.getInputProps('paddle_customer_id')}
        />
        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? 'Update' : 'Add'} Company
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
