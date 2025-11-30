import { ImageBaseService } from '../../Shared/Services/ImageBaseService.js'
import type { ProductDetailResponse, ProductCreate, ProductUpdate, IProduct } from './product.types.js'
import { ProductRepository } from './ProductRepository.js'

export class ProductService extends ImageBaseService<IProduct, ProductCreate, ProductUpdate> {
    private productRepository: ProductRepository

    constructor(
        repository: ProductRepository,
        imageService: any,
        nameImage: keyof IProduct
    ) {
        super(repository, imageService, nameImage)
        this.productRepository = repository
    }
    async getDetail(id: number): Promise<ProductDetailResponse> {
        return await this.productRepository.getDetail(id)
    }
    async createFull(data: ProductCreate): Promise<ProductDetailResponse> {
        return await this.productRepository.createFull(data)
    }
}
