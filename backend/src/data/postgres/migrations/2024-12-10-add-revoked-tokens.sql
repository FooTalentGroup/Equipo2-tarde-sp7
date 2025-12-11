-- ========================================================
-- MIGRATION: Add Token Blacklist Support
-- Date: 2024-12-10
-- Description: Create revoked_tokens table for JWT blacklist
-- ========================================================

-- Create revoked_tokens table
CREATE TABLE IF NOT EXISTS revoked_tokens (
    id SERIAL PRIMARY KEY,
    token_jti VARCHAR(255) UNIQUE NOT NULL,
    user_id INTEGER NOT NULL,
    revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    reason VARCHAR(100),
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- Foreign key
    CONSTRAINT fk_revoked_tokens_user 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Constraint for reason values
    CONSTRAINT chk_revoked_tokens_reason 
        CHECK (reason IN ('logout', 'new_login', 'manual', 'security'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_revoked_tokens_jti 
    ON revoked_tokens(token_jti);

CREATE INDEX IF NOT EXISTS idx_revoked_tokens_user_id 
    ON revoked_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_revoked_tokens_expires 
    ON revoked_tokens(expires_at);

-- Add comments for documentation
COMMENT ON TABLE revoked_tokens IS 'JWT tokens blacklist for revoked/logged out tokens';
COMMENT ON COLUMN revoked_tokens.token_jti IS 'Unique JWT ID (jti claim) of the revoked token';
COMMENT ON COLUMN revoked_tokens.user_id IS 'User who owned the token';
COMMENT ON COLUMN revoked_tokens.revoked_at IS 'When the token was revoked';
COMMENT ON COLUMN revoked_tokens.expires_at IS 'Original expiration date of the token (for cleanup)';
COMMENT ON COLUMN revoked_tokens.reason IS 'Reason for revocation: logout, new_login, manual, security';
COMMENT ON COLUMN revoked_tokens.ip_address IS 'IP address from which logout was performed';
COMMENT ON COLUMN revoked_tokens.user_agent IS 'User agent from which logout was performed';
