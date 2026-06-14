import type { Order, OrderStatus } from "./order.ts"

export interface CreateOrderInput {
	userId: string
	iphoneId: string
	quantity: number
	totalPriceIdr: number
}

export interface OrderRepository {
	create(input: CreateOrderInput): Promise<Order>
	findById(id: string): Promise<Order | null>
	listByUser(userId: string): Promise<Order[]>
	listAll(): Promise<Order[]>
	attachProof(id: string, proofOfTransferUrl: string): Promise<Order | null>
	updateStatus(id: string, status: OrderStatus, adminNote: string | null): Promise<Order | null>
}
