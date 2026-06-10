import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ----- Profile -----
export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, avatar_url, created_at")
      .eq("id", userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return {
      profile: data,
      email: (claims.email as string | undefined) ?? null,
    };
  });

const profileSchema = z.object({
  full_name: z.string().trim().min(1).max(100),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
});

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => profileSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: data.full_name, phone: data.phone || null })
      .eq("id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ----- Addresses -----
export const getMyAddresses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

const addressSchema = z.object({
  id: z.string().uuid().optional(),
  label: z.string().trim().min(1).max(40),
  line1: z.string().trim().min(1).max(200),
  line2: z.string().trim().max(200).optional().or(z.literal("")),
  city: z.string().trim().min(1).max(80),
  state: z.string().trim().min(1).max(80),
  pincode: z.string().trim().min(4).max(12),
  country: z.string().trim().min(1).max(80).default("India"),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
  is_default: z.boolean().default(false),
});

export const upsertMyAddress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => addressSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.is_default) {
      await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    }
    const payload = {
      user_id: userId,
      label: data.label,
      line1: data.line1,
      line2: data.line2 || null,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      country: data.country,
      phone: data.phone || null,
      is_default: data.is_default,
    };
    if (data.id) {
      const { error } = await supabase.from("addresses").update(payload).eq("id", data.id).eq("user_id", userId);
      if (error) throw new Error(error.message);
      return { ok: true, id: data.id };
    }
    const { data: row, error } = await supabase.from("addresses").insert(payload).select("id").single();
    if (error) throw new Error(error.message);
    return { ok: true, id: row.id };
  });

export const deleteMyAddress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase.from("addresses").delete().eq("id", data.id).eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ----- Orders -----
export const getMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, status, subtotal, shipping, total, shipping_address, payment_method, created_at, order_items(id, product_name, image_url, unit_price, quantity, line_total)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });