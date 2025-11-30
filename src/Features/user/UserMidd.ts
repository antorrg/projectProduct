import { type Request, type Response, type NextFunction } from 'express'
import envConfig from '../../Configs/envConfig.js'
import bcrypt from 'bcrypt'

export class UserMidd {
  static createUser = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    req.body = {
      email,
      password: await bcrypt.hash(password, 12),
      nickname: email.split('@')[0],
      picture: envConfig.UserImg,
      enabled: true
    }
    next()
  }
}
