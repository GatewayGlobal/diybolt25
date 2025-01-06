import { Select, NumberInput, TextInput, Button, Stack } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMaintenanceRecord } from '../../lib/api/maintenance'
import { getVehicles } from '../../lib/api/vehicles'
import { getCompanies } from '../../lib/api/companies'

export default function MaintenanceForm({ onClose }) {
  const queryClient = useQueryClient()
  const { data: vehicles } = useQuery({
    queryKey: ['vehicles'],
    queryFn: getVehicles
  })

  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies
  })

  const form = useForm({
    initialValues: {
      vehicle_id: '',
      service_type: '',
      description: '',
      service_date: null,
      cost: 0,
      odometer_reading: 0,
      performed_by: '',
      next_service_date: null
    },
    validate: {
      vehicle_id: (value) => !value && 'Vehicle is required',
      service_type: (value) => !value && 'Service type is required',
      service_date: (value) => !value && 'Service date is required',
      performed_by: (value) => !value && 'Performed by is required'
    }
  })

  const mutation = useMutation({
    mutationFn: createMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries(['maintenance'])
      onClose()
    },
    onError: (error) => {
      console.error('Error creating maintenance record:', error)
      // You might want to show this error to the user through a notification system
    }
  })

  const handleSubmit = (values) => {
    // Get the first available company ID
    const company_id = companies?.[0]?.id
    if (!company_id) {
      console.error('No company found')
      return
    }

    // Format dates and add UUID
    const formattedValues = {
      ...values,
      id: crypto.randomUUID(),
      company_id,
      service_date: values.service_date?.toISOString(),
      next_service_date: values.next_service_date?.toISOString()
    }

    mutation.mutate(formattedValues)
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Select
          label="Vehicle"
          data={vehicles?.map(v => ({
            value: v.id,
            label: `${v.make} ${v.model} (${v.license_plate})`
          })) || []}
          {...form.getInputProps('vehicle_id')}
        />
        <Select
          label="Service Type"
          data={[
            'Oil Change',
            'Tire Rotation',
            'Brake Service',
            'General Maintenance',
            'Repair'
          ]}
          {...form.getInputProps('service_type')}
        />
        <TextInput
          label="Description"
          {...form.getInputProps('description')}
        />
        <DateInput
          label="Service Date"
          {...form.getInputProps('service_date')}
        />
        <NumberInput
          label="Cost"
          {...form.getInputProps('cost')}
        />
        <NumberInput
          label="Odometer Reading"
          {...form.getInputProps('odometer_reading')}
        />
        <TextInput
          label="Performed By"
          {...form.getInputProps('performed_by')}
        />
        <DateInput
          label="Next Service Date"
          {...form.getInputProps('next_service_date')}
        />
        <Button type="submit" loading={mutation.isPending}>Add Maintenance Record</Button>
      </Stack>
    </form>
  )
}
