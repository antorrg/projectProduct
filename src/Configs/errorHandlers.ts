import { type Request, type Response, type NextFunction } from 'express'
import envConfig from './envConfig.js'
import logger from './logger.js'

type Controller = (req: Request, res: Response, next: NextFunction) => Promise<any>

class CustomError extends Error {
  public log: boolean
  constructor (log: boolean = false) {
    super()
    this.log = log
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  throwError (message: string, status: number): never {
    const error = new Error(message) as Error & { status?: number, contexts: string[] }
    error.status = Number(status) || 500
    error.contexts = []
    throw error
  }

  processError (err: unknown, contextMessage: string): never {
    let normalized: Error & { status?: number, contexts: string[] }

    if (err instanceof Error) {
    // ya es un Error
      normalized = err as Error & { status?: number, contexts: string[] }
      normalized.status = normalized.status ?? 500
      normalized.contexts = Array.isArray(normalized.contexts) ? normalized.contexts : []
    } else {
    // no es Error → lo convierto
      normalized = {
        name: 'UnknownError',
        message: String(err),
        status: 500,
        contexts: []
      }
    }

    // evitar duplicados de contexto
    const last = normalized.contexts[normalized.contexts.length - 1]
    if (!last || last !== contextMessage) normalized.contexts.push(contextMessage)

    throw normalized
  }
}
const environment = envConfig.Status
const errorHandler = new CustomError(environment === 'development' || environment === 'test')

export const middError = (message: string, status: number): Error & { status?: number, contexts?: string[] } => {
  const error = new Error(message) as Error & { status?: number, contexts?: string[] }
  error.status = status
  error.contexts = ['Middleware error:']
  return error
}
export const throwError = errorHandler.throwError.bind(errorHandler)

export const processError = errorHandler.processError.bind(errorHandler)

export const errorEndWare = (err: Error & { status?: number, contexts?: string[] }, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500
  const message = err.message || 'Internal server error'
  Array.isArray(err.contexts) ? err.contexts : ['Unhandled error']
  logger.error({ err }, `${message}`)
  res.status(status).json({
    success: false,
    message,
    data: null
  })
}

export const jsonFormat = (err: Error & { status?: number }, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof SyntaxError && 'status' in err && err.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'Invalid JSON format' })
  } else {
    next()
  }
}

export const notFoundRoute = (req: Request, res: Response, next: NextFunction): void => {
  next(middError('Not Found', 404))
}

export default {
  errorEndWare,
  throwError,
  processError,
  middError,
  jsonFormat,
  notFoundRoute
}
