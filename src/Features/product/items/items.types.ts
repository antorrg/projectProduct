import type { Item } from '../../../../Models/item.model.js'

export interface IItem {
  id: number
  title: string
  text: string
  picture: string
  enabled: boolean
  ProductId: number
}
export type ItemCombined = Omit<IItem, 'text'>

export interface ItemCreate {
  text: string
  title: string
  picture: string
  ProductId?: number
}

export type ItemUpdate = Partial<ItemCreate>

export const parser = (i: any): IItem =>({    
    id: i.id,
    title: i.title,
    text: i.text,
    picture: i.picture,
    enabled: i.enabled ?? true,
    ProductId: i.ProductId
  })

