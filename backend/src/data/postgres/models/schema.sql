-- Habilitar extensión para UUIDs
-- Nota: gen_random_uuid() es nativo de PostgreSQL (requiere pgcrypto)
-- Alternativamente se puede usar uuid-ossp con uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Tablas de configuración/lookup (sin dependencias)

-- Countries
CREATE TABLE IF NOT EXISTS countries (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL UNIQUE,
    CONSTRAINT countries_pkey PRIMARY KEY (id)
);

-- Cities
CREATE TABLE IF NOT EXISTS cities (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL,
    id_country uuid NOT NULL,
    CONSTRAINT cities_pkey PRIMARY KEY (id),
    CONSTRAINT cities_id_country_fkey FOREIGN KEY (id_country) REFERENCES countries(id) ON DELETE CASCADE
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL,
    id_city uuid NOT NULL,
    CONSTRAINT departments_pkey PRIMARY KEY (id),
    CONSTRAINT departments_id_city_fkey FOREIGN KEY (id_city) REFERENCES cities(id) ON DELETE CASCADE
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    street text NOT NULL,
    number text,
    id_department uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT addresses_pkey PRIMARY KEY (id),
    CONSTRAINT addresses_id_department_fkey FOREIGN KEY (id_department) REFERENCES departments(id) ON DELETE CASCADE
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL UNIQUE,
    CONSTRAINT roles_pkey PRIMARY KEY (id)
);

-- Profiles (adaptado para no depender de Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    phone text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    role_id uuid,
    whatsapp_number text,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Clients
CREATE TABLE IF NOT EXISTS clients (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text UNIQUE,
    phone text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    dni text UNIQUE,
    CONSTRAINT clients_pkey PRIMARY KEY (id)
);

-- Property Types
CREATE TABLE IF NOT EXISTS property_types (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL UNIQUE,
    CONSTRAINT property_types_pkey PRIMARY KEY (id)
);

-- Property Status
CREATE TABLE IF NOT EXISTS property_status (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL UNIQUE,
    CONSTRAINT property_status_pkey PRIMARY KEY (id)
);

-- Operation Types
CREATE TABLE IF NOT EXISTS operation_types (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL UNIQUE,
    CONSTRAINT operation_types_pkey PRIMARY KEY (id)
);

-- Properties
CREATE TABLE IF NOT EXISTS properties (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    price numeric NOT NULL,
    bedrooms integer,
    bathrooms numeric,
    owner_id uuid NOT NULL,
    client_id uuid,
    address_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    status_id uuid,
    property_type_id uuid,
    operation_type_id uuid,
    CONSTRAINT properties_pkey PRIMARY KEY (id),
    CONSTRAINT properties_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES profiles(id) ON DELETE RESTRICT,
    CONSTRAINT properties_address_id_fkey FOREIGN KEY (address_id) REFERENCES addresses(id) ON DELETE RESTRICT,
    CONSTRAINT properties_status_id_fkey FOREIGN KEY (status_id) REFERENCES property_status(id) ON DELETE SET NULL,
    CONSTRAINT properties_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    CONSTRAINT properties_property_type_id_fkey FOREIGN KEY (property_type_id) REFERENCES property_types(id) ON DELETE SET NULL,
    CONSTRAINT properties_operation_type_id_fkey FOREIGN KEY (operation_type_id) REFERENCES operation_types(id) ON DELETE SET NULL
);

-- Amenities
CREATE TABLE IF NOT EXISTS amenities (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL UNIQUE,
    CONSTRAINT amenities_pkey PRIMARY KEY (id)
);

-- Property Amenities (tabla de relación)
CREATE TABLE IF NOT EXISTS property_amenities (
    property_id uuid NOT NULL,
    amenity_id uuid NOT NULL,
    CONSTRAINT property_amenities_pkey PRIMARY KEY (property_id, amenity_id),
    CONSTRAINT property_amenities_property_id_fkey FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT property_amenities_amenity_id_fkey FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- Services
CREATE TABLE IF NOT EXISTS services (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL UNIQUE,
    CONSTRAINT services_pkey PRIMARY KEY (id)
);

-- Property Services (tabla de relación)
CREATE TABLE IF NOT EXISTS property_services (
    id_property uuid NOT NULL,
    id_service uuid NOT NULL,
    CONSTRAINT property_services_pkey PRIMARY KEY (id_property, id_service),
    CONSTRAINT property_services_id_property_fkey FOREIGN KEY (id_property) REFERENCES properties(id) ON DELETE CASCADE,
    CONSTRAINT property_services_id_service_fkey FOREIGN KEY (id_service) REFERENCES services(id) ON DELETE CASCADE
);

-- Property Images
CREATE TABLE IF NOT EXISTS property_images (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    property_id uuid NOT NULL,
    image_url text NOT NULL,
    is_primary boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT property_images_pkey PRIMARY KEY (id),
    CONSTRAINT property_images_property_id_fkey FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    property_id uuid,
    client_id uuid,
    contract_url text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT contracts_pkey PRIMARY KEY (id),
    CONSTRAINT contracts_property_id_fkey FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    CONSTRAINT contracts_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

-- Rentals
CREATE TABLE IF NOT EXISTS rentals (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    property_id uuid NOT NULL,
    client_id uuid NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT rentals_pkey PRIMARY KEY (id),
    CONSTRAINT rentals_property_id_fkey FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE RESTRICT,
    CONSTRAINT rentals_client_id_fkey FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT
);

-- Lead Status
CREATE TABLE IF NOT EXISTS lead_status (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text NOT NULL UNIQUE,
    CONSTRAINT lead_status_pkey PRIMARY KEY (id)
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    property_id uuid,
    profile_id uuid,
    origin text,
    status_id uuid NOT NULL,
    visitor_name text,
    visitor_phone text,
    visitor_email text,
    message text,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT leads_pkey PRIMARY KEY (id),
    CONSTRAINT leads_property_id_fkey FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
    CONSTRAINT leads_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL,
    CONSTRAINT leads_status_id_fkey FOREIGN KEY (status_id) REFERENCES lead_status(id) ON DELETE RESTRICT
);

-- Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    profile_id uuid,
    action_type text NOT NULL,
    table_name text,
    record_id uuid,
    changed_data jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT audit_log_pkey PRIMARY KEY (id),
    CONSTRAINT audit_log_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE SET NULL
);

-- Índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_addresses_id_department ON addresses(id_department);
CREATE INDEX IF NOT EXISTS idx_cities_id_country ON cities(id_city);
CREATE INDEX IF NOT EXISTS idx_departments_id_city ON departments(id_city);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_address_id ON properties(address_id);
CREATE INDEX IF NOT EXISTS idx_properties_status_id ON properties(status_id);
CREATE INDEX IF NOT EXISTS idx_properties_operation_type_id ON properties(operation_type_id);
CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_property_id ON leads(property_id);
CREATE INDEX IF NOT EXISTS idx_leads_status_id ON leads(status_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_profile_id ON audit_log(profile_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

