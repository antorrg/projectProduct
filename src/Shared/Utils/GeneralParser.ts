export class GeneralParser {
  toDTO = <TDTO>(
    entity: any,
    allowedKeys: Array<keyof TDTO>,
    includes?: IncludeConfig<TDTO> | null // ← Nueva opción
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
        const related = entity[key]

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

/*
// DTOs
interface ProductDTO {
  id: string
  name: string
  price: number
  category: CategoryDTO
  brand: BrandDTO
  reviews: ReviewDTO[]
}

interface CategoryDTO {
  id: string
  name: string
}

interface BrandDTO {
  id: string
  name: string
}

interface ReviewDTO {
  id: string
  rating: number
  comment: string
  user: UserDTO
}

interface UserDTO {
  id: string
  name: string
  avatar: string
}

// Configuración de parsing
const productParseConfig = {
  keys: ['id', 'name', 'price'],
  includes: {
    category: {
      keys: ['id', 'name']
    },
    brand: {
      keys: ['id', 'name']
    },
    reviews: {
      keys: ['id', 'rating', 'comment'],
      includes: {
        user: {
          keys: ['id', 'name', 'avatar']
        }
      }
    }
  }
}

// En el repository:
async getById(id: string): Promise<ProductDTO> {
  const product = await Product.findByPk(id, {
    include: [
      { model: Category, as: 'category' },
      { model: Brand, as: 'brand' },
      {
        model: Review,
        as: 'reviews',
        include: [{ model: User, as: 'user' }]
      }
    ]
  })

  return parser.toDTO<ProductDTO>(
    product,
    productParseConfig.keys,
    productParseConfig.includes
  )
}
  */
