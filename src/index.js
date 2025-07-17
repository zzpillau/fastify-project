
import fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import view from '@fastify/view'
import pug from 'pug'

import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const state = {
  users: [
    {id: '1', username: 'Tanya', email: 'Tyreek.Muller@yahoo.com'},
    {id: '2', username: 'Sasha', email: 'Kayden_Walsh35@yahoo.com'},
    {id: '3', username: 'Kitty', email: 'Desmond.Schoen73@yahoo.com'},
    {id: '4', username: 'Goose', email: 'Newell_Stokes90@hotmail.com'},
    {id: '5', username: 'Chiсken', email: 'Hannah.Davis84@yahoo.com'},
  ]
}

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

const port = 3000

await app.register(view, { engine: { pug } })


app.register(fastifyStatic, {
  root: path.join(__dirname, '../node_modules/bootstrap/dist/css'),
  prefix: '/assets/',
})

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
})

app.get('/', (req, res) => {
  res.view('src/views/index')
})

app.get('/hello', (req, res) => {
  const name = req.query.name
  res.send(name ? `Hello, ${name}!` : `Hello, World!`)
})

app.get('/users', (_req, res) => {
  const { users } = state
  const data = {
    users,
  }
  res.view('src/views/users/index', data)
})

app.get('/users/:id', (req, res) => {
  const { users } = state

  const { id } = req.params

  const user = users.find(u => u.id === id)

  if (!user) {
    res.code(404).send('User not found')
  }

  res.view(`src/views/users/show/`, user)
})

app.get('/users/:id/posts/:postId', (req, res) => {
  res.send(`User Id: ${req.params.id}; Post Id: ${req.params.postId}`)
})

app.post('/users', (req, res) => {
  res.send('POST /users')
})


