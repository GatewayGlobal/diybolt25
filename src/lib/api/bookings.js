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
