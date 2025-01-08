ALTER TABLE bookings 
DROP COLUMN IF EXISTS pickup_location,
DROP COLUMN IF EXISTS return_location;
