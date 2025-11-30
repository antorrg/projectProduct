import express from 'express'
import { Validator } from 'req-valid-express'
import { ProductController } from './ProductController.js'
import { ProductRepository } from './ProductRepository.js'
import { ProductService } from './ProductService.js'
import { Product } from '../../../Models/product.model.js'
import { Item } from '../../../Models/item.model.js'
import { parser, combinedParser } from './product.types.js'
import ImgsService from '../../Shared/Services/ImgsService.js'
import { createProductSchema, updateProductSchema, queryProductSchema } from './schemas/product.schema.js'
import itemRouter from './items/items.routes.js'
import { allowedQueryValues } from '../../Shared/Utils/allowedQueryValues.js'

const productRepository = new ProductRepository(
    Product,
    parser,
    'Product',
    'title',
    Item,
    combinedParser
)
const productService = new ProductService(productRepository, ImgsService, 'picture')
const productController = new ProductController(productService)

const productRouter = express.Router()

productRouter.get(
    '/',
    productController.getAll
)

productRouter.get(
    '/pages',
    Validator.validateQuery(queryProductSchema),
    allowedQueryValues({
        searchField: ['title'],
        sortBy: ['title', 'id'],
        order: ['ASC', 'DESC']
    }),
    productController.getWithPages
)

productRouter.get(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    productController.getDetail
)

productRouter.post(
    '/',
    Validator.validateBody(createProductSchema),
    productController.createFull
)

productRouter.put(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    Validator.validateBody(updateProductSchema),
    productController.update
)

productRouter.delete(
    '/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    productController.delete
)
productRouter.use('/item', itemRouter)

export default productRouter
