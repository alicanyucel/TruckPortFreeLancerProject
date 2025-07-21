-- TruckPort Database Initialization Script
-- This script creates the necessary tables and initial data for the TruckPort application

-- Create database extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'driver',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lounge facilities table
CREATE TABLE IF NOT EXISTS lounge_facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_key VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lounge pricing plans table
CREATE TABLE IF NOT EXISTS lounge_pricing_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_type VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    price_per_hour DECIMAL(10,2) NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lounge reservations table
CREATE TABLE IF NOT EXISTS lounge_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_type VARCHAR(50) REFERENCES lounge_pricing_plans(plan_type),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    total_price DECIMAL(10,2) NOT NULL,
    facilities JSONB,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Lounge availability table
CREATE TABLE IF NOT EXISTS lounge_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    plan_type VARCHAR(50) NOT NULL,
    total_slots INTEGER NOT NULL,
    available_slots INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date, plan_type)
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100),
    user_id UUID REFERENCES users(id),
    load_time INTEGER,
    render_time INTEGER,
    memory_usage INTEGER,
    component_count INTEGER,
    api_calls INTEGER,
    errors INTEGER,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Error logs table
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    error_type VARCHAR(100),
    error_message TEXT,
    stack_trace TEXT,
    url VARCHAR(500),
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data for lounge facilities
INSERT INTO lounge_facilities (name, description, icon_key) VALUES
    ('Restaurant', 'High-quality restaurant with Turkish and international cuisine', '🍽️'),
    ('Rest Area', 'Comfortable sleeping quarters with premium bedding', '🛏️'),
    ('Shower', 'Clean and modern shower facilities', '🚿'),
    ('WiFi', 'High-speed internet connection throughout the facility', '📶'),
    ('Parking', 'Secure parking for trucks of all sizes', '🚗'),
    ('Laundry', 'Professional laundry and dry cleaning services', '👕')
ON CONFLICT DO NOTHING;

-- Insert initial pricing plans
INSERT INTO lounge_pricing_plans (plan_type, name, price_per_hour, price_per_day, features) VALUES
    ('basic', 'Basic Plan', 12.50, 50.00, '["restaurant", "wifi"]'),
    ('premium', 'Premium Plan', 20.00, 100.00, '["restaurant", "wifi", "shower", "parking"]'),
    ('vip', 'VIP Plan', 35.00, 200.00, '["restaurant", "wifi", "shower", "parking", "rest", "laundry"]')
ON CONFLICT (plan_type) DO NOTHING;

-- Insert sample user
INSERT INTO users (email, password_hash, first_name, last_name, phone, role) VALUES
    ('admin@truckport.com', '$2b$10$hash_example', 'Admin', 'User', '+90 555 123 4567', 'admin'),
    ('driver@truckport.com', '$2b$10$hash_example', 'Test', 'Driver', '+90 555 987 6543', 'driver')
ON CONFLICT (email) DO NOTHING;

-- Generate availability data for next 30 days
INSERT INTO lounge_availability (date, plan_type, total_slots, available_slots)
SELECT 
    (CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 29))::DATE as date,
    plan_type,
    CASE 
        WHEN plan_type = 'basic' THEN 20
        WHEN plan_type = 'premium' THEN 10
        WHEN plan_type = 'vip' THEN 5
    END as total_slots,
    CASE 
        WHEN plan_type = 'basic' THEN 15 + (RANDOM() * 5)::INTEGER
        WHEN plan_type = 'premium' THEN 7 + (RANDOM() * 3)::INTEGER
        WHEN plan_type = 'vip' THEN 3 + (RANDOM() * 2)::INTEGER
    END as available_slots
FROM lounge_pricing_plans
ON CONFLICT (date, plan_type) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON lounge_reservations(user_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON lounge_reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON lounge_reservations(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_availability_date ON lounge_availability(date);
CREATE INDEX IF NOT EXISTS idx_performance_timestamp ON performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON lounge_reservations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE OR REPLACE VIEW reservation_summary AS
SELECT 
    r.id,
    r.user_id,
    u.first_name || ' ' || u.last_name as user_name,
    u.email,
    r.plan_type,
    p.name as plan_name,
    r.start_date,
    r.end_date,
    r.status,
    r.total_price,
    r.created_at
FROM lounge_reservations r
JOIN users u ON r.user_id = u.id
JOIN lounge_pricing_plans p ON r.plan_type = p.plan_type;

COMMENT ON DATABASE truckport IS 'TruckPort application database with lounge management, user authentication, and performance monitoring';
COMMENT ON TABLE users IS 'User accounts for drivers and administrators';
COMMENT ON TABLE lounge_reservations IS 'Lounge facility reservations made by users';
COMMENT ON TABLE lounge_availability IS 'Daily availability slots for each plan type';
COMMENT ON TABLE performance_metrics IS 'Application performance metrics for monitoring';
COMMENT ON TABLE error_logs IS 'Application error logs for debugging and monitoring';
