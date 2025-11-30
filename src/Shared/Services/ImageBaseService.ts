import { BaseService } from './BaseService.js'
import { throwError, processError } from '../../Configs/errorHandlers.js'
import { type IBaseRepository, type IRepositoryResponse, type IExternalImageDeleteService } from '../Interfaces/base.interface.js'

export class ImageBaseService<TDTO, TCreate, TUpdate> extends BaseService<TDTO, TCreate, TUpdate> {
    protected imageDeleteService: IExternalImageDeleteService<any>
    protected nameImage: keyof TDTO

    constructor(
        repository: IBaseRepository<TDTO, TCreate, TUpdate>,
        imageDeleteService: IExternalImageDeleteService<any>,
        nameImage: keyof TDTO
    ) {
        super(repository)
        this.imageDeleteService = imageDeleteService
        this.nameImage = nameImage
    }

    async handleImageDeletion(imageUrl: string) {
        if (imageUrl && imageUrl.trim()) {
            return await this.imageDeleteService.deleteImage(imageUrl)
        }
    }

    async update(
        id: string | number,
        data: TUpdate
    ): Promise<IRepositoryResponse<TDTO>> {
        try {
            let imageUrl: string | null = null
            let activeDel = false

            const register = await this.getById(id)
            if (!register) throwError('Element not found', 404)

            // 👇 Usamos una variable intermedia tipada
            const key = this.nameImage as keyof TDTO & keyof TUpdate

            if ((register.results[key] as unknown) !== (data[key] as unknown)) {
                imageUrl = register.results[key] as unknown as string
                activeDel = true
            }

            const updated = await super.update(id, data)
            const imgDeleted = activeDel ? await this.handleImageDeletion(imageUrl!) : null
            const messageUpd =
                activeDel ? `${updated.message}\n${imgDeleted}` : updated.message

            return {
                message: messageUpd,
                results: updated.results
            }
        } catch (error) {
            return processError(error, 'Service update error:')
        }
    }

    async delete(id: string | number): Promise<IRepositoryResponse<string>> {
        let imageUrl: string | null = null
        let activeDel: boolean = false
        try {
            const register = await this.getById(id)
            if (!register) throwError('Element not found', 404)

            if (register.results[this.nameImage] as unknown) {
                imageUrl = register.results[this.nameImage] as unknown as string
                activeDel = true
            }

            const deleted = await super.delete(id)
            const imgDeleted = activeDel ? await this.handleImageDeletion(imageUrl!) : null
            const messageUpd =
                activeDel ? `${deleted.message} and ${imgDeleted}` : deleted.message

            return {
                message: messageUpd,
                results: deleted.results
            }
        } catch (error) {
            return processError(error, 'Service delete error:')
        }
    }
}
