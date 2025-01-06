import { supabase } from '../supabase'

export const getDocuments = async () => {
  const { data, error } = await supabase
    .from('documents')
    .select(`
      *,
      users (
        first_name,
        last_name
      )
    `)
  if (error) throw error
  return data
}

export const createDocument = async (document) => {
  const { data, error } = await supabase
    .from('documents')
    .insert(document)
    .select()
  if (error) throw error
  return data[0]
}
