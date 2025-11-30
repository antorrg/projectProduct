import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Product, Item, startUp, closeDatabase } from '../../Configs/database.js'
import { ProductRepository } from './ProductRepository.js'
import * as base from './product.types.js'
import * as help from './product.help.js'

describe('PruductRepository test:', () => {
  beforeAll(async () => {
    await startUp(true, true)
  })
  afterAll(async () => {
    await closeDatabase()
  })
  const test = new ProductRepository(Product as any, base.parser, 'Product', 'title', Item as any, base.combinedParser)
  describe('Create', () => {
    it('should create a product with items', async () => {
      const product = await test.createFull(help.dataCreate)
      console.log(product)
      expect(product.message).toBe('Product created successfully')
      expect(product.results.product.title).toBe(help.dataCreate.title)
      expect(product.results.Items.length).toBe(1)
      expect(product.results.Items[0].title).toBe(help.dataCreate.items[0].title)
    })

  })

  describe('Get Detail', () => {
    it('should retrieve a product with its items', async () => {
      const product = await test.getDetail(1)
      expect(product.message).toBe('Product record retrieved successfully')
      expect(product.results.product.title).toBe(help.dataCreate.title)
      expect(product.results.Items.length).toBe(1)
      expect(product.results.Items[0].title).toBe(help.dataCreate.items[0].title)
    })

    it('should throw error if product not found', async () => {
      await expect(test.getDetail(999)).rejects.toThrow('Product not found')
    })
  })

})
