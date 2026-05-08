import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { quoteRequests } from "@db/schema";

export const quoteRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        customerName: z.string().min(1),
        phone: z.string().min(1),
        email: z.string().email(),
        projectType: z.string().optional(),
        roomSize: z.string().optional(),
        roomSizeUnit: z.string().optional(),
        city: z.string().optional(),
        timeline: z.string().optional(),
        customerType: z.string().optional(),
        notes: z.string().optional(),
        products: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number(),
            productName: z.string(),
          })
        ).default([]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(quoteRequests).values({
        customerName: input.customerName,
        phone: input.phone,
        email: input.email,
        projectType: input.projectType,
        roomSize: input.roomSize,
        roomSizeUnit: input.roomSizeUnit,
        city: input.city,
        timeline: input.timeline,
        customerType: input.customerType,
        notes: input.notes,
        products: input.products,
      }).$returningId();

      return { id: result[0].id, status: "new" };
    }),
});
