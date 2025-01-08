CREATE OR REPLACE FUNCTION get_columns(p_table_name text)
RETURNS text[]
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN ARRAY(
        SELECT column_name::text
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = p_table_name
        ORDER BY ordinal_position
    );
END;
$$;
