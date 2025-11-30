export class QueryAdapter {
  /**
   * Recibe req.query como Record<string, any>
   * Devuelve: { whereField, field }
   * Ambos tipados según TEntity
   */
  static parse<TEntity>(query: Record<string, any>) {
    const keys = Object.keys(query)

    if (keys.length === 0) {
      return { whereField: undefined, field: undefined } as {
        whereField: keyof TEntity | undefined
        field: TEntity[keyof TEntity] | undefined
      }
    }

    // tomamos el primer campo
    const whereField = keys[0] as keyof TEntity
    let field = query[whereField as string]

    // convertir string a tipo real (básico)
    field = QueryAdapter.#convert(field) as TEntity[keyof TEntity]

    return { whereField, field }
  }

  /** conversor básico */
  static #convert (value: any) {
    // true/false
    if (value === 'true') return true
    if (value === 'false') return false

    // número
    if (!isNaN(Number(value)) && value.trim() !== '') {
      return Number(value)
    }

    // array separado por comas
    if (typeof value === 'string' && value.includes(',')) {
      return value.split(',').map(v => v.trim())
    }

    // dejar tal cual
    return value
  }
}
