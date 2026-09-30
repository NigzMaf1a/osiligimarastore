export default interface Tool {
    toolId: number
    toolCode: string
    toolName: string
    toolPrice: number
    toolCondition: 'Good' | 'Bad' | 'Broken'
    toolPurpose: string
    toolPurchaseDate: Date
}