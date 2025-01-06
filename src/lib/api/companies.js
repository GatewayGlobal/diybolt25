import { supabase } from '../supabase'

export const getCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select(`
      *,
      vehicles (
        id
      )
    `)
  if (error) throw error
  return data
}

export const createCompany = async (company) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .insert(company)
      .select()

    if (error) {
      console.error('Error creating company:', error)
      throw new Error(error.message)
    }
    return data[0]
  } catch (error) {
    console.error('Error in createCompany:', error)
    throw error
  }
}

export const updateCompany = async ({ id, ...updates }) => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()

    if (error) {
      console.error('Error updating company:', error)
      throw new Error(error.message)
    }
    return data[0]
  } catch (error) {
    console.error('Error in updateCompany:', error)
    throw error
  }
}

export const deleteCompany = async (id) => {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting company:', error)
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Error in deleteCompany:', error)
    throw error
  }
}
