import { type User } from '../../../Configs/database.js'
export interface IUserTestSeq {
  id: string
  email: string
  password: string
  nickname?: string | null
  given_name: string
  picture?: string | null
  enabled: boolean
}
export interface CreateUserInput {
  email: string
  password: string
  nickname?: string | null
  given_name?: string | null
  picture?: string | null
  enabled: boolean
}
export type UpdateUserInput = Partial<CreateUserInput>

export const userDataTest = ['id', 'email', 'password', 'nickname', 'name', 'picture', 'enabled']
export const parser = (u: InstanceType<typeof User>): IUserTestSeq => {
  const raw = u.get()
  return {
    id: raw.id,
    email: raw.email,
    password: raw.password,
    nickname: raw.nickname ?? '',
    given_name: raw.given_name,
    picture: raw.picture ?? '',
    enabled: raw.enabled
  }
}

export const dataCreate = {
  email: 'user@email.com',
  password: '123456',
  nickname: 'userTest',
  given_name: 'user',
  picture: 'https://picsum.photos/200?random=16'
}
export const dataUpdate: UpdateUserInput = {
  email: 'user@email.com',
  password: '123456',
  nickname: 'userTest',
  given_name: 'Name of user',
  picture: 'https://picsum.photos/200?random=16',
  enabled: true
}

//* --------------------------------------------------
// ?          UserSeed
//* ------------------------------------------------
export const createSeedRandomElements = async (model: any, seed: unknown[]) => {
  try {
    if (!seed || seed.length === 0) throw new Error('No data')
    await model.bulkCreate(seed)
  } catch (error) {
    console.error('Error createSeedRandomElements: ', error)
  }
}
export const usersSeed = [
  {
    email: 'user1@email.com',
    password: '123456',
    nickname: 'userTest1',
    given_name: 'One',
    picture: 'https://picsum.photos/200?random=1',
    enabled: true
  },
  {
    email: 'user2@email.com',
    password: '123456',
    nickname: 'userTest2',
    given_name: 'Two',
    picture: 'https://picsum.photos/200?random=2',
    enabled: true
  },
  {
    email: 'user3@email.com',
    password: '123456',
    nickname: 'userTest3',
    given_name: 'Three',
    picture: 'https://picsum.photos/200?random=3',
    enabled: true
  },
  {
    email: 'user4@email.com',
    password: '123456',
    nickname: 'userTest4',
    given_name: 'Four',
    picture: 'https://picsum.photos/200?random=4',
    enabled: true
  },
  {
    email: 'user5@email.com',
    password: '123456',
    nickname: 'userTest5',
    given_name: 'Five',
    picture: 'https://picsum.photos/200?random=5',
    enabled: true
  },
  {
    email: 'user6@email.com',
    password: '123456',
    nickname: 'userTest6',
    given_name: 'Six',
    picture: 'https://picsum.photos/200?random=6',
    enabled: false
  },
  {
    email: 'user7@email.com',
    password: '123456',
    nickname: 'userTest7',
    given_name: 'Seven',
    picture: 'https://picsum.photos/200?random=7',
    enabled: false
  },
  {
    email: 'user8@email.com',
    password: '123456',
    nickname: 'userTest8',
    given_name: 'Eight',
    picture: 'https://picsum.photos/200?random=8',
    enabled: true
  },
  {
    email: 'user9@email.com',
    password: '123456',
    nickname: 'userTest9',
    given_name: 'Nine',
    picture: 'https://picsum.photos/200?random=9',
    enabled: true
  },
  {
    email: 'user10@email.com',
    password: '123456',
    nickname: 'userTest10',
    given_name: 'Ten',
    picture: 'https://picsum.photos/200?random=10',
    enabled: true
  },
  {
    email: 'user11@email.com',
    password: '123456',
    nickname: 'userTest11',
    given_name: 'Eleven',
    picture: 'https://picsum.photos/200?random=11',
    enabled: true
  },
  {
    email: 'user12@email.com',
    password: '123456',
    nickname: 'userTest12',
    given_name: 'Twelve',
    picture: 'https://picsum.photos/200?random=12',
    enabled: true
  },
  {
    email: 'user13@email.com',
    password: '123456',
    nickname: 'userTest13',
    given_name: 'Thirteen',
    picture: 'https://picsum.photos/200?random=13',
    enabled: true
  },
  {
    email: 'user14@email.com',
    password: '123456',
    nickname: 'userTest14',
    given_name: 'Fourteen',
    picture: 'https://picsum.photos/200?random=14',
    enabled: true
  },
  {
    email: 'user15@email.com',
    password: '123456',
    nickname: 'userTest15',
    given_name: 'Fifteen',
    picture: 'https://picsum.photos/200?random=15',
    enabled: false
  }
]
