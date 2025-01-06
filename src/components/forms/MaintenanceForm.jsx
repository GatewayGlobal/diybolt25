import { Select, NumberInput, TextInput, Button, Stack } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { createMaintenanceRecord, updateMaintenanceRecord } from '../../lib/api/maintenance'
import { getVehicles } from '../../lib/api/vehicles'
import { getCompanies } from '../../lib/api/companies'

export default function MaintenanceForm({ onClose, initialData }) {
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
    initialValues: initialData ? {
      ...initialData,
      service_date: initialData.service_date ? new Date(initialData.service_date) : null,
      next_service_date: initialData.next_service_date ? new Date(initialData.next_service_date) : null
    } : {
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

  const createMutation = useMutation({
    mutationFn: createMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries(['maintenance'])
      notifications.show({
        title: 'Success',
        message: 'Maintenance record created successfully',
        color: 'green'
      })
      onClose()
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create maintenance record',
        color: 'red'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateMaintenanceRecord,
    onSuccess: () => {
      queryClient.invalidateQueries(['maintenance'])
      notifications.show({
        title: 'Success',
        message: 'Maintenance record updated successfully',
        color: 'green'
      })
      onClose()
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update maintenance record',
        color: 'red'
      })
    }
  })

  const handleSubmit = (values) => {
    // Get the first available company ID if not editing
    const company_id = initialData?.company_id || companies?.[0]?.id
    if (!company_id) {
      notifications.show({
        title: 'Error',
        message: 'No company found',
        color: 'red'
      })
      return
    }

    // Format dates
    const formattedValues = {
      ...values,
      company_id,
      service_date: values.service_date?.toISOString(),
      next_service_date: values.next_service_date?.toISOString()
    }

    // Add UUID only for new records
    if (!initialData) {
      formattedValues.id = crypto.randomUUID()
    }

    if (initialData) {
      updateMutation.mutate(formattedValues)
    } else {
      createMutation.mutate(formattedValues)
    }
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
        <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
          {initialData ? 'Update Maintenance Record' : 'Add Maintenance Record'}
        </Button>
      </Stack>
    </form>
  )
}
