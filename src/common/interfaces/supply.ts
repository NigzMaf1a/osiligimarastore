type Purpose = 'Plumbing' | 'Masonry' | 'Painting' | 'Tiling' | 'Welding' | 'House Keeping' | 'Electrical'

export default interface Supply {
    supplyId: number
    supplyCode: string
    supplyName: string
    supplyPrice: number
    supplyPurpose: Purpose
    supplyDescription: string
}