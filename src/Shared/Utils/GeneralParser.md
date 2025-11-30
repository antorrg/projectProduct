

# 🧩 **1. Clase GeneralParser**

Esta es la clase:

```ts
export class GeneralParser {
  constructor(
    private extractor: (entity: any) => any,
  ) {}

  // Arrow function para no perder this
  toDTO = <TDTO>(entity: any, allowedKeys: (keyof TDTO)[]): TDTO => {
    const raw = this.extractor(entity)
    const dto: any = {}

    for (const key of allowedKeys) {
      dto[key] = raw[key]
    }

    return dto as TDTO
  }
}
```

Eso es TODO lo que necesitamos para comenzar.

---

# ⭐ **2. ¿Cómo funciona esto?**

### 👉 Paso 1: la clase recibe cómo extraer datos:

Para Sequelize:

```ts
const parser = new GenericParser((u) => u.get({ raw: true }))
```

Para Mongoose:

```ts
const parser = new GenericParser((u) => u.toObject())
```

Para Prisma (ya devuelve plano):

```ts
const parser = new GenericParser((u) => u)
```

Para memoria: (array de datos)

```ts
const parser = new GenericParser((u) => ({ ...u }))
```

**Una sola línea, una sola vez.**

---

# ⭐ **3. Después, lo usamos tipadamente:**

```ts
const result = await userModel.findOne(...)
const userDTO = parser.toDTO<IUserEntity, UserDTO>(result)
```

Eso:

* convierte automáticamente la instancia del ORM en un objeto plano
* respeta el tipo de salida que vos especificás
* no necesita que escribas un parser personalizado para cada entidad

---

# ⭐ **4. Integración con ExampleService**

Podemos inyectarlo así:

```ts
const userParser = new GenericParser((u) => u.get({ raw: true }))

const newParser = new GeneralParser(u =>({...u}))
const parser = <TDTO>(p: any, allowedKeys: (keyof TDTO)[]) => newParser.toDTO<TDTO>(p, allowedKeys)

// Y en la clase:
export class ExampleService<TEntity extends BaseModel, TDTO> implements IBaseRepository<TEntity, TDTO>{
    protected parser = parser
    protected Model: TEntity[]
    protected searchField: keyof TEntity
    protected allowedKeys: (keyof TDTO)[]
    constructor(
        data: TEntity[] = [], 
        searchField: keyof TEntity,
       allowedKeys: (keyof TDTO)[],
    ){
        this.Model = data,
       // this.parser = parser
        this.searchField = searchField
        this.allowedKeys = allowedKeys
    }
   // parser = newParser.toDTO<TEntity, TDTO>
   getAll (query: Record<string, any>) :IRepositoryResponse<TDTO[]>{
        const {whereField, field} = QueryAdapter.parse<TEntity>(query)
        let result = this.Model
        if(whereField && whereField!== undefined){
          result = this.Model.filter(item => item[whereField] === field)
        
        }
          return{
            message: 'Elements found successfully',
            results: result.map(item => this.parser(item, this.allowedKeys))
          }
    }
```

---

# ⭐ **5. ¿Como implementar allowedKeys?**

Podemos hacer una versión más limpia:

```ts
// ✅ Define DTOs específicos:
export interface UserDTO{
  id:number
  name:string
  username:string
  email: string
  phone: number
  enabled: boolean
  createdAt: string
  updatedAt?: string | undefined
}
export const userDtoTemplate: UserDTO = {
  id: 0,
  name: "",
  username: "",
  email: "",
  phone: 0,
  enabled: true,
  createdAt: "",
  updatedAt: ""
}
// y el en el archivo adonde instancio:
const keys = Object.keys(userDtoTemplate) as (keyof UserDTO)[]

const userService= new ExampleService<IUser, UserDTO>(users, 'name', keys)
```

O también:

```ts
// ✅ Define DTOs específicos:
export interface UserPublicDTO {
    id: string
    email: string
    nickname?: string | null
    name: string 
    picture?: string | null
    enabled: boolean
   
}

// users.repository.ts
const keys: (keyof UserPublicDTO)[] = [
  'id', 'email', 'nickname', 'name', 'picture', 'enabled'
]
const userService= new ExampleService<IUser, UserDTO>(users, 'name', keys)
```

