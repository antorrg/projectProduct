// import { type Sequelize, DataTypes, Model, type Optional } from 'sequelize'

// // Atributos que tiene la tabla
// export interface UserAttributes {
//   id: string
//   email: string
//   password: string
//   nickname?: string | null
//   given_name?: string | null
//   picture?: string | null
//   role: string
//   country?: string | null
//   enabled: boolean
// }

// // Atributos opcionales al crear (por ejemplo uid=1000(antonio) gid=1000(antonio) grupos=1000(antonio),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users),105(lpadmin),125(sambashare) lo genera Sequelize)
// export type UserCreationAttributes = Optional<
// UserAttributes,
// 'id' | 'nickname' | 'given_name' | 'picture' | 'role' | 'country' | 'enabled'
// >

// // Definición de la clase User tipada
// export class User
//   extends Model<UserAttributes, UserCreationAttributes>
//   implements UserAttributes {
//   declare id: string
//   declare email: string
//   declare password: string
//   declare nickname: string | null
//   declare given_name: string | null
//   declare picture: string | null
//   declare role: string
//   declare country: string | null
//   declare enabled: boolean
// }
import {
  type Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional
} from 'sequelize'

export class User extends Model<
InferAttributes<User>,
InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>
  declare email: string
  declare password: string
  declare nickname: string | null
  declare given_name: string | null
  declare picture: string | null
  declare role: string
  declare country: string | null
  declare enabled: boolean
}

// Función que define el modelo
export default (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      given_name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: true
      },
      role: {
        type: DataTypes.ENUM,
        values: ['SuperAdmin', 'Admin', 'User'],
        defaultValue: 'User'

      },
      country: {
        type: DataTypes.STRING,
        allowNull: true
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      }
    },
    {
      sequelize,
      tableName: 'users',
      timestamps: false
    }
  )

  return User
}
/*
        given_name: { type: DataTypes.STRING, allowNull: true },
        picture: { type: DataTypes.STRING, allowNull: true,},
        role:{type: DataTypes.SMALLINT, allowNull: false, defaultValue: 1,
          validate: {
            isIn: [[0, 1, 2, 9]], // Por ejemplo, 0: admin, 1: user, 2: moderator, 9:superUser
          },
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        enable: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: true
        }, */
