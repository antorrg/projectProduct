import { type Sequelize, DataTypes, Model, type Optional } from 'sequelize'

export interface LogAttributtes {
  id: number
  levelName: string
  levelCode: number
  message: string
  type?: string | null
  status?: number | null
  stack?: string | null
  contexts?: string[] | []
  pid: number
  time: number
  hostname: string
  keep: boolean
  createdAt?: Date
  updatedAt?: Date
}
export type LogCreationAttributtes = Optional<LogAttributtes, 'id' | 'stack' | 'status' | 'keep'>

export class Log
  extends Model<LogAttributtes, LogCreationAttributtes>{
  //implements LogAttributtes {
  // id!: number
  // levelName!: string
  // levelCode!: number
  // message!: string
  // type!: string | null
  // status!: number | null
  // stack!: string | null
  // contexts!: string[] | []
  // pid!: number
  // time!: number
  // hostname!: string
  // keep!: boolean
  // createdAt?: Date
  // updatedAt?: Date
}

export default (sequelize: Sequelize) => {
  Log.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      levelName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      levelCode: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      stack: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      contexts: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: []
      },
      pid: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      time: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      hostname: {
        type: DataTypes.STRING,
        allowNull: true
      },
      keep: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }, {
      sequelize,
      tableName: 'logs',
      timestamps: true
    }
  )
}
