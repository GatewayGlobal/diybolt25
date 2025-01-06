import { supabase } from '../supabase'
import { v4 as uuidv4 } from 'uuid'

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
  try {
    // Generate a new UUID for the vehicle
    const { id, ...vehicleData } = vehicle
    
    // Convert date objects to ISO strings for Supabase
    const formattedVehicle = {
      id: uuidv4(),
      ...vehicleData,
      insurance_expiry: vehicleData.insurance_expiry?.toISOString(),
      next_service_date: vehicleData.next_service_date?.toISOString()
    }

    const { data, error } = await supabase
      .from('vehicles')
      .insert([formattedVehicle])
      .select()

    if (error) {
      console.error('Error creating vehicle:', error)
      throw new Error(error.message)
    }
    return data[0]
  } catch (error) {
    console.error('Error in createVehicle:', error)
    throw error
  }
}

export const updateVehicle = async ({ id, ...updates }) => {
  // Convert date objects to ISO strings for Supabase
  const formattedUpdates = {
    ...updates,
    insurance_expiry: updates.insurance_expiry?.toISOString(),
    next_service_date: updates.next_service_date?.toISOString()
  }

  const { data, error } = await supabase
    .from('vehicles')
    .update(formattedUpdates)
    .eq('id', id)
    .select()

  if (error) {
    console.error('Error updating vehicle:', error)
    throw new Error(error.message)
  }
  return data[0]
}

export const deleteVehicle = async (id) => {
  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting vehicle:', error)
    throw new Error(error.message)
  }
}
