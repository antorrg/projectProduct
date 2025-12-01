import express from 'express'
import userRouter from './Features/user/user.routes.js'
import productRouter from './Features/product/product.routes.js'
import logRouter from './Features/systemLogs/log.routes.js'

const mainRouter = express.Router()

mainRouter.use('/api/v1/user', userRouter)

mainRouter.use('/api/v1/product', productRouter)

mainRouter.use('/api/v1/admin/logs', logRouter)

export default mainRouter
