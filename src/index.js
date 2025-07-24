
import fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import view from '@fastify/view'
import pug from 'pug'
// import sanitize from 'sanitize-html'
import formbody from '@fastify/formbody'
import addRoutes from './routes/index.js'

import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async () => {

  const app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    }
  })

  await app.register(view, { engine: { pug } })

  await app.register(formbody)

  app.register(fastifyStatic, {
    root: path.join(__dirname, '../node_modules/bootstrap/dist/css'),
    prefix: '/assets/',
  })

  addRoutes(app)
  return app
}

// без отображения - тренировка - первые шаги
// app.get('/users/:id/posts/:postId', (req, res) => {
//   res.send(`User Id: ${req.params.id}; Post Id: ${req.params.postId}`)
// })

// Приветствие по имени
// app.get('/hello', (req, res) => {
//   const name = req.query.name
//   res.send(name ? `Hello, ${name}!` : `Hello, World!`)
// })
