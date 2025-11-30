import app from './src/app.js'
import { startUp } from './src/Configs/database.js'
import envConfig from './src/Configs/envConfig.js'
import logger from './src/Configs/logger.js'

async function serverBootstrap () {
  try {
    await startUp()
    app.listen(envConfig.Port, () => {
      logger.info(`Server is listening on port ${envConfig.Port}\nServer in ${envConfig.Status}\n 🚀​ Everything is allright!!`)
      console.log(`Server is listening on port ${envConfig.Port}\nServer in ${envConfig.Status}\n 🚀​ Everything is allright!!`)
      if (envConfig.Status === 'development') {
        console.log(`Swagger: View and test the endpoints at http://localhost:${envConfig.Port}/api-docs`)
      }
    })
  } catch (error) {
    logger.fatal(error, 'Error initalizing app')
    process.exit(1)
  }
}

serverBootstrap()
