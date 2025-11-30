import { DataTypes, Model, type Sequelize, type InferAttributes, type InferCreationAttributes, type CreationOptional, type BelongsToGetAssociationMixin } from 'sequelize'
import { type Product } from './product.model.js'

export class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
  declare id: CreationOptional<number>
  declare title: string
  declare text: string
  declare picture: string
  declare enabled?: boolean
  declare ProductId: number
  // 👇 Asociación inversa
  declare Product?: Product
  declare getProduct: BelongsToGetAssociationMixin<Product>
}
export default (sequelize: Sequelize) => {
  Item.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      picture: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      ProductId: { type: DataTypes.INTEGER }
    }, {
      sequelize,
      tableName: 'items',
      timestamps: false
    }
  )
}
