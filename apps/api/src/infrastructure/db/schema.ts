import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

// --- better-auth core tables ---

export const user = pgTable("user", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	image: text("image"),
	role: text("role").notNull().default("user"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const session = pgTable("session", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	token: text("token").notNull().unique(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	expiresAt: timestamp("expires_at").notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const account = pgTable("account", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at"),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const verification = pgTable("verification", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

// --- application tables ---

export const iphone = pgTable("iphone", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	model: text("model").notNull(),
	storageGb: integer("storage_gb").notNull(),
	color: text("color").notNull(),
	condition: text("condition").notNull(), // "new" | "second"
	conditionPercentage: integer("condition_percentage"), // null for "new"
	priceIdr: integer("price_idr").notNull(),
	stock: integer("stock").notNull().default(0),
	description: text("description").notNull().default(""),
	imageUrl: text("image_url"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const order = pgTable("order", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	iphoneId: text("iphone_id")
		.notNull()
		.references(() => iphone.id, { onDelete: "restrict" }),
	quantity: integer("quantity").notNull().default(1),
	totalPriceIdr: integer("total_price_idr").notNull(),
	status: text("status").notNull().default("pending_payment"),
	proofOfTransferUrl: text("proof_of_transfer_url"),
	adminNote: text("admin_note"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
