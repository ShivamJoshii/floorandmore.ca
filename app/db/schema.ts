import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  json,
  boolean,
  decimal,
  int,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: varchar("role", { length: 50 }).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const collections = mysqlTable("collections", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  shortDescription: text("shortDescription"),
  look: varchar("look", { length: 100 }),
  category: varchar("category", { length: 100 }),
  images: json("images"),
  brochureUrl: varchar("brochureUrl", { length: 500 }),
  featured: boolean("featured").default(false),
  meta: json("meta"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Collection = typeof collections.$inferSelect;

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  collectionId: bigint("collectionId", { mode: "number", unsigned: true }),
  room: varchar("room", { length: 100 }),
  look: varchar("look", { length: 100 }),
  colour: varchar("colour", { length: 100 }),
  size: varchar("size", { length: 100 }),
  finish: varchar("finish", { length: 100 }),
  useCase: varchar("useCase", { length: 100 }),
  material: varchar("material", { length: 100 }),
  thickness: varchar("thickness", { length: 50 }),
  rectified: boolean("rectified").default(false),
  indoorOutdoor: varchar("indoorOutdoor", { length: 50 }),
  floorWall: varchar("floorWall", { length: 50 }),
  showerSafe: boolean("showerSafe").default(false),
  slipRating: varchar("slipRating", { length: 50 }),
  frostResistant: boolean("frostResistant").default(false),
  waterAbsorption: varchar("waterAbsorption", { length: 50 }),
  countryOfOrigin: varchar("countryOfOrigin", { length: 100 }),
  cartonCoverage: decimal("cartonCoverage", { precision: 8, scale: 2 }),
  piecesPerBox: int("piecesPerBox"),
  weightPerBox: decimal("weightPerBox", { precision: 6, scale: 2 }),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("salePrice", { precision: 10, scale: 2 }),
  stockStatus: varchar("stockStatus", { length: 50 }).notNull().default("in_stock"),
  stockQuantity: int("stockQuantity").default(0),
  description: text("description"),
  shortDescription: text("shortDescription"),
  specSheetUrl: varchar("specSheetUrl", { length: 500 }),
  brochureUrl: varchar("brochureUrl", { length: 500 }),
  installationGuideUrl: varchar("installationGuideUrl", { length: 500 }),
  featured: boolean("featured").default(false),
  clearance: boolean("clearance").default(false),
  clearanceCategory: varchar("clearanceCategory", { length: 100 }),
  images: json("images"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: int("reviewCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Product = typeof products.$inferSelect;

export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  category: varchar("category", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }),
  year: int("year"),
  description: text("description"),
  productsUsed: text("productsUsed"),
  images: json("images"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;

export const quoteRequests = mysqlTable("quoteRequests", {
  id: serial("id").primaryKey(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  projectType: varchar("projectType", { length: 100 }),
  roomSize: varchar("roomSize", { length: 100 }),
  roomSizeUnit: varchar("roomSizeUnit", { length: 20 }),
  city: varchar("city", { length: 255 }),
  timeline: varchar("timeline", { length: 100 }),
  customerType: varchar("customerType", { length: 100 }),
  notes: text("notes"),
  products: json("products"),
  status: varchar("status", { length: 50 }).default("new"),
  followUpStatus: varchar("followUpStatus", { length: 50 }).default("none"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type QuoteRequest = typeof quoteRequests.$inferSelect;

export const sampleRequests = mysqlTable("sampleRequests", {
  id: serial("id").primaryKey(),
  customerName: varchar("customerName", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  city: varchar("city", { length: 255 }),
  deliveryMethod: varchar("deliveryMethod", { length: 50 }),
  projectType: varchar("projectType", { length: 100 }),
  timeline: varchar("timeline", { length: 100 }),
  notes: text("notes"),
  products: json("products"),
  status: varchar("status", { length: 50 }).default("new"),
  followUpStatus: varchar("followUpStatus", { length: 50 }).default("none"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type SampleRequest = typeof sampleRequests.$inferSelect;

export const showroomInfo = mysqlTable("showroomInfo", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 500 }).notNull(),
  city: varchar("city", { length: 255 }),
  province: varchar("province", { length: 100 }),
  postalCode: varchar("postalCode", { length: 50 }),
  phone: varchar("phone", { length: 50 }),
  whatsapp: varchar("whatsapp", { length: 50 }),
  email: varchar("email", { length: 320 }),
  hours: json("hours"),
  mapUrl: varchar("mapUrl", { length: 500 }),
  parkingInfo: text("parkingInfo"),
  images: json("images"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type ShowroomInfo = typeof showroomInfo.$inferSelect;

export const teamMembers = mysqlTable("teamMembers", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  avatarUrl: varchar("avatarUrl", { length: 500 }),
  whatsappNumber: varchar("whatsappNumber", { length: 50 }),
  sortOrder: int("sortOrder").default(0),
  isActive: boolean("isActive").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;

export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 320 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).default("new"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
