import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { projects } from "@db/schema";
import { eq, sql, and } from "drizzle-orm";

export const projectRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(12),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 12;
      const offset = (page - 1) * limit;

      const conditions = [];
      if (input?.category) conditions.push(eq(projects.category, input.category));
      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [items, countResult] = await Promise.all([
        db.select().from(projects).where(whereClause).limit(limit).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(projects).where(whereClause),
      ]);

      return { projects: items, total: countResult[0]?.count ?? 0 };
    }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(projects)
        .where(eq(projects.slug, input.slug))
        .limit(1);
      return result[0] || null;
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(projects).where(eq(projects.featured, true));
  }),
});
