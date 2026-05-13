CREATE INDEX idx_profiles_premium_expiry ON profiles(premium_expiry) WHERE premium_expiry IS NOT NULL;
