import { supabase } from '../supabase'

export const getCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
  if (error) throw error
  return data
}

export const createCustomer = async (customer) => {
  // Ensure we only send valid fields to Supabase
  const validCustomer = {
    id: self.crypto.randomUUID(), // Use Web Crypto API
    first_name: customer.first_name,
    last_name: customer.last_name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    driver_license_number: customer.driver_license_number,
    driver_license_expiry: customer.driver_license_expiry,
    status: customer.status || 'active',
    company_id: customer.company_id
  }

  const { data, error } = await supabase
    .from('customers')
    .insert([validCustomer])
    .select()

  if (error) {
    console.error('Error creating customer:', error)
    throw error
  }

  return data[0]
}

export const updateCustomer = async (customer) => {
  const { data, error } = await supabase
    .from('customers')
    .update({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      driver_license_number: customer.driver_license_number,
      driver_license_expiry: customer.driver_license_expiry,
      status: customer.status,
      company_id: customer.company_id
    })
    .eq('id', customer.id)
    .select()

  if (error) {
    console.error('Error updating customer:', error)
    throw error
  }

  return data[0]
}

export const deleteCustomer = async (id) => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting customer:', error)
    throw error
  }
}
