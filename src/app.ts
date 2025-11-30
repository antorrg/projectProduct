import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import eh from './Configs/errorHandlers.js'
import mainRouter from './routes.js'
import envConfig from './Configs/envConfig.js'

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(eh.jsonFormat)
// ⚙️ Importación dinámica solo si está en desarrollo
if (envConfig.Status === 'development') {
  const { default: swaggerUi } = await import('swagger-ui-express')
  const { default: swaggerJsDoc } = await import('swagger-jsdoc')
  const { default: swaggerOptions } = await import('./Shared/Swagger/swaggerOptions.js')

  const swaggerDocs = swaggerJsDoc(swaggerOptions)
  const swaggerUiOptions = {
    swaggerOptions: {
      docExpansion: 'none' // Oculta todas las rutas al cargar
    }
  }

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, swaggerUiOptions))
}
app.use(mainRouter)
app.use(eh.notFoundRoute)
app.use(eh.errorEndWare)

export default app
