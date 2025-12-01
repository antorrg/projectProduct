import { Router } from 'express'
// import  from '../../../Models/user.model.js'
import { User } from '../../Configs/database.js'
import { BaseRepository } from '../../Shared/Repositories/BaseRepository.js'
import { BaseService } from '../../Shared/Services/BaseService.js'
import { ImageBaseService } from '../../Shared/Services/ImageBaseService.js'
import ImgsService from '../../Shared/Services/ImgsService.js'
import { BaseController } from '../../Shared/Controllers/BaseController.js'
import { type IUserCreate, type IUserDTO, IUserUpdate, parser } from './UserTypes.js'
import { Validator } from 'req-valid-express'
import { Auth } from '../../Shared/Auth/Auth.js'
import { create, update } from './schemas.js'
import { UserMidd } from './UserMidd.js'

const userRepository = new BaseRepository<InstanceType<typeof User>, IUserDTO, IUserCreate>(User, parser as any, 'User', 'email')
export const userService = new ImageBaseService(userRepository, ImgsService, 'picture')
const user = new BaseController(userService)

const password: RegExp = /^(?=.*[A-Z]).{8,}$/
const email: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const userRouter = Router()

userRouter.get(
  '/',
  user.getAll
)
userRouter.get(
  '/pages',
  user.getWithPages
)
userRouter.get(
  '/:id',
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  user.getById
)

userRouter.post(
  '/create',
  Validator.validateBody(create),
  Validator.validateRegex(
    email,
    'email',
    'Enter a valid email'
  ),
  Validator.validateRegex(
    password,
    'password',
    'Enter a valid password'
  ),
  UserMidd.createUser,
  user.create
)

userRouter.put(
  '/:id',
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  Validator.validateBody(update),
  user.update
)

userRouter.delete(
  '/:id',
  Auth.verifyToken,
  Validator.paramId('id', Validator.ValidReg.UUIDv4),
  user.delete
)

export default userRouter
