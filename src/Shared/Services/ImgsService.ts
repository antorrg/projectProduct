// import { XXXXServices } from '../../ExternalProviders/xxxx.js' //Crear el servicio...
import MockImgsService from './MockImgsService.js'
import envConfig from '../../Configs/envConfig.js'

// Cambiar la segunda opcion por el servicio de imagenes creado
const deleteImageByUrl = envConfig.Status !== 'production' ? MockImgsService.mockFunctionDelete : MockImgsService.mockFunctionDelete
const selectUploaders = envConfig.Status !== 'production' ? MockImgsService.mockUploadNewImage : MockImgsService.mockUploadNewImage

export default class ImgsService {
  static uploadNewImage = async (file: any) => {
    return await selectUploaders(file)
  }

  static deleteImage = async (imageUrl: string) => {
    return await deleteImageByUrl(imageUrl)
  }
}
