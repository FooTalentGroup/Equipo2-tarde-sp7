-- ========================================================
-- REAL ESTATE MANAGEMENT SYSTEM DATABASE SCHEMA
-- PostgreSQL
-- ========================================================

-- ========================================================
-- 1. BASE CATALOGS AND SERVICES
-- ========================================================

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    CONSTRAINT chk_roles_name CHECK (name IN ('admin', 'agent'))
);

COMMENT ON TABLE roles IS 'User roles: admin or agent (lowercase)';
COMMENT ON COLUMN roles.name IS 'admin or agent (lowercase)';

CREATE TABLE IF NOT EXISTS currency_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    symbol VARCHAR(5) NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS payment_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS consultation_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

COMMENT ON TABLE contact_categories IS 'Categories: Lead, Tenant, Owner';

CREATE TABLE IF NOT EXISTS property_search_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

COMMENT ON TABLE property_search_types IS 'Types: House, PH, Apartment';

CREATE TABLE IF NOT EXISTS property_ages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS orientations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS dispositions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS property_situations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS property_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS property_operation_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS property_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

COMMENT ON TABLE property_statuses IS 'Legal/Commercial Status: For Sale, Rented, etc.';

CREATE TABLE IF NOT EXISTS visibility_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

COMMENT ON TABLE visibility_statuses IS 'Marketing Status: Published, Internal Only, Archived';

CREATE TABLE IF NOT EXISTS catalog_services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

COMMENT ON TABLE catalog_services IS 'Examples: Running water, Natural gas, Pool';



CREATE TABLE IF NOT EXISTS countries (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS provinces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_id INTEGER NOT NULL,
    CONSTRAINT fk_provinces_country FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    province_id INTEGER NOT NULL,
    CONSTRAINT fk_cities_province FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE RESTRICT
);



CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    active BOOLEAN DEFAULT true,
    deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role_id INTEGER NOT NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_active ON users(active) WHERE active = true;

CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    dni VARCHAR(15),
    phone VARCHAR(15) NOT NULL,
    property_interest_phone VARCHAR(15),
    address VARCHAR(255),
    notes TEXT,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted BOOLEAN DEFAULT false,
    contact_category_id INTEGER NOT NULL,
    interest_zone VARCHAR(255),
    purchase_interest BOOLEAN DEFAULT false,
    rental_interest BOOLEAN DEFAULT false,
    property_search_type_id INTEGER,
    city_id INTEGER,
    CONSTRAINT fk_clients_contact_category FOREIGN KEY (contact_category_id) REFERENCES contact_categories(id) ON DELETE RESTRICT,
    CONSTRAINT fk_clients_property_search_type FOREIGN KEY (property_search_type_id) REFERENCES property_search_types(id) ON DELETE SET NULL,
    CONSTRAINT fk_clients_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
);

CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_dni ON clients(dni);
CREATE INDEX idx_clients_contact_category ON clients(contact_category_id);
CREATE INDEX idx_clients_city ON clients(city_id);

CREATE TABLE IF NOT EXISTS client_property_interests (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    CONSTRAINT fk_client_property_interests_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    CONSTRAINT fk_client_property_interests_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT uk_client_property_interest UNIQUE (client_id, property_id)
);

CREATE INDEX idx_client_property_interests_client ON client_property_interests(client_id);
CREATE INDEX idx_client_property_interests_property ON client_property_interests(property_id);

COMMENT ON TABLE client_property_interests IS 'Properties of interest for Lead clients (many-to-many relationship)';


CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(50),
    full_address VARCHAR(500) NOT NULL,
    neighborhood VARCHAR(150),
    postal_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    city_id INTEGER NOT NULL,
    CONSTRAINT fk_addresses_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE RESTRICT
);

COMMENT ON COLUMN addresses.street IS 'Street name without number';
COMMENT ON COLUMN addresses.number IS 'Street number, can include floor/unit (e.g., "1234", "1234 4B")';
COMMENT ON COLUMN addresses.full_address IS 'Complete address string for display (street + number + neighborhood)';

