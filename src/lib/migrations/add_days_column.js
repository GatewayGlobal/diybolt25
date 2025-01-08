import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

const addDaysColumn = async () => {
  try {
    // First check if the column exists
    const { data: existingColumns, error: checkError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1)
    
    if (checkError) throw checkError

    // Check if days column exists
    const hasColumn = existingColumns && existingColumns[0] && 'days' in existingColumns[0]
    if (hasColumn) {
      console.log('Days column already exists')
      return
    }

    // Add the days column using REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        query: `
          ALTER TABLE bookings
          ADD COLUMN days integer
          GENERATED ALWAYS AS (
            extract(day from (end_date - start_date))::integer
          ) STORED;
        `
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to add column: ${await response.text()}`)
    }

    console.log('Days column added successfully')
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

addDaysColumn()
  .catch(console.error)
