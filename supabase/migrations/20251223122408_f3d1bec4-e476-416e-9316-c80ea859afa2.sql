-- ===========================================
-- FLYTTBAS MARKETPLACE DATABASE SCHEMA
-- ===========================================

-- 1. USER ROLES ENUM AND TABLE
-- ===========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'partner', 'customer');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 2. PROFILES TABLE
-- ===========================================
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    contact_preference TEXT DEFAULT 'email' CHECK (contact_preference IN ('email', 'phone', 'both')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- 3. PARTNER STATUS ENUM
-- ===========================================
CREATE TYPE public.partner_status AS ENUM ('pending', 'approved', 'rejected', 'more_info_requested', 'suspended');

-- 4. PARTNERS TABLE (Moving Companies)
-- ===========================================
CREATE TABLE public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    company_name TEXT NOT NULL,
    org_number TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    
    -- Compliance fields (required for approval)
    traffic_license_number TEXT,
    traffic_license_valid_until DATE,
    f_tax_certificate BOOLEAN DEFAULT false,
    insurance_company TEXT,
    insurance_policy_number TEXT,
    insurance_valid_until DATE,
    
    -- Service area (postal codes)
    service_postal_codes TEXT[] DEFAULT '{}',
    max_drive_distance_km INTEGER DEFAULT 50,
    
    -- Rating and stats
    average_rating NUMERIC(3,2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    completed_jobs INTEGER DEFAULT 0,
    
    -- Sponsorship
    is_sponsored BOOLEAN DEFAULT false,
    sponsored_until TIMESTAMP WITH TIME ZONE,
    
    -- Status
    status partner_status DEFAULT 'pending',
    status_reason TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own data"
ON public.partners FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Partners can update own data"
ON public.partners FOR UPDATE
USING (auth.uid() = user_id AND status != 'suspended');

CREATE POLICY "Anyone can register as partner"
ON public.partners FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all partners"
ON public.partners FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update partners"
ON public.partners FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Approved partners are visible"
ON public.partners FOR SELECT
USING (status = 'approved');

-- 5. QUOTE STATUS ENUM
-- ===========================================
CREATE TYPE public.quote_status AS ENUM ('pending', 'offers_received', 'offer_approved', 'completed', 'cancelled', 'expired');

-- 6. QUOTE REQUESTS TABLE
-- ===========================================
CREATE TABLE public.quote_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Customer info (for non-logged in users)
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    contact_preference TEXT DEFAULT 'email' CHECK (contact_preference IN ('email', 'phone', 'both')),
    
    -- Move details
    from_address TEXT NOT NULL,
    from_postal_code TEXT NOT NULL,
    to_address TEXT NOT NULL,
    to_postal_code TEXT NOT NULL,
    dwelling_type TEXT NOT NULL,
    area_m2 INTEGER NOT NULL,
    rooms INTEGER,
    move_date DATE NOT NULL,
    move_start_time TEXT,
    
    -- Access details
    stairs_from INTEGER DEFAULT 0,
    stairs_to INTEGER DEFAULT 0,
    carry_from_m INTEGER DEFAULT 0,
    carry_to_m INTEGER DEFAULT 0,
    parking_restrictions BOOLEAN DEFAULT false,
    
    -- Items
    heavy_items JSONB DEFAULT '[]',
    
    -- Services
    packing_hours INTEGER DEFAULT 0,
    assembly_hours INTEGER DEFAULT 0,
    home_visit_requested BOOLEAN DEFAULT false,
    
    -- Additional info
    notes TEXT,
    
    -- Status
    status quote_status DEFAULT 'pending',
    expires_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- Customers can view own quotes
CREATE POLICY "Customers can view own quotes"
ON public.quote_requests FOR SELECT
USING (customer_email = (SELECT email FROM public.profiles WHERE user_id = auth.uid()) OR customer_id = auth.uid());

-- Approved partners can view pending quotes in their area
CREATE POLICY "Approved partners can view quotes"
ON public.quote_requests FOR SELECT
USING (
    public.has_role(auth.uid(), 'admin') OR
    (
        EXISTS (
            SELECT 1 FROM public.partners p
            WHERE p.user_id = auth.uid()
            AND p.status = 'approved'
            AND (from_postal_code = ANY(p.service_postal_codes) OR cardinality(p.service_postal_codes) = 0)
        )
        AND status IN ('pending', 'offers_received')
    )
);

-- Anyone can insert (public quote form)
CREATE POLICY "Anyone can create quote"
ON public.quote_requests FOR INSERT
WITH CHECK (true);

-- Admins can manage all quotes
CREATE POLICY "Admins can manage quotes"
ON public.quote_requests FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 7. OFFER STATUS ENUM
-- ===========================================
CREATE TYPE public.offer_status AS ENUM ('pending', 'approved', 'rejected', 'expired', 'withdrawn');

-- 8. OFFERS TABLE
-- ===========================================
CREATE TABLE public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_request_id UUID REFERENCES public.quote_requests(id) ON DELETE CASCADE NOT NULL,
    partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
    
    -- Pricing
    total_price INTEGER NOT NULL, -- in SEK
    price_before_rut INTEGER NOT NULL,
    rut_deduction INTEGER DEFAULT 0,
    
    -- Offer details
    estimated_hours INTEGER NOT NULL,
    team_size INTEGER NOT NULL,
    available_date DATE NOT NULL,
    time_window TEXT NOT NULL, -- e.g., "08:00-12:00"
    
    -- Terms
    terms TEXT,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Status
    status offer_status DEFAULT 'pending',
    
    -- Ranking
    distance_km NUMERIC(6,2),
    drive_time_minutes INTEGER,
    ranking_score NUMERIC(5,2) DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Partners can view and manage own offers
CREATE POLICY "Partners can view own offers"
ON public.offers FOR SELECT
USING (EXISTS (SELECT 1 FROM public.partners WHERE id = partner_id AND user_id = auth.uid()));

CREATE POLICY "Partners can create offers"
ON public.offers FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.partners WHERE id = partner_id AND user_id = auth.uid() AND status = 'approved'));

