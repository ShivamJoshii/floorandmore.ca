import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { contactSubmissions } from "@db/schema";

export const contactRouter = createRouter({
  submit: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        phone: z.string().optional(),
        email: z.string().email(),
        subject: z.string().min(1),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(contactSubmissions).values({
        name: input.name,
        phone: input.phone,
        email: input.email,
        subject: input.subject,
        message: input.message,
      }).$returningId();

      return { id: result[0].id, status: "new" };
    }),
});
