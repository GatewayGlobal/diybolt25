DO $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'days'
    ) THEN
        -- Add days column as a computed column
        ALTER TABLE bookings
        ADD COLUMN days integer
        GENERATED ALWAYS AS (
            EXTRACT(day FROM (end_date - start_date))::integer
        ) STORED;

        -- Add comment to explain the column
        COMMENT ON COLUMN bookings.days IS 'Number of days between start_date and end_date, automatically computed';
    END IF;
END $$;
