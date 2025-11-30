import { Sequelize } from 'sequelize'
import envConfig from './envConfig.js'
import models from '../../Models/index.js'
import logger from './logger.js'

const sequelize = new Sequelize(envConfig.DatabaseUrl, {
  logging: false,
  native: false
})

Object.values(models).forEach((modelDef) => {
  modelDef(sequelize)
})

const {
  User,
  Log,
  Product,
  Item,
  RefreshToken
} = sequelize.models
// Relations here below:
Product.hasMany(Item, {
  foreignKey: 'ProductId',
  as: 'Items',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
})
Item.belongsTo(Product, {
  foreignKey: 'ProductId',
  as: 'Product'
})

User.hasMany(RefreshToken, {
  foreignKey: 'UserId',
  as: 'RefreshTokens'
})
RefreshToken.belongsTo(User, {
  foreignKey: 'UserId',
  as: 'User'
})

// ------------------------
//    Initilization database:
// -------------------------
async function startUp(syncDb: boolean = false, rewrite: boolean = false) {
  try {
    await sequelize.authenticate()
    if (envConfig.Status !== 'production' && syncDb) {
      try {
        await sequelize.sync({ force: rewrite })
        logger.info(`🧪 Synced database: "force ${rewrite}"`)
      } catch (error) {
        logger.error(error, '❗Error syncing database')
      }
    }
    logger.info('🟢​ Database postgreSQL initialized successfully!!')
    // console.log('🟢​ Database postgreSQL initialized successfully!!')
  } catch (error) {
    logger.error(error, '❌ Error conecting database!')
  }
}
const closeDatabase = async () => {
  await sequelize.close()
  logger.info('🛑 Database disconnect')
}

export { startUp, closeDatabase, sequelize, User, Log, Product, Item, RefreshToken }
