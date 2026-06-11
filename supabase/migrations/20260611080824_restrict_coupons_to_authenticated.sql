-- Restrict coupon visibility to authenticated users only.
DROP POLICY IF EXISTS "Anyone can read active coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public can read active coupons" ON public.coupons;
DROP POLICY IF EXISTS "Active coupons are readable" ON public.coupons;
DROP POLICY IF EXISTS "Coupons are viewable" ON public.coupons;

CREATE POLICY "Authenticated users can read active coupons"
ON public.coupons
FOR SELECT
TO authenticated
USING (active = true);

REVOKE SELECT ON public.coupons FROM anon;
GRANT SELECT ON public.coupons TO authenticated;
