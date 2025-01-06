import { Select, NumberInput, TextInput, Button, Stack } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createBooking } from '../../lib/api/bookings'
import { getCustomers } from '../../lib/api/customers'
import { getVehicles } from '../../lib/api/vehicles'
import { getCompanies } from '../../lib/api/companies'

export default function BookingForm({ onClose }) {
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
    initialValues: {
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

  const mutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
      onClose()
    },
    onError: (error) => {
      console.error('Error creating booking:', error)
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

    // Convert dates to ISO strings and add UUID
    const formattedValues = {
      ...values,
      id: crypto.randomUUID(),
      company_id,
      start_date: values.start_date?.toISOString(),
      end_date: values.end_date?.toISOString()
    }

    mutation.mutate(formattedValues)
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
        <Button type="submit" loading={mutation.isPending}>Create Booking</Button>
      </Stack>
    </form>
  )
}
