ALTER TABLE addresses
ADD COLUMN IF NOT EXISTS street VARCHAR(255),
ADD COLUMN IF NOT EXISTS number VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_addresses_street ON addresses(street);

DO $$
DECLARE
    addr_record RECORD;
    parsed_street TEXT;
    parsed_number TEXT;
BEGIN
    FOR addr_record IN SELECT id, full_address FROM addresses WHERE street IS NULL OR street = '' LOOP
        IF addr_record.full_address IS NOT NULL AND addr_record.full_address != '' THEN
            SELECT 
                TRIM(SUBSTRING(addr_record.full_address FROM '^([^0-9]+)')) INTO parsed_street;
            
            SELECT 
                TRIM(SUBSTRING(addr_record.full_address FROM '\s+(\d+(?:\s+[A-Za-z0-9]+)?)')) INTO parsed_number;
            
            IF parsed_street IS NULL OR parsed_street = '' THEN
                parsed_street := addr_record.full_address;
            END IF;
            
            UPDATE addresses
            SET street = parsed_street,
                number = CASE WHEN parsed_number IS NULL OR parsed_number = '' THEN NULL ELSE parsed_number END
            WHERE id = addr_record.id;
        END IF;
    END LOOP;
END $$;

