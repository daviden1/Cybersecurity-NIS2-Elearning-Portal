BEGIN;

-- Create certificates table
CREATE TABLE certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url TEXT,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  certificate_number TEXT UNIQUE NOT NULL,
  verification_code TEXT UNIQUE NOT NULL
);

-- Enable RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policies for certificates
CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can create own certificates" ON certificates FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can view all certificates" ON certificates FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Create function to generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
  cert_number TEXT;
BEGIN
  cert_number := 'CERT-' || to_char(now(), 'YYYY') || '-' || upper(substring(md5(random()::text), 1, 8));
  RETURN cert_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate verification code
CREATE OR REPLACE FUNCTION generate_verification_code()
RETURNS TEXT AS $$
DECLARE
  verification_code TEXT;
BEGIN
  verification_code := upper(substring(md5(random()::text), 1, 12));
  RETURN verification_code;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate certificate numbers and verification codes
CREATE OR REPLACE FUNCTION set_certificate_data()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.certificate_number IS NULL THEN
    NEW.certificate_number := generate_certificate_number();
  END IF;
  IF NEW.verification_code IS NULL THEN
    NEW.verification_code := generate_verification_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_certificate_data_trigger
  BEFORE INSERT ON certificates
  FOR EACH ROW EXECUTE FUNCTION set_certificate_data();

COMMIT;