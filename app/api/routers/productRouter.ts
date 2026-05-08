import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { products } from "@db/schema";
import { eq, and, like, or, sql, desc } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        subcategory: z.string().optional(),
        room: z.string().optional(),
        look: z.string().optional(),
        colour: z.string().optional(),
        size: z.string().optional(),
        finish: z.string().optional(),
        useCase: z.string().optional(),
        material: z.string().optional(),
        stockStatus: z.string().optional(),
        clearance: z.boolean().optional(),
        search: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(24),
        sortBy: z.string().default("featured"),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const filters = input;
      const page = filters?.page ?? 1;
      const limit = filters?.limit ?? 24;
      const offset = (page - 1) * limit;

      const conditions = [];

      if (filters?.category) conditions.push(eq(products.category, filters.category));
      if (filters?.subcategory) conditions.push(eq(products.subcategory, filters.subcategory));
      if (filters?.room) conditions.push(eq(products.room, filters.room));
      if (filters?.look) conditions.push(eq(products.look, filters.look));
      if (filters?.colour) conditions.push(eq(products.colour, filters.colour));
      if (filters?.size) conditions.push(eq(products.size, filters.size));
      if (filters?.finish) conditions.push(eq(products.finish, filters.finish));
      if (filters?.useCase) conditions.push(eq(products.useCase, filters.useCase));
      if (filters?.material) conditions.push(eq(products.material, filters.material));
      if (filters?.stockStatus) conditions.push(eq(products.stockStatus, filters.stockStatus));
      if (filters?.clearance !== undefined) conditions.push(eq(products.clearance, filters.clearance));
      if (filters?.search) {
        const searchTerm = `%${filters.search}%`;
        conditions.push(
          or(
            like(products.name, searchTerm),
            like(products.sku, searchTerm),
            like(products.description, searchTerm)
          )
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [items, countResult] = await Promise.all([
        db
          .select()
          .from(products)
          .where(whereClause)
          .limit(limit)
          .offset(offset)
          .orderBy(desc(products.featured)),
        db
          .select({ count: sql<number>`count(*)` })
          .from(products)
          .where(whereClause),
      ]);

      const total = countResult[0]?.count ?? 0;

      return {
        products: items,
        total,
        hasMore: total > page * limit,
      };
    }),

  bySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(products)
        .where(eq(products.slug, input.slug))
        .limit(1);
      return result[0] || null;
    }),

  byCollection: publicQuery
    .input(z.object({ collectionId: z.number(), page: z.number().default(1), limit: z.number().default(24) }))
    .query(async ({ input }) => {
      const db = getDb();
      const offset = (input.page - 1) * input.limit;
      const [items, countResult] = await Promise.all([
        db
          .select()
          .from(products)
          .where(eq(products.collectionId, input.collectionId))
          .limit(input.limit)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(products)
          .where(eq(products.collectionId, input.collectionId)),
      ]);
      return {
        products: items,
        total: countResult[0]?.count ?? 0,
      };
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(products)
      .where(eq(products.featured, true))
      .limit(8);
  }),

  clearance: publicQuery
    .input(
      z.object({
        category: z.string().optional(),
        page: z.number().default(1),
        limit: z.number().default(24),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const page = input?.page ?? 1;
      const limit = input?.limit ?? 24;
      const offset = (page - 1) * limit;

      const conditions = [eq(products.clearance, true)];
      if (input?.category) conditions.push(eq(products.clearanceCategory, input.category));

      const whereClause = and(...conditions);

      const [items, countResult] = await Promise.all([
        db.select().from(products).where(whereClause).limit(limit).offset(offset),
        db.select({ count: sql<number>`count(*)` }).from(products).where(whereClause),
      ]);

      const total = countResult[0]?.count ?? 0;
      return { products: items, total, hasMore: total > page * limit };
    }),
});
