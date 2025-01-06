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
  if (error) {
    console.error('Error creating maintenance record:', error)
    throw error
  }
  return data[0]
}

export const updateMaintenanceRecord = async (record) => {
  const { data, error } = await supabase
    .from('maintenance_records')
    .update({
      vehicle_id: record.vehicle_id,
      service_type: record.service_type,
      description: record.description,
      service_date: record.service_date,
      next_service_date: record.next_service_date,
      cost: record.cost,
      notes: record.notes,
      status: record.status
    })
    .eq('id', record.id)
    .select()

  if (error) {
    console.error('Error updating maintenance record:', error)
    throw error
  }

  return data[0]
}

export const deleteMaintenanceRecord = async (id) => {
  const { error } = await supabase
    .from('maintenance_records')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting maintenance record:', error)
    throw error
  }
}
