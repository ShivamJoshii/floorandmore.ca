import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { sampleRequests } from "@db/schema";

export const sampleRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        customerName: z.string().min(1),
        phone: z.string().min(1),
        email: z.string().email(),
        city: z.string().optional(),
        deliveryMethod: z.string().optional(),
        projectType: z.string().optional(),
        timeline: z.string().optional(),
        notes: z.string().optional(),
        products: z.array(
          z.object({
            productId: z.number(),
            productName: z.string(),
            sku: z.string(),
          })
        ).default([]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(sampleRequests).values({
        customerName: input.customerName,
        phone: input.phone,
        email: input.email,
        city: input.city,
        deliveryMethod: input.deliveryMethod,
        projectType: input.projectType,
        timeline: input.timeline,
        notes: input.notes,
        products: input.products,
      }).$returningId();

      return { id: result[0].id, status: "new" };
    }),
});
