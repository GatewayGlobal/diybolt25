const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://jszgqfeyohlvxxcrjomw.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzemdxZmV5b2hsdnh4Y3Jqb213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxMzk1NzksImV4cCI6MjA1MTcxNTU3OX0.GY3TN7n_wVjB5h4MS68Ie0r0Mj9Kjc9XU4WZ8SnjW38'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestUser() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
    })

    if (error) {
      console.error('Error creating test user:', error.message)
      return
    }

    console.log('Test user created successfully:', data)
    console.log('\nYou can now login with:')
    console.log('Email: test@example.com')
    console.log('Password: testpassword123')
  } catch (error) {
    console.error('Error:', error)
  }
}

createTestUser()
