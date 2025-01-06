import { supabase } from '../supabase'

export const getCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
  if (error) throw error
  return data
}

export const createCustomer = async (customer) => {
  const { data, error } = await supabase
    .from('customers')
    .insert(customer)
    .select()
  if (error) throw error
  return data[0]
}
