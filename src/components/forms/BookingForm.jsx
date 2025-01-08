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

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = (days, vehicle_id) => {
    const vehicle = vehicles?.find(v => v.id === vehicle_id);
    if (!vehicle) return 0;
    return days * vehicle.daily_rate;
  };

  const form = useForm({
    initialValues: initialData ? {
      ...initialData,
      start_date: initialData.start_date ? new Date(initialData.start_date) : null,
      end_date: initialData.end_date ? new Date(initialData.end_date) : null,
      days: initialData.start_date && initialData.end_date ? 
        calculateDays(new Date(initialData.start_date), new Date(initialData.end_date)) : 0
    } : {
      customer_id: '',
      vehicle_id: '',
      start_date: null,
      end_date: null,
      total_price: 0,
      days: 0,
      status: 'pending'
    },
    validate: {
      customer_id: (value) => !value && 'Customer is required',
      vehicle_id: (value) => !value && 'Vehicle is required',
      start_date: (value) => !value && 'Start date is required',
      end_date: (value) => !value && 'End date is required',
    }
  })
  
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

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

  // Update days and total price when dates or vehicle changes
  const handleDateChange = (field, value) => {
    form.setFieldValue(field, value);
    
    const start = field === 'start_date' ? value : form.values.start_date;
    const end = field === 'end_date' ? value : form.values.end_date;
    
    if (start && end) {
      const days = calculateDays(start, end);
      form.setFieldValue('days', days);
      const total = calculateTotalPrice(days, form.values.vehicle_id);
      form.setFieldValue('total_price', total);
    }
  };

  const handleVehicleChange = (value) => {
    form.setFieldValue('vehicle_id', value);
    if (form.values.start_date && form.values.end_date) {
      const days = calculateDays(form.values.start_date, form.values.end_date);
      const total = calculateTotalPrice(days, value);
      form.setFieldValue('total_price', total);
    }
  };

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

    // Calculate final days and total price
    const calculatedDays = calculateDays(values.start_date, values.end_date);
    const total_price = calculateTotalPrice(calculatedDays, values.vehicle_id);

    // Convert dates to ISO strings and remove days since it's calculated on display
    const { days: _, ...valuesWithoutDays } = values;
    // Get the selected vehicle's daily rate to use as base price
    const selectedVehicle = vehicles?.find(v => v.id === values.vehicle_id);
    const base_price = selectedVehicle?.daily_rate || 0;

    const formattedValues = {
      ...valuesWithoutDays,
      company_id,
      base_price,
      total_price,
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
            label: `${v.make} ${v.model} (${v.license_plate}) - $${v.daily_rate}/day`
          })) || []}
          onChange={handleVehicleChange}
          value={form.values.vehicle_id}
        />
        <DateTimePicker
          label="Start Date"
          onChange={(value) => handleDateChange('start_date', value)}
          value={form.values.start_date}
        />
        <DateTimePicker
          label="End Date"
          onChange={(value) => handleDateChange('end_date', value)}
          value={form.values.end_date}
        />
        <NumberInput
          label="Number of Days"
          readOnly
          value={form.values.days}
        />
        <NumberInput
          label="Total Price"
          readOnly
          value={form.values.total_price}
        />
        <Select
          label="Status"
          data={statusOptions}
          {...form.getInputProps('status')}
        />
        <Button type="submit" loading={createMutation.isPending || updateMutation.isPending}>
          {initialData ? 'Update Booking' : 'Create Booking'}
        </Button>
      </Stack>
    </form>
  )
}
