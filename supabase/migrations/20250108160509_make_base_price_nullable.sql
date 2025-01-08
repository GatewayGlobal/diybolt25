DO $$
BEGIN
    -- First check if the column exists
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'bookings'
        AND column_name = 'base_price'
    ) THEN
        -- If it exists, alter it to be nullable
        ALTER TABLE bookings 
        ALTER COLUMN base_price DROP NOT NULL;
    ELSE
        -- If it doesn't exist, add it as a nullable column
        ALTER TABLE bookings 
        ADD COLUMN base_price DECIMAL(10,2);
    END IF;
END $$;
