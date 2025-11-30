import type { Product } from '../../../Models/product.model.js'
import type { Item } from '../../../Models/item.model.js'
import { type ItemCreate, type ItemCombined } from './items/items.types.js'

export interface IProduct {
  id: number
  title: string
  picture: string
  logo: string
  info_header: string
  info_body: string
  url: string
  enabled: boolean
}
export interface ProductCreate {
  title: string
  picture: string
  logo: string
  info_header: string
  info_body: string
  url: string
  items: ItemCreate[]
}
export type ProductUpdate = Partial<IProduct>
export interface IProductDetail {
  product: IProduct
  Items: ItemCombined[]
}
export interface ProductDetailResponse {
  message: string
  results: IProductDetail
}

export type ProductWithItems =
  InstanceType<typeof Product> & {
    Items?: Array<InstanceType<typeof Item>>
  }

export const parser = (p: any): IProduct => ({
  id: p.id,
  title: p.title,
  picture: p.picture,
  logo: p.logo,
  info_header: p.info_header,
  info_body: p.info_body,
  url: p.url,
  enabled: p.enabled
})


export const combinedParser = (p: ProductWithItems): IProductDetail => ({
  product: {
    id: p.id,
    title: p.title,
    picture: p.picture,
    logo: p.logo,
    info_header: p.info_header,
    info_body: p.info_body,
    url: p.url,
    enabled: p.enabled
  },
  Items: p.Items?.map(i => ({
    id: i.id,
    title: i.title,
    picture: i.picture,
    enabled: i.enabled ?? true,
    ProductId: i.ProductId
  })) ?? []
})