---


# 🎉 **Resultado final**

Con este patrón conseguimos:

### ✔ Un parser para ORM **configurable desde constructor**

```ts
new GenericParser((u) => u.get({ raw:true }))
```

### ✔ Un DTO generado automáticamente, SIN escribir parser por entidad

```ts
parser.toDTO<IUserEntity, UserDTO>(entity)
```

### ✔ Un parser seguro, reutilizable y desacoplado del modelo interno

Podemos usarlo con Sequelize, Prisma, Mongoose o arrays.

---

# 🔥 Solo nos preocupamos del tipado de la api y de la información que queremos publicar**

* genera automáticamente el parser basado en allowedKeys
---
## Variable multiple.

Este parser incluye la posibilidad de multiples modelos (include)

```ts
export class GenericParser {
  toDTO = <TDTO>(
    entity: any, 
    allowedKeys: (keyof TDTO)[],
    includes?: IncludeConfig<TDTO>  // ← Nueva opción
  ): TDTO => {
    const dto: any = {}
    
    // Parsear campos principales
    for (const key of allowedKeys) {
      // Si NO es una relación, acceso directo
      if (!includes || !(key in includes)) {
        dto[key] = entity[key]
      }
    }
    
    // Parsear relaciones
    if (includes) {
      for (const [key, config] of Object.entries(includes)) {
        const related = entity[key as string]
        
        if (!related) {
          dto[key] = null
          continue
        }
        
        // Si es array (hasMany, belongsToMany)
        if (Array.isArray(related)) {
          dto[key] = related.map(item => 
            this.toDTO(item, config.keys, config.includes)
          )
        } else {
          // Si es objeto único (hasOne, belongsTo)
          dto[key] = this.toDTO(related, config.keys, config.includes)
        }
      }
    }
    
    return dto as TDTO
  }
}

// Tipos helper
export interface IncludeConfig<T> {
  [K: string]: {
    keys: string[]
    includes?: IncludeConfig<any>
  }
}
```
```ts
// Defines UNA VEZ la estructura completa
const productConfig = {
  allowedKeys: ['id', 'name', 'price'],
  includes: {
    category: { keys: ['id', 'name'] },
    brand: { keys: ['id', 'name', 'logo'] },
    reviews: {
      keys: ['id', 'rating', 'comment'],
      includes: {
        user: { keys: ['id', 'name'] }  // ← Anidación infinita
      }
    }
  }
}
```
#### Solo para estudio (respuesta de claude)
```ts
// ==========================================
// utils/GenericParser.ts
// ==========================================

export interface IncludeConfig {
  keys: string[]
  includes?: Record<string, IncludeConfig>
}

export class GenericParser {
  /**
   * Parsea una entidad a DTO con soporte para relaciones anidadas
   * @param entity - Modelo de Sequelize/Mongoose
   * @param allowedKeys - Campos permitidos del modelo principal
   * @param includes - Configuración de relaciones anidadas
   */
  toDTO = <TDTO>(
    entity: any,
    allowedKeys: (keyof TDTO)[],
    includes?: Record<string, IncludeConfig>
  ): TDTO => {
    if (!entity) return null as any

    const dto: any = {}

    // 1. Parsear campos principales (no relaciones)
    for (const key of allowedKeys) {
      const keyStr = key as string
      
      // Si NO es una relación incluida, acceso directo
      if (!includes || !(keyStr in includes)) {
        dto[key] = entity[keyStr]
      }
    }

    // 2. Parsear relaciones (includes)
    if (includes) {
      for (const [relationKey, config] of Object.entries(includes)) {
        const related = entity[relationKey]

        if (!related) {
          dto[relationKey] = null
          continue
        }

        // Relación hasMany o belongsToMany (array)
        if (Array.isArray(related)) {
          dto[relationKey] = related.map(item =>
            this.toDTO(item, config.keys as any, config.includes)
          )
        } 
        // Relación hasOne o belongsTo (objeto único)
        else {
          dto[relationKey] = this.toDTO(
            related,
            config.keys as any,
            config.includes
          )
        }
      }
    }

    return dto as TDTO
  }

  /**
   * Helper para parsear arrays
   */
  toDTOArray = <TDTO>(
    entities: any[],
    allowedKeys: (keyof TDTO)[],
    includes?: Record<string, IncludeConfig>
  ): TDTO[] => {
    return entities.map(e => this.toDTO<TDTO>(e, allowedKeys, includes))
  }
}


// ==========================================
// Interfaces/base.interface.ts
// ==========================================

export interface IRepositoryResponse<T> {
  message: string
  results: T
}

export interface IPaginatedResults<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}


// ==========================================
// repositories/SequelizeRepository.ts
// ==========================================

import type { Model, ModelStatic, WhereOptions } from 'sequelize'
import type { IBaseRepository, IRepositoryResponse } from '../Interfaces/base.interface.js'
import { throwError } from '../../Configs/errorHandlers.js'
import { GenericParser, type IncludeConfig } from '../Utils/GeneralParser.js'

const parser = new GenericParser()

export interface RepositoryConfig<TDTO> {
  allowedKeys: (keyof TDTO)[]
  includes?: Record<string, IncludeConfig>
}

export class SequelizeRepository<TDTO, TCreate, TUpdate = Partial<TCreate>> {
  constructor(
    protected readonly Model: ModelStatic<Model>,
    protected readonly modelName: string,
    protected readonly config: RepositoryConfig<TDTO>
  ) {}

  async getAll(
    whereClause: WhereOptions = {},
    includeModels?: any[] // Sequelize includes
  ): Promise<IRepositoryResponse<TDTO[]>> {
    const models = await this.Model.findAll({
      where: whereClause,
      include: includeModels
    })

    return {
      message: `${this.modelName} records retrieved successfully`,
      results: parser.toDTOArray<TDTO>(
        models,
        this.config.allowedKeys,
        this.config.includes
      )
    }
  }

  async getById(
    id: string,
    includeModels?: any[]
  ): Promise<IRepositoryResponse<TDTO>> {
    const model = await this.Model.findByPk(id, {
      include: includeModels
    })

    if (!model) {
      throwError('NOT_FOUND', `${this.modelName} not found`)
    }

    return {
      message: `${this.modelName} record retrieved successfully`,
      results: parser.toDTO<TDTO>(
        model,
        this.config.allowedKeys,
        this.config.includes
      )
    }
  }

  async getByField(
    field: unknown,
    fieldName: keyof TDTO & string,
    includeModels?: any[]
  ): Promise<IRepositoryResponse<TDTO>> {
    const model = await this.Model.findOne({
      where: { [fieldName]: field } as WhereOptions,
      include: includeModels
    })

    if (!model) {
      throwError('NOT_FOUND', `${this.modelName} not found`)
    }

    return {
      message: `${this.modelName} record retrieved successfully`,
      results: parser.toDTO<TDTO>(
        model,
        this.config.allowedKeys,
        this.config.includes
      )
    }
  }

  async create(data: TCreate): Promise<IRepositoryResponse<TDTO>> {
    const model = await this.Model.create(data as any)

    return {
      message: `${this.modelName} created successfully`,
      results: parser.toDTO<TDTO>(
        model,
        this.config.allowedKeys,
        this.config.includes
      )
    }
  }

  async update(
    id: string,
    data: TUpdate
  ): Promise<IRepositoryResponse<TDTO>> {
    const model = await this.Model.findByPk(id)

    if (!model) {
      throwError('NOT_FOUND', `${this.modelName} not found`)
    }

    await model.update(data as any)

    return {
      message: `${this.modelName} updated successfully`,
      results: parser.toDTO<TDTO>(
        model,
        this.config.allowedKeys,
        this.config.includes
      )
    }
  }

  async delete(id: string): Promise<IRepositoryResponse<void>> {
    const model = await this.Model.findByPk(id)

    if (!model) {
      throwError('NOT_FOUND', `${this.modelName} not found`)
    }

    await model.destroy()

    return {
      message: `${this.modelName} deleted successfully`,
      results: undefined as any
    }
  }
}


// ==========================================
// EJEMPLO DE USO: ProductRepository
// ==========================================

// DTOs
export interface ProductDTO {
  id: string
  name: string
  price: number
  description: string
  stock: number
  category: CategoryDTO
  brand: BrandDTO
  reviews: ReviewDTO[]
  createdAt: string
  updatedAt: string
}

export interface CategoryDTO {
  id: string
  name: string
  slug: string
}

export interface BrandDTO {
  id: string
  name: string
  logo: string
  country: string
}

export interface ReviewDTO {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: UserDTO
}

export interface UserDTO {
  id: string
  name: string
  avatar: string
}

export interface CreateProductInput {
  name: string
  price: number
  description: string
  stock: number
  categoryId: string
  brandId: string
}

export type UpdateProductInput = Partial<CreateProductInput>


// Configuración de parsing con includes
const productConfig: RepositoryConfig<ProductDTO> = {
  // Campos del producto (excluyendo relaciones)
  allowedKeys: [
    'id',
    'name',
    'price',
    'description',
    'stock',
    'createdAt',
    'updatedAt'
  ],
  
  // Configuración de relaciones
  includes: {
    category: {
      keys: ['id', 'name', 'slug']
    },
    
    brand: {
      keys: ['id', 'name', 'logo', 'country']
    },
    
    reviews: {
      keys: ['id', 'rating', 'comment', 'createdAt'],
      // Relación anidada: review -> user
      includes: {
        user: {
          keys: ['id', 'name', 'avatar']
        }
      }
    }
  }
}

// Importar modelos de Sequelize
// import { Product, Category, Brand, Review, User } from '../models'

export class ProductRepository extends SequelizeRepository<
  ProductDTO,
  CreateProductInput,
  UpdateProductInput
> {
  constructor() {
    super(
      Product, // Modelo de Sequelize
      'Product',
      productConfig
    )
  }

  // Método personalizado: Obtener producto con todas las relaciones
  async getWithAllRelations(id: string): Promise<IRepositoryResponse<ProductDTO>> {
    return this.getById(id, [
      { model: Category, as: 'category' },
      { model: Brand, as: 'brand' },
      {
        model: Review,
        as: 'reviews',
        include: [{ model: User, as: 'user' }]
      }
    ])
  }

  // Método personalizado: Lista de productos con solo categoría
  async getProductList(): Promise<IRepositoryResponse<ProductDTO[]>> {
    return this.getAll(
      {}, // Sin filtros
      [{ model: Category, as: 'category' }] // Solo incluye categoría
    )
  }

  // Método personalizado: Productos por categoría
  async getByCategory(categoryId: string): Promise<IRepositoryResponse<ProductDTO[]>> {
    return this.getAll(
      { categoryId }, // Filtro
      [
        { model: Category, as: 'category' },
        { model: Brand, as: 'brand' }
      ]
    )
  }
}


// ==========================================
// EJEMPLO: UserRepository (más simple)
// ==========================================

export interface IUserDTO {
  id: string
  email: string
  name: string
  nickname: string | null
  avatar: string | null
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserInput {
  email: string
  password: string
  name: string
  nickname?: string
  avatar?: string
}

const userConfig: RepositoryConfig<IUserDTO> = {
  allowedKeys: [
    'id',
    'email',
    'name',
    'nickname',
    'avatar',
    'enabled',
    'createdAt',
    'updatedAt'
  ]
  // Sin includes porque User no tiene relaciones en este ejemplo
}

export class UserRepository extends SequelizeRepository<
  IUserDTO,
  CreateUserInput,
  Partial<CreateUserInput>
> {
  constructor() {
    super(
      User, // Modelo de Sequelize
      'User',
      userConfig
    )
  }
}


// ==========================================
// USO EN CONTROLLERS
// ==========================================

// products.controller.ts
const productRepo = new ProductRepository()

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params
  
  // Trae producto con TODAS las relaciones configuradas
  const response = await productRepo.getWithAllRelations(id)
  
  res.json(response)
}

export const listProducts = async (req: Request, res: Response) => {
  // Solo trae categoría (más ligero)
  const response = await productRepo.getProductList()
  
  res.json(response)
}

export const getProductsByCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params
  
  const response = await productRepo.getByCategory(categoryId)
  
  res.json(response)
}
```