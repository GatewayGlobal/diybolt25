import { TextInput, NumberInput, Select, Button, Stack, Group } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createVehicle, updateVehicle } from '../../lib/api/vehicles'

export default function VehicleForm({ onClose, initialData = null }) {
  const queryClient = useQueryClient()
  const isEditing = !!initialData

  const form = useForm({
    initialValues: initialData || {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      license_plate: '',
      vin: '',
      status: 'available',
      mileage: 0,
      fuel_type: '',
      insurance_expiry: null,
      next_service_date: null
    },
    validate: {
      make: (value) => !value && 'Make is required',
      model: (value) => !value && 'Model is required',
      license_plate: (value) => !value && 'License plate is required',
      vin: (value) => !value && 'VIN is required'
    }
  })

  const createMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles'])
      onClose()
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles'])
      onClose()
    }
  })

  const handleSubmit = (values) => {
    if (isEditing) {
      updateMutation.mutate({ id: initialData.id, ...values })
    } else {
      createMutation.mutate(values)
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput label="Make" required {...form.getInputProps('make')} />
        <TextInput label="Model" required {...form.getInputProps('model')} />
        <NumberInput label="Year" required {...form.getInputProps('year')} />
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
