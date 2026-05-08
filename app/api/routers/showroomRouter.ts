import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { showroomInfo } from "@db/schema";

export const showroomRouter = createRouter({
  info: publicQuery.query(async () => {
    const db = getDb();
    const result = await db.select().from(showroomInfo).limit(1);
    return result[0] || null;
  }),
});
