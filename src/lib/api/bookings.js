import { supabase } from '../supabase'

export const getBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      customers (
        first_name,
        last_name,
        email
      ),
      vehicles (
        make,
        model,
        license_plate
      )
    `)
  if (error) throw error
  return data
}

export const createBooking = async (booking) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(booking)
    .select()
  if (error) throw error
  return data[0]
}

export const updateBooking = async (booking) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({
      customer_id: booking.customer_id,
      vehicle_id: booking.vehicle_id,
      start_date: booking.start_date,
      end_date: booking.end_date,
      status: booking.status,
      total_price: booking.total_price
    })
    .eq('id', booking.id)
    .select()

  if (error) {
    console.error('Error updating booking:', error)
    throw error
  }

  return data[0]
}

export const deleteBooking = async (id) => {
  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting booking:', error)
    throw error
  }
}
