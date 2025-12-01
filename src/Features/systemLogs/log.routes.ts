import express from 'express'
import { LoggerServiceDb } from '../../Configs/Logger/LoggerServiceDb.js'
import { LoggerController } from '../../Configs/Logger/LoggerController.js'
import { Validator } from 'req-valid-express'
import logQuery from './logSchemas.js'
import { allowedQueryValues } from '../../Shared/Utils/allowedQueryValues.js'

const loggerService = new LoggerServiceDb()
const logger = new LoggerController(loggerService)

const logRouter = express.Router()

logRouter.get(
    '/',
    Validator.validateQuery(logQuery),
    allowedQueryValues({
    searchField: ['levelName', 'message', 'status'],
    sortBy: ['id', 'time', 'createdAt'],
    order:['ASC', 'DESC']
    }), 
    logger.getAll
)

logRouter.get(
    '/:id', 
    Validator.paramId('id', Validator.ValidReg.INT),
    logger.getById)

logRouter.patch(
    '/:id', 
    Validator.paramId('id', Validator.ValidReg.INT),
    Validator.validateBody({keep:{type:'boolean'}}),
    logger.update)

logRouter.delete(
    '/:id', 
    Validator.paramId('id', Validator.ValidReg.INT),
    logger.delete)

logRouter.delete(
    '/clean/:id',
    Validator.paramId('id', Validator.ValidReg.INT),
    logger.deleteAll)

export default logRouter