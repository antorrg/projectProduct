import { type JwtPayload } from '../Shared/Auth/Auth.ts'

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
      userInfo?: { userId?: string, userRole?: number }
    }
  }
}
