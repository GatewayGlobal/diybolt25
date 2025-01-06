import { supabase } from '../supabase'

export const getMaintenanceRecords = async () => {
  const { data, error } = await supabase
    .from('maintenance_records')
    .select(`
      *,
      vehicles (
        make,
        model,
        license_plate
      )
    `)
  if (error) throw error
  return data
}

export const createMaintenanceRecord = async (record) => {
  const { data, error } = await supabase
    .from('maintenance_records')
    .insert(record)
    .select()
  if (error) throw error
  return data[0]
}
