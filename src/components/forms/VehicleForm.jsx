import { TextInput, NumberInput, Select, Button, Stack, Group } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { createVehicle, updateVehicle } from '../../lib/api/vehicles'
import { getCompanies } from '../../lib/api/companies'

export default function VehicleForm({ onClose, initialData = null }) {
  const queryClient = useQueryClient()
  const isEditing = !!initialData

  const form = useForm({
    initialValues: {
      make: initialData?.make || '',
      model: initialData?.model || '',
      year: initialData?.year || new Date().getFullYear(),
      daily_rate: initialData?.daily_rate || 0,
      color: initialData?.color || '',
      license_plate: initialData?.license_plate || '',
      vin: initialData?.vin || '',
      status: initialData?.status || 'available',
      mileage: initialData?.mileage || 0,
      fuel_type: initialData?.fuel_type || '',
      insurance_expiry: initialData?.insurance_expiry ? new Date(initialData.insurance_expiry) : null,
      next_service_date: initialData?.next_service_date ? new Date(initialData.next_service_date) : null,
      company_id: initialData?.company_id || ''
    },
    validate: {
      make: (value) => !value && 'Make is required',
      model: (value) => !value && 'Model is required',
      license_plate: (value) => !value && 'License plate is required',
      vin: (value) => !value && 'VIN is required',
      company_id: (value) => !value && 'Company is required'
    }
  })

  const createMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles'])
      notifications.show({
        title: 'Success',
        message: 'Vehicle added successfully',
        color: 'green'
      })
      onClose()
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to add vehicle',
        color: 'red'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles'])
      notifications.show({
        title: 'Success',
        message: 'Vehicle updated successfully',
        color: 'green'
      })
      onClose()
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update vehicle',
        color: 'red'
      })
    }
  })

  const handleSubmit = (values) => {
    // Ensure dates are properly converted to Date objects if they exist
    const formattedValues = {
      ...values,
      insurance_expiry: values.insurance_expiry ? new Date(values.insurance_expiry) : null,
      next_service_date: values.next_service_date ? new Date(values.next_service_date) : null
    }

    if (isEditing) {
      updateMutation.mutate({ id: initialData.id, ...formattedValues })
    } else {
      createMutation.mutate(formattedValues)
    }
  }

  // Fetch companies for the dropdown
  const { data: companies = [] } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies
  })

  // Transform companies data for the Select component
  const companyOptions = companies.map(company => ({
    value: company.id,
    label: company.name
  }))

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput label="Make" required {...form.getInputProps('make')} />
        <TextInput label="Model" required {...form.getInputProps('model')} />
        <NumberInput label="Year" required {...form.getInputProps('year')} />
        <NumberInput label="Daily Rate" required {...form.getInputProps('daily_rate')} />
        <TextInput label="Color" {...form.getInputProps('color')} />
        <TextInput label="License Plate" required {...form.getInputProps('license_plate')} />
        <TextInput label="VIN" required {...form.getInputProps('vin')} />
        <Select
          label="Status"
          data={['available', 'rented', 'maintenance', 'retired']}
          {...form.getInputProps('status')}
        />
        <NumberInput label="Mileage" {...form.getInputProps('mileage')} />
        <Select
          label="Fuel Type"
          data={['gasoline', 'diesel', 'electric', 'hybrid']}
          {...form.getInputProps('fuel_type')}
        />
        <DateInput
          label="Insurance Expiry"
          {...form.getInputProps('insurance_expiry')}
        />
        <DateInput
          label="Next Service Date"
          {...form.getInputProps('next_service_date')}
        />
        <Select
          label="Company"
          required
          data={companyOptions}
          {...form.getInputProps('company_id')}
        />
        <Group justify="flex-end">
          <Button variant="subtle" onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? 'Update' : 'Add'} Vehicle
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
