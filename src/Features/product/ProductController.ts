import { BaseController } from '../../Shared/Controllers/BaseController.js'
import { ProductService } from './ProductService.js'
import type { Request, Response } from 'express'
import type { ProductCreate, ProductUpdate, IProduct } from './product.types.js'

export class ProductController extends BaseController<IProduct, ProductCreate, ProductUpdate> {
    private productService: ProductService

    constructor(service: ProductService) {
        super(service)
        this.productService = service
    }
    getDetail = async (req: Request, res: Response) => {
        const { id } = req.params
        const result = await this.productService.getDetail(Number(id))
        BaseController.responder(res, 200, true, result.message, result.results)
    }
    createFull = async (req: Request, res: Response) => {
        const data = req.body
        const result = await this.productService.createFull(data)
        BaseController.responder(res, 201, true, result.message, result.results)
    }
}
