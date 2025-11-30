export interface IRepositoryResponse<T> {
  message: string
  results: T
}
export type Direction = 'ASC' | 'DESC'


export interface IPaginatedOptions<TDTO> {
  searchField?:Partial<keyof TDTO>
  search?: unknown | undefined
  page?: number
  limit?: number
  sortBy?: Partial<keyof TDTO>|string
  order?: Direction |string
}

export interface PaginateInfo { total: number, page: number, limit: number, totalPages: number }

export interface IPaginatedResults<TDTO> {
  message: string
  info: PaginateInfo
  data: TDTO[]

}
export type TUpdate<T> = Partial<Omit<T, 'id'>>
export interface IBaseRepository<TDTO, TCreate, TUpdate> {
  getAll: (field?: unknown, whereField?: keyof TDTO | string) => Promise<IRepositoryResponse<TDTO[]>>
  getById: (id: string | number) => Promise<IRepositoryResponse<TDTO>>
  getByField: (field: unknown, whereField: keyof TDTO | string) => Promise<IRepositoryResponse<TDTO>>
  getWithPages: (options?: IPaginatedOptions<TDTO>) => Promise<IPaginatedResults<TDTO>>
  create: (data: TCreate) => Promise<IRepositoryResponse<TDTO>>
  update: (id: string | number, data: TUpdate) => Promise<IRepositoryResponse<TDTO>>
  delete: (id: string | number) => Promise<IRepositoryResponse<string>>
}
export interface IExternalImageDeleteService<T> {
  deleteImage: (imageInfo: T) => Promise<string | undefined>
}
export const mockImageDeleteService: IExternalImageDeleteService<any> = {
  deleteImage: async (_imageInfo: any) => await Promise.resolve('true')
}
