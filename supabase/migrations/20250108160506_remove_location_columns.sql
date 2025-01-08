DO $$
BEGIN
    -- Check if pickup_location column exists and remove it
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'pickup_location'
    ) THEN
        ALTER TABLE bookings DROP COLUMN pickup_location;
    END IF;

    -- Check if return_location column exists and remove it
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'return_location'
    ) THEN
        ALTER TABLE bookings DROP COLUMN return_location;
    END IF;
END $$;
