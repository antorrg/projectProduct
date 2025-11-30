import fs from 'fs/promises'
import path from 'path'

const fixturesDir = './assets/fixtures'
const uploadDir = './assets/uploads'

export default async function prepareTestImages (q: number): Promise<string[]> {
  // asegurar que la carpeta uploads existe
  await fs.mkdir(uploadDir, { recursive: true })

  // leer archivos de fixtures
  const files = await fs.readdir(fixturesDir)
  const quantity = q && q > 0 ? Math.min(q, files.length) : files.length
  // copiar cada fixture a uploads
  const copied: string[] = []

  for (let i = 0; i < quantity; i++) {
    const file = files[i]
    const src = path.join(fixturesDir, file)
    const dest = path.join(uploadDir, file)
    await fs.copyFile(src, dest)
    copied.push(file)
  }

  return copied
}
