import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = 'https://jszgqfeyohlvxxcrjomw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzemdxZmV5b2hsdnh4Y3Jqb213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMzk1NzksImV4cCI6MjA1MTcxNTU3OX0.GY3TN7n_wVjB5h4MS68Ie0r0Mj9Kjc9XU4WZ8SnjW38';

const supabase = createClient(supabaseUrl, supabaseKey);

const testCustomers = async () => {
  try {
    // First check existing customers structure
    const { data: customers, error: selectError } = await supabase
      .from('customers')
      .select('*')
      .limit(1);
    
    console.log('Current customer structure:', customers);
    console.log('Select error:', selectError);

    // Use the company_id from existing customer for our test
    const validCompanyId = customers[0].company_id;

    // Test inserting a customer with all form fields
    const testCustomer = {
      id: crypto.randomUUID(),
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@test.com',
      phone: '123-456-7890',
      address: '123 Test St',
      driver_license_number: 'DL123456',
      driver_license_expiry: '2025-12-31',
      status: 'active',
      company_id: validCompanyId
    };

    const { data: inserted, error: insertError } = await supabase
      .from('customers')
      .insert([testCustomer])
      .select();

    console.log('Inserted customer:', inserted);
    console.log('Insert error:', insertError);

  } catch (error) {
    console.error('Error:', error);
  }
};

testCustomers();
