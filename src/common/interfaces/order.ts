type OrderStatus = '' | '' | ''

interface OrderItem {
    supplyId: number
    supplyName: string
    supplyPrice: number
    quantity: number
}

export default interface Order {
    orderId: number
    orderRef: string
    orderDate: Date
    orderItems: OrderItem[]
    orderPrice: number
    orderStatus: OrderStatus
}