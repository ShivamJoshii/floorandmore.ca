import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { productRouter } from "./routers/productRouter";
import { collectionRouter } from "./routers/collectionRouter";
import { projectRouter } from "./routers/projectRouter";
import { quoteRouter } from "./routers/quoteRouter";
import { sampleRouter } from "./routers/sampleRouter";
import { showroomRouter } from "./routers/showroomRouter";
import { teamRouter } from "./routers/teamRouter";
import { contactRouter } from "./routers/contactRouter";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  product: productRouter,
  collection: collectionRouter,
  project: projectRouter,
  quote: quoteRouter,
  sample: sampleRouter,
  showroom: showroomRouter,
  team: teamRouter,
  contact: contactRouter,
});

export type AppRouter = typeof appRouter;
