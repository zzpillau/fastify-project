import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const buildFilePath = (route) => path.join(__dirname, 'data', `${route}.json`)

export const readAndParse = (route) => {
  const file = fs.readFileSync(buildFilePath(route), 'utf8')
  const parsed = JSON.parse(file)
  return parsed
}

export const addToRepo = (route, data) => {
  const parsed = readAndParse(route)
  parsed.push(data)
  fs.writeFileSync(buildFilePath(route), JSON.stringify(parsed, null, 2))
}

