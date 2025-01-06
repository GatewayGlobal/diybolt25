import { supabase } from '../supabase'

export const getVehicles = async () => {
  const { data, error } = await supabase
    .from('vehicles')
    .select(`
      *,
      vehicle_categories (
        name,
        daily_rate
      )
    `)
  if (error) throw error
  return data
}

export const createVehicle = async (vehicle) => {
  const { data, error } = await supabase
    .from('vehicles')
    .insert([{ ...vehicle, company_id: '00000000-0000-0000-0000-000000000000' }])
    .select()
  if (error) throw error
  return data[0]
}

export const updateVehicle = async ({ id, ...updates }) => {
  const { data, error } = await supabase
    .from('vehicles')
    .update(updates)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

export const deleteVehicle = async (id) => {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)
  if (error) throw error
}
