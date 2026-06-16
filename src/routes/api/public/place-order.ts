import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import catalog from "@/lib/server-catalog.json";

const Body = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1).max(100),
        qty: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(50),
  addressId: z.string().uuid(),
  couponCode: z.string().trim().max(40).optional().nullable(),
  paymentMethod: z.enum(["cod", "online"]).default("cod"),
});

type CatalogEntry = { id: string; name: string; price: number; image: string };
const PRICES = catalog as Record<string, CatalogEntry>;

export const Route = createFileRoute("/api/public/place-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = (jsonOk: unknown, status = 200) =>
          new Response(JSON.stringify(jsonOk), {
            status,
            headers: { "content-type": "application/json" },
          });

        const authHeader = request.headers.get("authorization") || "";
        const token = authHeader.startsWith("Bearer ")
          ? authHeader.slice(7).trim()
          : "";
        if (!token) return json({ error: "Unauthorized" }, 401);

        const url = process.env.SUPABASE_URL;
        const publishable = process.env.SUPABASE_PUBLISHABLE_KEY;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !publishable || !serviceKey) {
          return json({ error: "Server not configured" }, 500);
        }

        // Verify user via the bearer token (publishable key client)
        const userClient = createClient(url, publishable, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: { headers: { Authorization: `Bearer ${token}` } },
        });
        const { data: userData, error: userErr } =
          await userClient.auth.getUser(token);
        if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
        const userId = userData.user.id;

        // Validate input
        let body: z.infer<typeof Body>;
        try {
          body = Body.parse(await request.json());
        } catch (e) {
          return json({ error: "Invalid request" }, 400);
        }

        // Authoritative price computation
        const lineItems: Array<{
          product_id: string;
          product_name: string;
          image_url: string;
          unit_price: number;
          quantity: number;
          line_total: number;
        }> = [];
        let subtotal = 0;
        for (const it of body.items) {
          const p = PRICES[it.id];
          if (!p) return json({ error: `Unknown product: ${it.id}` }, 400);
          const lineTotal = p.price * it.qty;
          subtotal += lineTotal;
          lineItems.push({
            product_id: p.id,
            product_name: p.name,
            image_url: p.image,
            unit_price: p.price,
            quantity: it.qty,
            line_total: lineTotal,
          });
        }

        const admin = createClient(url, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        // Load address scoped to user
        const { data: addr, error: addrErr } = await admin
          .from("addresses")
          .select("*")
          .eq("id", body.addressId)
          .eq("user_id", userId)
          .maybeSingle();
        if (addrErr || !addr) return json({ error: "Invalid address" }, 400);

        // Validate coupon server-side
        let discount = 0;
        let couponCode: string | null = null;
        if (body.couponCode) {
          const code = body.couponCode.trim().toLowerCase();
          const { data: coupon } = await admin
            .from("coupons")
            .select("*")
            .eq("code", code)
            .maybeSingle();
          if (
            coupon &&
            coupon.active !== false &&
            subtotal >= Number(coupon.min_order || 0)
          ) {
            const pct = Math.max(0, Math.min(100, Number(coupon.discount_percent) || 0));
            discount = Math.round((subtotal * pct) / 100);
            couponCode = coupon.code;
          }
        }

        const shipping = subtotal - discount >= 1000 ? 0 : 60;
        const total = subtotal - discount + shipping;

        const { data: order, error: orderErr } = await admin
          .from("orders")
          .insert({
            user_id: userId,
            status: "pending",
            subtotal,
            shipping,
            total,
            shipping_address: addr,
            payment_method: body.paymentMethod,
            notes: couponCode
              ? `coupon:${couponCode};discount:${discount}`
              : null,
          })
          .select()
          .single();
        if (orderErr || !order) {
          return json({ error: orderErr?.message || "Order failed" }, 500);
        }

        const rows = lineItems.map((li) => ({ order_id: order.id, ...li }));
        const { error: itemsErr } = await admin.from("order_items").insert(rows);
        if (itemsErr) {
          await admin.from("orders").delete().eq("id", order.id);
          return json({ error: itemsErr.message }, 500);
        }

        return json({
          ok: true,
          orderNumber: order.order_number || order.id,
          subtotal,
          discount,
          shipping,
          total,
        });
      },
    },
  },
});