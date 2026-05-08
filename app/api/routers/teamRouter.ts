import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { teamMembers } from "@db/schema";
import { eq, asc } from "drizzle-orm";

export const teamRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db
      .select()
      .from(teamMembers)
      .where(eq(teamMembers.isActive, true))
      .orderBy(asc(teamMembers.sortOrder));
  }),
});
