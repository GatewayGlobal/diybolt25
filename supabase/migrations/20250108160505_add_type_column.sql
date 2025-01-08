DO $$
BEGIN
    -- Check if the column exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'type'
    ) THEN
        -- Add type column
        ALTER TABLE bookings
        ADD COLUMN type VARCHAR(50);

        -- Add comment to explain the column
        COMMENT ON COLUMN bookings.type IS 'Type of booking';
    END IF;
END $$;
