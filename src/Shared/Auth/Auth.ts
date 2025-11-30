import { type Request, type Response, type NextFunction } from 'express'
import pkg, { type Secret } from 'jsonwebtoken'
import crypto from 'crypto'
import eh from '../../Configs/errorHandlers.js'
import envConfig from '../../Configs/envConfig.js'
import { RefreshToken } from '../../Configs/database.js'

export interface JwtPayload {
    userId: string
    email: string
    internalData: string
    iat?: number
    exp?: number
}
export type Refresh = {
            token: string
            UserId: string | number
            expiresAt: Date | string
}
export class Auth {
    static token(user: { id: string, email: string, role: string }, expiresIn?: string | number): string {
        const intData = disguiseRole((Auth.#convertRole(user.role) as number), 5)
        const jwtExpiresIn: string | number = expiresIn ?? Math.ceil(Number(envConfig.ExpiresIn) * 60 * 60)
        const secret: Secret = envConfig.Secret
        return pkg.sign(
            { userId: user.id, email: user.email, internalData: intData },
            secret,
            { expiresIn: jwtExpiresIn as any }
        )
    }

    static refreshToken = async (user: { id: string }, expiresIn?: string | number,): Promise<Refresh> => {
        const secret: Secret = envConfig.Secret
        const jwtExpiresIn: string | number = expiresIn ?? '7d' // Default 7 days
        const token = pkg.sign(
            { userId: user.id, type: 'refresh' },
            secret,
            { expiresIn: jwtExpiresIn as any }
        )

        // Calculate expiry date
        const decoded = pkg.decode(token) as any
        const expiresAt = new Date(decoded.exp * 1000)

        return {
            token,
            UserId: user.id,
            expiresAt
        }
    }

    static async verifyToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let token: string | undefined = (req.headers['x-access-token'] as string) || req.headers.authorization
            if (!token) {
                next(eh.middError('Unauthorized access. Token not provided', 401)); return
            }
            if (token.startsWith('Bearer')) {
                token = token.slice(6).trim()
            }
            if (token === '' || token === 'null' || token === 'undefined') {
                next(eh.middError('Missing token!', 401)); return
            }

            const decoded = pkg.verify(token, envConfig.Secret) as JwtPayload

            // req.user = decoded
            const userId = decoded.userId
            const userRole = recoveryRole(decoded.internalData, 5)
            req.userInfo = { userId, userRole }

            next()
        } catch (err: any) {
            if (err.name === 'TokenExpiredError') {
                next(eh.middError('Expired token', 401)); return
            }
            next(eh.middError('Invalid token', 401))
        }
    }

    static verifyRefresh = (Model: InstanceType<typeof RefreshToken>, verifyService: any) => {

        return async(req: Request, res: Response, next: NextFunction) => {
            const token = req.cookies.refreshToken
            if (!token) {
            next(eh.middError('Refresh token missing', 401)); return
        }

        try {
            const decoded = pkg.verify(token, envConfig.Secret) as any
            if (decoded.type !== 'refresh') {
                next(eh.middError('Invalid token type', 401)); return
            }

            const storedToken = await verifyService(token)
            if (!storedToken) {
                next(eh.middError('Refresh token not found', 401)); return
            }
            if (storedToken.revoked) {
                next(eh.middError('Refresh token revoked', 401)); return
            }

            req.userInfo = { userId: decoded.userId }
            next()
        } catch (error) {
            next(eh.middError('Invalid or expired refresh token', 401))
        }
    }}

    static checkRole = (allowedRoles: number[]) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const { userRole } = req.userInfo || {}
            if (typeof userRole === 'number' && allowedRoles.includes(userRole)) {
                next()
            } else {
                next(eh.middError('Access forbidden!', 403))
            }
        }
    }

    static Roles: Record<string, number> = Object.freeze({
        SuperAdmin: 9,
        Admin: 3,
        User: 1
    })

    static #convertRole(p: number | string): string | number {
        if (typeof p === 'number') {
            return Object.keys(Auth.Roles).find(
                k => Auth.Roles[k] === p
            )?.toString() ?? 'User'
        }

        const key = p.trim()
        return Number(Auth.Roles[key]) ?? Number(Auth.Roles.User)
    }
}

// Funciones auxiliares (pueden ir fuera de la clase)
function disguiseRole(role: number, position: number): string {
    const generateSecret = (): string => crypto.randomBytes(10).toString('hex')
    const str = generateSecret()
    if (position < 0 || position >= str.length) throw new Error('Posición fuera de los límites de la cadena')
    const replacementStr = role.toString()
    return str.slice(0, position) + replacementStr + str.slice(position + 1)
}

function recoveryRole(str: string, position: number): number {
    if (position < 0 || position >= str.length) throw new Error('Posición fuera de los límites de la cadena')
    const recover = str.charAt(position)
    return parseInt(recover)
}
