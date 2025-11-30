import { throwError, processError } from '../../Configs/errorHandlers.js'
import { type IBaseRepository, type IRepositoryResponse, type IPaginatedOptions, type IPaginatedResults } from '../Interfaces/base.interface.js'

export class BaseService<TDTO, TCreate, TUpdate> {
  protected repository: IBaseRepository<TDTO, TCreate, TUpdate>

  constructor(repository: IBaseRepository<TDTO, TCreate, TUpdate>) {
    this.repository = repository
  }

  async getAll(field?: unknown, whereField?: keyof TDTO | string): Promise<IRepositoryResponse<TDTO[]>> {
    return await this.repository.getAll(field, whereField)
  }

  async getById(id: string | number): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.getById(id)
  }

  async getByField(field: unknown, whereField: keyof TDTO | string): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.getByField(field, whereField)
  }

  async getWithPages(options?: IPaginatedOptions<TDTO>): Promise<IPaginatedResults<TDTO>> {
    return await this.repository.getWithPages(options)
  }

  async create(data: TCreate): Promise<IRepositoryResponse<TDTO>> {
    return await this.repository.create(data)
  }

  async update(
    id: string | number,
    data: TUpdate
  ): Promise<IRepositoryResponse<TDTO>> {
    try {
      const register = await this.getById(id)
      if (!register) throwError('Element not found', 404)

      const updated = await this.repository.update(id, data)

      return {
        message: updated.message,
        results: updated.results
      }
    } catch (error) {
      return processError(error, 'Service update error:')
    }
  }

  async delete(id: string | number): Promise<IRepositoryResponse<string>> {
    try {
      const register = await this.getById(id)
      if (!register) throwError('Element not found', 404)

      const deleted = await this.repository.delete(id)
      return {
        message: deleted.message,
        results: deleted.results
      }
    } catch (error) {
      return processError(error, 'Service delete error:')
    }
  }
}
