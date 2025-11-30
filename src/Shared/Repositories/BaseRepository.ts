import type { Model, ModelStatic, WhereOptions, Attributes, Order, OrderItem } from 'sequelize'
import type { IBaseRepository, IRepositoryResponse, IPaginatedOptions, IPaginatedResults, Direction } from '../Interfaces/base.interface.js'
import { throwError, processError } from '../../Configs/errorHandlers.js'

export class BaseRepository<TModel extends Model,
  TDTO, TCreate, TUpdate = Partial<TCreate>,
> implements IBaseRepository<TDTO, TCreate, TUpdate> {
  constructor (
    protected Model: ModelStatic<TModel>,
    protected parserFn: (model: TModel) => TDTO,
    protected readonly modelName: string,
    protected readonly whereField: keyof TDTO & string

  ) {
    this.Model = Model
    this.parserFn = parserFn
    this.modelName = modelName
    this.whereField = whereField
  }

  async getAll (field?: unknown, searchField?: keyof TDTO | string): Promise<IRepositoryResponse<TDTO[]>> {
    // const whereClause = (field && whereField) ? { [whereField]: field } : {}
    let whereClause: WhereOptions<Attributes<TModel>> | undefined

    if (field && searchField) {
      whereClause = {
        [searchField]: field
      } as WhereOptions<Attributes<TModel>>
    }
    const models = await this.Model.findAll({ where: whereClause })

    return {
      message: `${this.Model.name} records retrieved successfully`,
      results: models.map(model => this.parserFn(model))
    }
  }

  async getWithPages (options?: IPaginatedOptions<TDTO>): Promise<IPaginatedResults<TDTO>> {
    const page = options?.page ?? 1
    const limit = options?.limit ?? 10

     let whereClause: WhereOptions<Attributes<TModel>> | undefined
        if (options!.search !==undefined && options!.searchField) {
      whereClause = {
        [options!.searchField]: options!.search
      } as WhereOptions<Attributes<TModel>>
    }
    const offset = (page - 1) * limit

    // 🔽 Transformar Record<keyof TDTO, Direction> en [['field', 'ASC']]
    const orderClause: Order | undefined = options?.sortBy
      ? [[options.sortBy as string, (options.order ?? 'ASC') as Direction] as OrderItem] 
      : undefined

    const { rows, count } = await this.Model.findAndCountAll({
      where: whereClause,
      offset,
      limit,
      distinct: true,
      order: orderClause
      // order: options?.order ? [[options.order?.field as string, options.order?.direction]] as Order : undefined
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

  async getById (id: string | number): Promise<IRepositoryResponse<TDTO>> {
    const model = await this.Model.findByPk(id)
    if (!model) throwError(`${this.Model.name} not found`, 404)
    return {
      message: `${this.Model.name} record retrieved successfully`,
      results: this.parserFn(model!)
    }
  }

  async getByField (
    field?: unknown,
    whereField: keyof TDTO | string = this.whereField
  ): Promise<IRepositoryResponse<TDTO>> {
    if (field == null) throwError(`No value provided for ${whereField.toString()}`, 400)
    const model = await this.Model.findOne({
      where: { [whereField]: field } as any
    })
    if (!model) throwError(`The ${whereField.toString()} "${field}" was not found`, 404)
    return {
      message: `${this.Model.name} record retrieved successfully`,
      results: this.parserFn(model!)
    }
  }

  async create (data: TCreate): Promise<IRepositoryResponse<TDTO>> {
    const exists = await this.Model.findOne({
      where: { [this.whereField]: (data as any)[this.whereField] } as any
    })
    if (exists) {
      throwError(
        `${this.Model.name} with ${this.whereField} ${(data as any)[this.whereField]} already exists`,
        400
      )
    }
    const model = await this.Model.create(data as any)
    return {
      message: `${this.Model.name} ${(data as any)[this.whereField]} created successfully`,
      results: this.parserFn(model)
    }
  }

  async update (id: string | number, data: TUpdate): Promise<IRepositoryResponse<TDTO>> {
    const model = await this.Model.findByPk(id)
    if (!model) throwError(`${this.Model.name} not found`, 404)
    const updated = await model!.update(data as Partial<TDTO>)
    return {
      message: `${this.Model.name} record updated successfully`,
      results: this.parserFn(updated)
    }
  }

  async delete (id: string | number): Promise<IRepositoryResponse<string>> {
    const model = await this.Model.findByPk(id)
    if (!model) throwError(`${this.Model.name} not found`, 404)
    const value = (model as any)[this.whereField]
    await model!.destroy()
    return {
      message: `${value} deleted successfully`,
      results: ''
    }
  }
}
