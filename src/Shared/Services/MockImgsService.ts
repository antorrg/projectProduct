import { throwError, processError } from '../../Configs/errorHandlers.js'
import fs from 'fs/promises'
import path from 'path'

const LocalBaseUrl = process.env.LOCAL_BASE_URL

export default class MockImgsService {
  static mockUploadNewImage = async (file: any) => {
    try {
      const uploadDir = './assets/uploads'
      // Asegurarse que exista la carpeta
      await fs.mkdir(uploadDir, { recursive: true })
      const newPath = path.join(uploadDir, file.originalname)
      await fs.writeFile(newPath, file.buffer)
      return `${LocalBaseUrl}/assets/uploads/${file.originalname}`
    } catch (error) {
      return processError(error, 'Mock Images error (upload): ')
    }
  }

  static mockFunctionDelete = async (imageUrl: string) => {
    const filename = path.basename(imageUrl)
    if (!path.extname(filename)) {
      throwError(`URL inválida, no contiene archivo: ${imageUrl}`, 400)
    }
    const filePath = path.join('./assets/uploads', filename)
    try {
      await new Promise(res => setTimeout(res, 1000))
      await fs.unlink(filePath)
      return `Image ${filePath} deleted successfully`
    } catch (error) {
      return processError(error, `Error al borrar imagen local: ${filename}`)
    }
  }
}