CREATE POLICY "Partners can update own offers"
ON public.offers FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.partners WHERE id = partner_id AND user_id = auth.uid()));

-- Customers can view offers on their quotes
CREATE POLICY "Customers can view offers on their quotes"
ON public.offers FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.quote_requests qr
        WHERE qr.id = quote_request_id
        AND (qr.customer_id = auth.uid() OR qr.customer_email = (SELECT email FROM public.profiles WHERE user_id = auth.uid()))
    )
);

-- Admins can manage all offers
CREATE POLICY "Admins can manage offers"
ON public.offers FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 9. COMMISSION FEE TABLE
-- ===========================================
CREATE TABLE public.commission_fees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE NOT NULL UNIQUE,
    partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
    
    -- Fee calculation (7% of price before RUT)
    order_value INTEGER NOT NULL,
    fee_percentage NUMERIC(4,2) DEFAULT 0.07,
    fee_amount INTEGER NOT NULL,
    
    -- Invoice
    invoice_number TEXT,
    invoice_generated_at TIMESTAMP WITH TIME ZONE,
    invoice_paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Credit note (if applicable)
    credit_note_number TEXT,
    credit_note_amount INTEGER DEFAULT 0,
    credit_note_reason TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.commission_fees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view own fees"
ON public.commission_fees FOR SELECT
USING (EXISTS (SELECT 1 FROM public.partners WHERE id = partner_id AND user_id = auth.uid()));

CREATE POLICY "Admins can manage fees"
ON public.commission_fees FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- 10. AUDIT LOG TABLE
-- ===========================================
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert audit logs"
ON public.audit_logs FOR INSERT
WITH CHECK (true);

-- 11. REVIEWS TABLE
-- ===========================================
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offer_id UUID REFERENCES public.offers(id) ON DELETE CASCADE NOT NULL UNIQUE,
    partner_id UUID REFERENCES public.partners(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
ON public.reviews FOR SELECT
USING (true);

CREATE POLICY "Customers can create reviews"
ON public.reviews FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- 12. HELPER FUNCTIONS
-- ===========================================

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
    
    -- Default role is customer
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'customer');
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update partner rating
CREATE OR REPLACE FUNCTION public.update_partner_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.partners
    SET 
        average_rating = (SELECT AVG(rating) FROM public.reviews WHERE partner_id = NEW.partner_id),
        total_reviews = (SELECT COUNT(*) FROM public.reviews WHERE partner_id = NEW.partner_id)
    WHERE id = NEW.partner_id;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_review_created
    AFTER INSERT ON public.reviews
    FOR EACH ROW EXECUTE FUNCTION public.update_partner_rating();

-- Function to create commission fee when offer is approved
CREATE OR REPLACE FUNCTION public.create_commission_fee()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        INSERT INTO public.commission_fees (offer_id, partner_id, order_value, fee_amount)
        VALUES (
            NEW.id,
            NEW.partner_id,
            NEW.price_before_rut,
            FLOOR(NEW.price_before_rut * 0.07)
        );
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_offer_approved
    AFTER UPDATE ON public.offers
    FOR EACH ROW EXECUTE FUNCTION public.create_commission_fee();

-- 13. INDEXES FOR PERFORMANCE
-- ===========================================
CREATE INDEX idx_partners_status ON public.partners(status);
CREATE INDEX idx_partners_postal_codes ON public.partners USING GIN(service_postal_codes);
CREATE INDEX idx_quote_requests_status ON public.quote_requests(status);
CREATE INDEX idx_quote_requests_postal_code ON public.quote_requests(from_postal_code);
CREATE INDEX idx_offers_quote_request ON public.offers(quote_request_id);
CREATE INDEX idx_offers_partner ON public.offers(partner_id);
CREATE INDEX idx_commission_fees_partner ON public.commission_fees(partner_id);