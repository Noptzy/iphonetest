import type { UseCases } from "@api/application/use-cases.ts"
import { adminProcedure, publicProcedure } from "@api/presentation/orpc/middleware.ts"
import { createIphoneSchema, idSchema, updateIphoneSchema } from "@api/presentation/orpc/schemas.ts"

export function buildIphoneRouter(iphone: UseCases["iphone"]) {
	return {
		list: publicProcedure.handler(() => iphone.list()),
		get: publicProcedure.input(idSchema).handler(({ input }) => iphone.get(input)),
		create: adminProcedure.input(createIphoneSchema).handler(({ input }) => iphone.create(input)),
		update: adminProcedure.input(updateIphoneSchema).handler(({ input }) => iphone.update(input)),
		delete: adminProcedure.input(idSchema).handler(({ input }) => iphone.delete(input)),
	}
}
