-- Migration: Remove duplicate property prices
-- Date: 2025-12-10
-- Description: Removes duplicate price records from property_prices table,
--              keeping only the most recent price for each property and operation type combination.
--              This cleanup is needed after implementing the price update fix that prevents
--              future duplicates from being created.


DO $$
DECLARE
    duplicate_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO duplicate_count
    FROM property_prices pp1
    WHERE EXISTS (
        SELECT 1
        FROM property_prices pp2
        WHERE pp1.property_id = pp2.property_id
          AND pp1.operation_type_id = pp2.operation_type_id
          AND pp1.id < pp2.id
    );
    
    RAISE NOTICE 'Found % duplicate price records to remove', duplicate_count;
END $$;

DELETE FROM property_prices
WHERE id NOT IN (
    SELECT MAX(id)
    FROM property_prices
    GROUP BY property_id, operation_type_id
);

DO $$
DECLARE
    remaining_duplicates INTEGER;
    total_prices INTEGER;
BEGIN
    SELECT COUNT(*) INTO remaining_duplicates
    FROM (
        SELECT property_id, operation_type_id, COUNT(*) as cnt
        FROM property_prices
        GROUP BY property_id, operation_type_id
        HAVING COUNT(*) > 1
    ) duplicates;
    
    SELECT COUNT(*) INTO total_prices
    FROM property_prices;
    
    RAISE NOTICE 'Cleanup complete. Total prices: %, Remaining duplicates: %', total_prices, remaining_duplicates;
    
    IF remaining_duplicates > 0 THEN
        RAISE EXCEPTION 'Cleanup failed: % duplicate groups still exist', remaining_duplicates;
    END IF;
END $$;
