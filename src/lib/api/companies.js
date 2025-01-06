import { supabase } from '../supabase'

export const getCompanies = async () => {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
  if (error) throw error
  return data
}

export const createCompany = async (company) => {
  const { data, error } = await supabase
    .from('companies')
    .insert(company)
    .select()
  if (error) throw error
  return data[0]
}
