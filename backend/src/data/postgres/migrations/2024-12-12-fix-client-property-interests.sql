-- ========================================================
-- MIGRATION: Fix Missing client_property_interests Table
-- Date: 2024-12-12
-- Description: Create client_property_interests table that was
--              skipped during initial migration
-- ========================================================

-- Create client_property_interests table
CREATE TABLE IF NOT EXISTS client_property_interests (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    CONSTRAINT fk_client_property_interests_client 
        FOREIGN KEY (client_id) 
        REFERENCES clients(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_client_property_interests_property 
        FOREIGN KEY (property_id) 
        REFERENCES properties(id) 
        ON DELETE CASCADE,
    CONSTRAINT uk_client_property_interest 
        UNIQUE (client_id, property_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_client_property_interests_client 
    ON client_property_interests(client_id);

CREATE INDEX IF NOT EXISTS idx_client_property_interests_property 
    ON client_property_interests(property_id);

-- Add comment
COMMENT ON TABLE client_property_interests IS 
    'Properties of interest for Lead clients (many-to-many relationship)';
