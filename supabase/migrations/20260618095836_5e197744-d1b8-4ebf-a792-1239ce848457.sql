DROP POLICY IF EXISTS "read active coupons" ON public.coupons;
CREATE POLICY "read active coupons" ON public.coupons FOR SELECT TO authenticated USING (active = true);
REVOKE SELECT ON public.coupons FROM anon;