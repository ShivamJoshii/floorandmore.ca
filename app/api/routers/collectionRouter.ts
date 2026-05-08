import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { collections } from "@db/schema";
import { eq } from "drizzle-orm";

export const collectionRouter = createRouter({
  list: publicQuery
    .input(z.object({ featured: z.boolean().optional() }).optional())
    .query(async ({ input }) => {
      const db = getDb();
      if (input?.featured) {
        return db.select().from(collections).where(eq(collections.featured, true));
      }
      return db.select().from(collections);
    }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(collections)
        .where(eq(collections.slug, input.slug))
        .limit(1);
      return result[0] || null;
    }),
});
