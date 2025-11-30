import {
  type Sequelize,
  DataTypes,
  Model,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type ForeignKey
} from 'sequelize'
import { type User } from './user.model.js'

export class RefreshToken extends Model<
InferAttributes<RefreshToken>,
InferCreationAttributes<RefreshToken>
> {
  declare id: CreationOptional<string>
  declare token: string
  declare UserId: ForeignKey<User['id']>
  declare expiresAt: Date
  declare revoked: CreationOptional<boolean>
}

export default (sequelize: Sequelize) => {
  RefreshToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      tableName: 'refresh_tokens',
      timestamps: true
    }
  )

  return RefreshToken
}
