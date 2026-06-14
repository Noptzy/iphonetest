import type { UseCases } from "../../application/use-cases.ts"
import { adminProcedure, publicProcedure } from "../orpc/middleware.ts"
import { createIphoneSchema, idSchema, updateIphoneSchema } from "../orpc/schemas.ts"

/** Browsing the catalog is public; mutations are admin-only. */
export function buildIphoneRouter(iphone: UseCases["iphone"]) {
	return {
		list: publicProcedure.handler(() => iphone.list()),
		get: publicProcedure.input(idSchema).handler(({ input }) => iphone.get(input)),
		create: adminProcedure.input(createIphoneSchema).handler(({ input }) => iphone.create(input)),
		update: adminProcedure.input(updateIphoneSchema).handler(({ input }) => iphone.update(input)),
		delete: adminProcedure.input(idSchema).handler(({ input }) => iphone.delete(input)),
	}
}