CREATE INDEX idx_addresses_city ON addresses(city_id);
CREATE INDEX idx_addresses_street ON addresses(street);
CREATE INDEX idx_addresses_coordinates ON addresses(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE TABLE IF NOT EXISTS properties (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    publication_date DATE DEFAULT CURRENT_DATE,
    featured_web BOOLEAN DEFAULT false,
    visibility_status_id INTEGER NOT NULL,
    captured_by_user_id INTEGER NOT NULL,
    branch_name VARCHAR(100),
    appraiser VARCHAR(100),
    producer VARCHAR(100),
    maintenance_user VARCHAR(100),
    keys_location VARCHAR(100),
    internal_comments TEXT,
    social_media_info TEXT,
    operation_commission_percentage DECIMAL(5, 2),
    producer_commission_percentage DECIMAL(5, 2),
    land_area DECIMAL(10, 2),
    semi_covered_area DECIMAL(10, 2),
    covered_area DECIMAL(10, 2),
    total_built_area DECIMAL(10, 2),
    uncovered_area DECIMAL(10, 2),
    total_area DECIMAL(10, 2),
    rooms_count INTEGER,
    bedrooms_count INTEGER,
    bathrooms_count INTEGER,
    toilets_count INTEGER,
    parking_spaces_count INTEGER,
    floors_count INTEGER,
    zoning VARCHAR(50),
    property_type_id INTEGER NOT NULL,
    property_status_id INTEGER NOT NULL,
    owner_id INTEGER,
    situation_id INTEGER,
    age_id INTEGER,
    orientation_id INTEGER,
    disposition_id INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_properties_captured_by_user FOREIGN KEY (captured_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_properties_owner FOREIGN KEY (owner_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_properties_property_type FOREIGN KEY (property_type_id) REFERENCES property_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_properties_property_status FOREIGN KEY (property_status_id) REFERENCES property_statuses(id) ON DELETE RESTRICT,
    CONSTRAINT fk_properties_visibility_status FOREIGN KEY (visibility_status_id) REFERENCES visibility_statuses(id) ON DELETE RESTRICT,
    CONSTRAINT fk_properties_situation FOREIGN KEY (situation_id) REFERENCES property_situations(id) ON DELETE SET NULL,
    CONSTRAINT fk_properties_age FOREIGN KEY (age_id) REFERENCES property_ages(id) ON DELETE SET NULL,
    CONSTRAINT fk_properties_orientation FOREIGN KEY (orientation_id) REFERENCES orientations(id) ON DELETE SET NULL,
    CONSTRAINT fk_properties_disposition FOREIGN KEY (disposition_id) REFERENCES dispositions(id) ON DELETE SET NULL
);

CREATE INDEX idx_properties_captured_by_user ON properties(captured_by_user_id);
CREATE INDEX idx_properties_owner ON properties(owner_id);
CREATE INDEX idx_properties_property_type ON properties(property_type_id);
CREATE INDEX idx_properties_property_status ON properties(property_status_id);
CREATE INDEX idx_properties_visibility_status ON properties(visibility_status_id);
CREATE INDEX idx_properties_featured_web ON properties(featured_web) WHERE featured_web = true;
CREATE INDEX idx_properties_publication_date ON properties(publication_date);

CREATE TABLE IF NOT EXISTS property_prices (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL,
    price DECIMAL(15, 2) NOT NULL,
    currency_type_id INTEGER NOT NULL,
    operation_type_id INTEGER NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_property_prices_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_property_prices_currency FOREIGN KEY (currency_type_id) REFERENCES currency_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_property_prices_operation_type FOREIGN KEY (operation_type_id) REFERENCES property_operation_types(id) ON DELETE RESTRICT
);

CREATE INDEX idx_property_prices_property ON property_prices(property_id);
CREATE INDEX idx_property_prices_updated_at ON property_prices(updated_at);

CREATE TABLE IF NOT EXISTS property_multimedia (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    media_type VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    CONSTRAINT fk_property_multimedia_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE INDEX idx_property_multimedia_property ON property_multimedia(property_id);
CREATE INDEX idx_property_multimedia_primary ON property_multimedia(is_primary) WHERE is_primary = true;

CREATE TABLE IF NOT EXISTS property_documents (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL,
    client_id INTEGER,
    document_name VARCHAR(150) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_property_documents_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_property_documents_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE INDEX idx_property_documents_property ON property_documents(property_id);
CREATE INDEX idx_property_documents_client ON property_documents(client_id);

CREATE TABLE IF NOT EXISTS property_addresses (
    property_id INTEGER NOT NULL,
    address_id INTEGER NOT NULL,
    PRIMARY KEY (property_id, address_id),
    CONSTRAINT fk_property_addresses_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_property_addresses_address FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_services (
    property_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    PRIMARY KEY (property_id, service_id),
    CONSTRAINT fk_property_services_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_property_services_service FOREIGN KEY (service_id) REFERENCES catalog_services(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_characteristics (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    CONSTRAINT fk_property_characteristics_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE INDEX idx_property_characteristics_property ON property_characteristics(property_id);


CREATE TABLE IF NOT EXISTS client_consultations (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    property_id INTEGER,
    consultation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    consultation_type_id INTEGER NOT NULL,
    assigned_user_id INTEGER,
    message TEXT NOT NULL,
    response TEXT,
    responded_by_user_id INTEGER,
    response_date TIMESTAMP,
    CONSTRAINT fk_client_consultations_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    CONSTRAINT fk_client_consultations_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    CONSTRAINT fk_client_consultations_type FOREIGN KEY (consultation_type_id) REFERENCES consultation_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_client_consultations_user FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_client_consultations_responded_by FOREIGN KEY (responded_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_client_consultations_client ON client_consultations(client_id);
CREATE INDEX idx_client_consultations_property ON client_consultations(property_id);
CREATE INDEX idx_client_consultations_date ON client_consultations(consultation_date);
CREATE INDEX idx_client_consultations_responded_by ON client_consultations(responded_by_user_id);

ALTER TABLE client_consultations 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_client_consultations_is_read 
ON client_consultations(is_read) WHERE is_read = false;

CREATE TABLE IF NOT EXISTS crm_interactions (
    id SERIAL PRIMARY KEY,
    event_type_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    scheduled_datetime TIMESTAMP NOT NULL,
    client_id INTEGER,
    property_id INTEGER,
    responsible_user_id INTEGER NOT NULL,
    comments TEXT,
    status VARCHAR(50) DEFAULT 'Scheduled',
    CONSTRAINT fk_crm_interactions_event_type FOREIGN KEY (event_type_id) REFERENCES event_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_crm_interactions_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    CONSTRAINT fk_crm_interactions_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    CONSTRAINT fk_crm_interactions_user FOREIGN KEY (responsible_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_crm_interactions_client ON crm_interactions(client_id);
CREATE INDEX idx_crm_interactions_property ON crm_interactions(property_id);
CREATE INDEX idx_crm_interactions_user ON crm_interactions(responsible_user_id);
CREATE INDEX idx_crm_interactions_scheduled ON crm_interactions(scheduled_datetime);

CREATE TABLE IF NOT EXISTS client_rentals (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    external_reference VARCHAR(50),
    contract_start_date DATE,
    contract_end_date DATE,
    next_increase_date DATE,
    remind_increase BOOLEAN DEFAULT false,
    remind_contract_end BOOLEAN DEFAULT false,
    CONSTRAINT fk_client_rentals_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_client_rentals_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT
);

CREATE INDEX idx_client_rentals_client ON client_rentals(client_id);
CREATE INDEX idx_client_rentals_property ON client_rentals(property_id);

CREATE TABLE IF NOT EXISTS property_sales (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL,
    buyer_client_id INTEGER NOT NULL,
    sale_date DATE NOT NULL,
    final_amount DECIMAL(15, 2) NOT NULL,
    currency_type_id INTEGER NOT NULL,
    seller_user_id INTEGER NOT NULL,
    CONSTRAINT fk_property_sales_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT,
    CONSTRAINT fk_property_sales_buyer FOREIGN KEY (buyer_client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    CONSTRAINT fk_property_sales_currency FOREIGN KEY (currency_type_id) REFERENCES currency_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_property_sales_seller FOREIGN KEY (seller_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_property_sales_property ON property_sales(property_id);
CREATE INDEX idx_property_sales_buyer ON property_sales(buyer_client_id);
CREATE INDEX idx_property_sales_date ON property_sales(sale_date);

CREATE TABLE IF NOT EXISTS rentals (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL,
    client_rental_id INTEGER NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    next_increase_date DATE,
    monthly_amount DECIMAL(10, 2) NOT NULL,
    currency_type_id INTEGER NOT NULL,
    created_by_user_id INTEGER NOT NULL,
    remind_increase BOOLEAN DEFAULT false,
    remind_contract_end BOOLEAN DEFAULT false,
    CONSTRAINT fk_rentals_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT,
    CONSTRAINT fk_rentals_client_rental FOREIGN KEY (client_rental_id) REFERENCES client_rentals(id) ON DELETE RESTRICT,
    CONSTRAINT fk_rentals_currency FOREIGN KEY (currency_type_id) REFERENCES currency_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_rentals_created_by_user FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_rentals_property ON rentals(property_id);
CREATE INDEX idx_rentals_client_rental ON rentals(client_rental_id);
CREATE INDEX idx_rentals_start_date ON rentals(start_date);
CREATE INDEX idx_rentals_end_date ON rentals(end_date) WHERE end_date IS NOT NULL;

CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    rental_id INTEGER NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reference VARCHAR(100),
    payment_method_id INTEGER NOT NULL,
    payment_status_id INTEGER NOT NULL,
    CONSTRAINT fk_payments_rental FOREIGN KEY (rental_id) REFERENCES rentals(id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_method FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE RESTRICT,
    CONSTRAINT fk_payments_status FOREIGN KEY (payment_status_id) REFERENCES payment_statuses(id) ON DELETE RESTRICT
);

CREATE INDEX idx_payments_rental ON payments(rental_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(payment_status_id);

CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency_type_id INTEGER NOT NULL,
    registered_date DATE DEFAULT CURRENT_DATE,
    frequency VARCHAR(50),
    CONSTRAINT fk_expenses_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_expenses_currency FOREIGN KEY (currency_type_id) REFERENCES currency_types(id) ON DELETE RESTRICT
);

CREATE INDEX idx_expenses_property ON expenses(property_id);
CREATE INDEX idx_expenses_date ON expenses(registered_date);


CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL,
    previous_price DECIMAL(15, 2),
    new_price DECIMAL(15, 2) NOT NULL,
    currency_type_id INTEGER NOT NULL,
    operation_type_id INTEGER NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responsible_user_id INTEGER NOT NULL,
    CONSTRAINT fk_price_history_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_price_history_currency FOREIGN KEY (currency_type_id) REFERENCES currency_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_price_history_operation_type FOREIGN KEY (operation_type_id) REFERENCES property_operation_types(id) ON DELETE RESTRICT,
    CONSTRAINT fk_price_history_user FOREIGN KEY (responsible_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_price_history_property ON price_history(property_id);
CREATE INDEX idx_price_history_changed_at ON price_history(changed_at);

CREATE TABLE IF NOT EXISTS property_activities (
    id SERIAL PRIMARY KEY,
    property_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    action_type VARCHAR(50),
    title VARCHAR(100),
    description TEXT,
    activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_property_activities_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT fk_property_activities_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_property_activities_property ON property_activities(property_id);
CREATE INDEX idx_property_activities_user ON property_activities(user_id);
CREATE INDEX idx_property_activities_date ON property_activities(activity_date);

CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    affected_table VARCHAR(100) NOT NULL,
    affected_record_id INTEGER NOT NULL,
    action VARCHAR(50) NOT NULL,
    previous_data JSONB,
    new_data JSONB,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_audit_logs_table ON audit_logs(affected_table);
CREATE INDEX idx_audit_logs_record ON audit_logs(affected_table, affected_record_id);
CREATE INDEX idx_audit_logs_changed_at ON audit_logs(changed_at);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);


CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX idx_properties_type_status_visibility 
ON properties(property_type_id, property_status_id, visibility_status_id);

CREATE INDEX idx_properties_publication_desc 
ON properties(publication_date DESC) 
WHERE visibility_status_id = 1;

CREATE INDEX idx_properties_updated_at ON properties(updated_at DESC);

CREATE INDEX idx_property_prices_operation_price 
ON property_prices(operation_type_id, price) 
WHERE price > 0;

CREATE INDEX idx_property_prices_current 
ON property_prices(property_id, updated_at DESC);

CREATE INDEX idx_rentals_active 
ON rentals(property_id, start_date, end_date) 
WHERE end_date IS NULL;

CREATE INDEX idx_rentals_reminders 
ON rentals(next_increase_date, remind_increase, remind_contract_end) 
WHERE (remind_increase = true OR remind_contract_end = true) 
  AND (next_increase_date IS NOT NULL OR end_date IS NOT NULL);

CREATE INDEX idx_clients_category_interests 
ON clients(contact_category_id, purchase_interest, rental_interest) 
WHERE deleted = false;

CREATE INDEX idx_clients_phone 
ON clients(phone) 
WHERE phone IS NOT NULL AND deleted = false;

CREATE INDEX idx_clients_name 
ON clients(first_name, last_name) 
WHERE deleted = false;

CREATE INDEX idx_payments_status_date 
ON payments(payment_status_id, payment_date DESC);

CREATE INDEX idx_payments_pending 
ON payments(rental_id, payment_status_id, payment_date) 
WHERE payment_status_id IN (1, 3);

CREATE INDEX idx_properties_title_trgm 
ON properties USING gin(title gin_trgm_ops);

CREATE INDEX idx_properties_description_trgm 
ON properties USING gin(description gin_trgm_ops);

CREATE INDEX idx_clients_name_trgm 
ON clients USING gin((first_name || ' ' || last_name) gin_trgm_ops) 
WHERE deleted = false;

CREATE INDEX idx_clients_email_trgm 
ON clients USING gin(email gin_trgm_ops) 
WHERE deleted = false AND email IS NOT NULL;

CREATE INDEX idx_crm_interactions_scheduled_status 
ON crm_interactions(scheduled_datetime, status) 
WHERE scheduled_datetime IS NOT NULL;

CREATE INDEX idx_crm_interactions_user_date 
ON crm_interactions(responsible_user_id, scheduled_datetime DESC);

CREATE INDEX idx_expenses_property_date 
ON expenses(property_id, registered_date DESC);

CREATE INDEX idx_property_activities_recent 
ON property_activities(property_id, activity_date DESC);

CREATE INDEX idx_provinces_country_name 
ON provinces(country_id, name);

CREATE INDEX idx_cities_province_name 
ON cities(province_id, name);

CREATE INDEX idx_client_consultations_recent 
ON client_consultations(client_id, consultation_date DESC);

CREATE INDEX idx_client_consultations_assigned_user 
ON client_consultations(assigned_user_id, consultation_date DESC) 
WHERE assigned_user_id IS NOT NULL;

CREATE INDEX idx_property_sales_date_amount 
ON property_sales(sale_date DESC, final_amount DESC);

CREATE INDEX idx_property_sales_seller 
ON property_sales(seller_user_id, sale_date DESC);

CREATE INDEX idx_price_history_property_changed 
ON price_history(property_id, changed_at DESC);

CREATE INDEX idx_addresses_postal_code 
ON addresses(postal_code) 
WHERE postal_code IS NOT NULL;

CREATE INDEX idx_addresses_neighborhood 
ON addresses(neighborhood) 
WHERE neighborhood IS NOT NULL;


COMMENT ON DATABASE current_database() IS 'Database for real estate management system';
COMMENT ON INDEX idx_properties_type_status_visibility IS 'Optimiza búsquedas por tipo, estado y visibilidad de propiedades';
COMMENT ON INDEX idx_property_prices_operation_price IS 'Optimiza búsquedas por rango de precio';
COMMENT ON INDEX idx_rentals_active IS 'Optimiza búsqueda de contratos de alquiler activos';
COMMENT ON INDEX idx_clients_category_interests IS 'Optimiza segmentación de clientes por categoría e intereses';
COMMENT ON INDEX idx_payments_pending IS 'Optimiza búsqueda de pagos pendientes o vencidos';

-- ========================================================
-- MIGRATIONS: Asegurar que owner_id sea opcional
-- ========================================================

ALTER TABLE properties 
ALTER COLUMN owner_id DROP NOT NULL;

-- ========================================================
-- MIGRATION: Modify client_consultations table
-- Date: 2025-12-05
-- Description: Allow consultations without associated client
--              Store consultant information directly in consultation
-- ========================================================

ALTER TABLE client_consultations 
ALTER COLUMN client_id DROP NOT NULL;

ALTER TABLE client_consultations 
ADD COLUMN IF NOT EXISTS consultant_first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS consultant_last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS consultant_phone VARCHAR(15),
ADD COLUMN IF NOT EXISTS consultant_email VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_client_consultations_consultant_email 
ON client_consultations(consultant_email) 
WHERE consultant_email IS NOT NULL;

ALTER TABLE client_consultations
DROP CONSTRAINT IF EXISTS chk_client_or_consultant;

ALTER TABLE client_consultations
ADD CONSTRAINT chk_client_or_consultant CHECK (
    client_id IS NOT NULL OR 
    (consultant_first_name IS NOT NULL AND 
     consultant_last_name IS NOT NULL AND 
     consultant_phone IS NOT NULL)
);

COMMENT ON COLUMN client_consultations.client_id IS 'Client ID (NULL if not yet converted to lead)';
COMMENT ON COLUMN client_consultations.consultant_first_name IS 'Consultant first name (temporary until conversion to lead)';
COMMENT ON COLUMN client_consultations.consultant_last_name IS 'Consultant last name (temporary until conversion to lead)';
COMMENT ON COLUMN client_consultations.consultant_phone IS 'Consultant phone (temporary until conversion to lead)';
COMMENT ON COLUMN client_consultations.consultant_email IS 'Consultant email (temporary until conversion to lead)';



CREATE TABLE IF NOT EXISTS company_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    logo_url VARCHAR(500),
    company_name VARCHAR(255) DEFAULT 'Inmobiliaria',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT single_row CHECK (id = 1)
);

COMMENT ON TABLE company_settings IS 'Global company configuration (logo, name, etc.). Only one record allowed (id=1)';
COMMENT ON COLUMN company_settings.logo_url IS 'URL of company logo stored in Cloudinary';
COMMENT ON COLUMN company_settings.company_name IS 'Name of the real estate company';
COMMENT ON COLUMN company_settings.updated_by_user_id IS 'User (admin) who last updated the settings';
COMMENT ON CONSTRAINT single_row ON company_settings IS 'Ensures only one configuration record exists';

INSERT INTO company_settings (id, logo_url, company_name) 
VALUES (1, NULL, 'Inmobiliaria')
ON CONFLICT (id) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_company_settings_updated_by 
ON company_settings(updated_by_user_id);
