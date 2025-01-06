import { Select, NumberInput, TextInput, Button, Stack } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { createBooking, updateBooking } from '../../lib/api/bookings'
import { getCustomers } from '../../lib/api/customers'
import { getVehicles } from '../../lib/api/vehicles'
import { getCompanies } from '../../lib/api/companies'

export default function BookingForm({ onClose, initialData }) {
  const queryClient = useQueryClient()
  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  })

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
      start_date: initialData.start_date ? new Date(initialData.start_date) : null,
      end_date: initialData.end_date ? new Date(initialData.end_date) : null
    } : {
      customer_id: '',
      vehicle_id: '',
      start_date: null,
      end_date: null,
      pickup_location: '',
      return_location: '',
      base_price: 0,
      total_price: 0,
      status: 'pending'
    },
    validate: {
      customer_id: (value) => !value && 'Customer is required',
      vehicle_id: (value) => !value && 'Vehicle is required',
      start_date: (value) => !value && 'Start date is required',
      end_date: (value) => !value && 'End date is required',
      pickup_location: (value) => !value && 'Pickup location is required',
      return_location: (value) => !value && 'Return location is required'
    }
  })

  const createMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
      notifications.show({
        title: 'Success',
        message: 'Booking created successfully',
        color: 'green'
      })
      onClose()
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to create booking',
        color: 'red'
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: updateBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
      notifications.show({
        title: 'Success',
        message: 'Booking updated successfully',
        color: 'green'
      })
      onClose()
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update booking',
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

    // Convert dates to ISO strings
    const formattedValues = {
      ...values,
      company_id,
      start_date: values.start_date?.toISOString(),
      end_date: values.end_date?.toISOString()
    }

    // Add UUID only for new bookings
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
          label="Customer"
          data={customers?.map(c => ({
            value: c.id,
            label: `${c.first_name} ${c.last_name}`
          })) || []}
          {...form.getInputProps('customer_id')}
        />
        <Select
          label="Vehicle"
          data={vehicles?.map(v => ({
            value: v.id,
            label: `${v.make} ${v.model} (${v.license_plate})`
          })) || []}
          {...form.getInputProps('vehicle_id')}
        />
        <DateTimePicker
          label="Start Date"
          {...form.getInputProps('start_date')}
        />
        <DateTimePicker
          label="End Date"
          {...form.getInputProps('end_date')}
        />
        <TextInput
          label="Pickup Location"
          {...form.getInputProps('pickup_location')}
        />
        <TextInput
          label="Return Location"
          {...form.getInputProps('return_location')}
        />
        <NumberInput
          label="Base Price"
          {...form.getInputProps('base_price')}
        />
        <NumberInput
          label="Total Price"
          {...form.getInputProps('total_price')}
        />
        <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
          {initialData ? 'Update Booking' : 'Create Booking'}
        </Button>
      </Stack>
    </form>
  )
}
