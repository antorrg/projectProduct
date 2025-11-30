import { processError, throwError } from '../../Configs/errorHandlers.js'
import { BaseRepository } from '../../Shared/Repositories/BaseRepository.js'
import { type User } from '../../../Models/user.model.js'
import type { ModelStatic, Model } from 'sequelize'
import { type IUserDTO, type IUserCreate, type IUserUpdate, parser, type LoginResponse } from './UserTypes.js'
import bcrypt from 'bcrypt'

export class UserRepository extends BaseRepository<InstanceType<typeof User>, IUserDTO, IUserCreate, IUserUpdate> {
  constructor (
    Model: ModelStatic<User>,
    parserFn: (model: User) => IUserDTO,
    modelName: string,
    whereField: keyof IUserDTO & string

  ) {
    super(
      Model,
      parserFn,
      modelName,
      whereField
    )
  }

  async #verifyUser (data: { email: string, password: string }) {
    try {
      const userFound = await this.Model.findOne({ where: { [this.whereField]: data.email } })

      if (!userFound) { throwError('User not found', 404) }
      if (!userFound!.enabled) { throwError('User blocked', 400) }
      const passwordMatch = await bcrypt.compare(userFound!.password, data.password)
      if (!passwordMatch) { throwError('Invalid password', 400) }
      return userFound
    } catch (error) {
      return processError(error, 'UserRepository, verify error')
    }
  }

  async login (data: { email: string, password: string }): Promise<LoginResponse> {
    const response = await this.#verifyUser(data)
    return {
      message: 'User logged in successfully',
      results: this.parserFn(response!),
    }
  }

  async updatePassword (data: { email: string, password: string, newPassword: string }): Promise<string> {
    try {
      const user = await this.#verifyUser(data)
      await user?.update({ password: data.newPassword })
      return 'User password updated successfully'
    } catch (error) {
      return processError(error, 'Update password error')
    }
  }
}
