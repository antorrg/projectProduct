// import { User } from '../../Configs/database.js'
import { type User } from '../../../Models/user.model.js'
import { type IBaseRepository } from '../../Shared/Interfaces/base.interface.js'
export interface IUserDTO {
  id: string
  email: string
  nickname?: string | null
  given_name: string
  picture?: string | null
  role: string
  country?: string
  enabled: boolean
}
export interface IUserCreate {
  id?: string
  email: string
  password?: string
  nickname?: string | null
  given_name?: string | null
  picture?: string | null
  role?: string | null
  country?: string
  enabled: boolean
}
export type IUserUpdate = Partial<IUserCreate>

export const parser = (u: User): IUserDTO => {
  const raw = u
  return {
    id: raw.id,
    email: raw.email,
    nickname: raw.nickname ?? '',
    given_name: raw.given_name ?? '',
    role: raw.role,
    picture: raw.picture ?? '',
    country: raw.country ?? '',
    enabled: raw.enabled
  }
}
export interface LoginResponse {
  message: string
  results: IUserDTO
}
export interface IUserResponse extends IBaseRepository<IUserDTO, IUserCreate, IUserUpdate> {
  login: (data: { email: string, password: string, newPassword: string }) => Promise<LoginResponse>
  updatePassword: () => Promise<string>
}
// export const userData = ['id', 'email', 'nickname', 'given_name', 'picture', 'role', 'country', 'enabled'] satisfies Array<keyof IUserDTO>
