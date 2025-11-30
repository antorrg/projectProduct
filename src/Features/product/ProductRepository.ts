import { BaseRepository } from '../../Shared/Repositories/BaseRepository.js'
import { throwError, processError } from '../../Configs/errorHandlers.js'
import type { ModelStatic,Order, OrderItem } from 'sequelize'
import { IPaginatedOptions, IPaginatedResults } from '../../Shared/Interfaces/base.interface.js'
import { Product } from '../../../Models/product.model.js'
import { Item } from '../../../Models/item.model.js'

import type {
  IProduct,
  ProductCreate,
  ProductUpdate,
  ProductDetailResponse,
  ProductWithItems,
  IProductDetail
} from './product.types.js'

export class ProductRepository extends BaseRepository<
  InstanceType<typeof Product>,
  IProduct,
  ProductCreate,
  ProductUpdate
> {
  private readonly SecondModel: ModelStatic<Item>
  private readonly combinedParser: (model: ProductWithItems) => IProductDetail

  constructor(
    Model: ModelStatic<Product>,
    parserFn: (model: InstanceType<typeof Product>) => IProduct,
    modelName: string,
    whereField: keyof IProduct & string,

    SecondModel: ModelStatic<Item>,
    combinedParser: (model: ProductWithItems) => IProductDetail
  ) {
    super(Model, parserFn, modelName, whereField)

    this.SecondModel = SecondModel
    this.combinedParser = combinedParser
  }
  async getWithPages(options?: IPaginatedOptions<IProduct> | undefined, isAdmin: boolean= false): Promise<IPaginatedResults<IProduct>> {
        const page = options?.page ?? 1
        const limit = options?.limit ?? 10
        const baseFilter = isAdmin ? {} : { enabled: true };
        const hasSearch =
          typeof options?.search === 'string' &&
          options.search.trim().length > 0 &&
          options?.searchField;

          const userFilter = hasSearch
            ? { [options.searchField!]: options.search }
            : {}

        // combinación de filtros
        const whereClause = { ...baseFilter, ...userFilter };
        const offset = (page - 1) * limit
    
        // 🔽 Transformar Record<keyof TDTO, Direction> en [['field', 'ASC']]
        const orderClause: Order | undefined = options?.sortBy
          ? [[options.sortBy as string, (options.order ?? 'ASC')] as OrderItem] 
          : undefined
    
        const { rows, count } = await this.Model.findAndCountAll({
          where: whereClause,
          offset,
          limit,
          distinct: true,
          order: orderClause
        })
        const data = rows.map(row => this.parserFn(row))
        return {
          message: `Total records: ${count}. ${this.Model.name}s retrieved successfully`,
          info: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit)
          },
          data
    
        }
  }
  async getDetail(id: number,isAdmin:boolean= false): Promise<ProductDetailResponse> {
    let filterTerm = isAdmin===true? false: true
    const whereClause= { enabled: filterTerm}
    const productFound = await this.Model.findByPk(id, {
      include: [{ model: this.SecondModel, as: 'Items', 
       where: {...whereClause}
      }]
    })
    if (!productFound) throwError(`${this.Model.name} not found`, 404)
    return {
      message: `${this.Model.name} record retrieved successfully`,
      results: this.combinedParser(productFound! as ProductWithItems)
    }
  }


  async createFull(data: ProductCreate): Promise<ProductDetailResponse> {
    const exists = await this.Model.findOne({
      where: { [this.whereField]: (data as any)[this.whereField] } as any
    })
    if (exists) {
      throwError(
        `${this.Model.name} with ${this.whereField} ${(data as any)[this.whereField]} already exists`,
        400
      )
    }
    const { items, ...productData } = data
    const product = await this.Model.create(productData as any)

    for (const item of items) {
      await this.SecondModel.create({
        ...item,
        ProductId: product.id // <-- clave de vinculación
      })
    }
    const productWithItems = await this.Model.findByPk(product.id, {
      include: [{ model: this.SecondModel, as: 'Items' }]
    })

    if (!productWithItems) throwError('Error creating detail record', 500)

    return {
      message: `${this.Model.name} created successfully`,
      results: this.combinedParser(productWithItems as ProductWithItems)
    }
  }
}
