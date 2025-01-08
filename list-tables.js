import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jszgqfeyohlvxxcrjomw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzemdxZmV5b2hsdnh4Y3Jqb213Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYzNDc2MjUsImV4cCI6MjA1MTkyMzYyNX0.85lj07o7h6dxKnCJT-eiGHke2ZqWqmz4v9eohKr8fQo';

const supabase = createClient(supabaseUrl, supabaseKey);

const listTables = async () => {
  try {
    const { data, error } = await supabase.rpc('get_columns', {
      p_table_name: 'bookings'
    });

    if (error) {
      console.error('Error fetching columns:', error);
      return;
    }

    console.log('Bookings table columns:', data);

  } catch (error) {
    console.error('Error:', error);
  }
};

listTables().catch(console.error);
