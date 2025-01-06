import { TextInput, Button, Stack } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCustomer } from '../../lib/api/customers'

export default function CustomerForm({ onClose }) {
  const queryClient = useQueryClient()
  const form = useForm({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
      driver_license_number: '',
      driver_license_expiry: null,
      status: 'active'
    },
    validate: {
      first_name: (value) => !value && 'First name is required',
      last_name: (value) => !value && 'Last name is required',
      email: (value) => !/^\S+@\S+$/.test(value) && 'Invalid email',
      phone: (value) => !value && 'Phone is required',
      driver_license_number: (value) => !value && 'Driver license number is required'
    }
  })

  const mutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers'])
      onClose()
    }
  })

  const handleSubmit = (values) => {
    mutation.mutate({
      ...values,
      company_id: '00000000-0000-0000-0000-000000000000' // Replace with actual company ID
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput label="First Name" {...form.getInputProps('first_name')} />
        <TextInput label="Last Name" {...form.getInputProps('last_name')} />
        <TextInput label="Email" type="email" {...form.getInputProps('email')} />
        <TextInput label="Phone" {...form.getInputProps('phone')} />
        <TextInput label="Address" {...form.getInputProps('address')} />
        <TextInput
          label="Driver License Number"
          {...form.getInputProps('driver_license_number')}
        />
        <DateInput
          label="Driver License Expiry"
          {...form.getInputProps('driver_license_expiry')}
        />
        <Button type="submit" loading={mutation.isPending}>Add Customer</Button>
      </Stack>
    </form>
  )
}
