import express from 'express'
import {Validator} from 'req-valid-express'
import {Item} from '../../../Configs/database.js'
import { BaseRepository } from '../../../Shared/Repositories/BaseRepository.js'
import { ImageBaseService } from '../../../Shared/Services/ImageBaseService.js'
import { BaseController } from '../../../Shared/Controllers/BaseController.js'
import {parser, type ItemCreate, type ItemUpdate} from './items.types.js'
import { itemCreate, itemUpdate } from './schemas/itemschemas.js'
import ImgsService from '../../../Shared/Services/ImgsService.js'

const itemRepository = new BaseRepository(Item, parser, 'Item', 'title')
const itemService = new ImageBaseService(itemRepository, ImgsService, 'picture')    
const itemController = new BaseController(itemService)

const itemRouter = express.Router()
itemRouter.post('/create', Validator.validateBody(itemCreate), itemController.create)
itemRouter.get('/:id', Validator.paramId('id',Validator.ValidReg.INT), itemController.getById)
itemRouter.put('/:id', Validator.paramId('id',Validator.ValidReg.INT),Validator.validateBody(itemUpdate), itemController.update)
itemRouter.delete('/:id', Validator.paramId('id',Validator.ValidReg.INT), itemController.delete)

export default itemRouter

