
import fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import view from '@fastify/view'
import pug from 'pug'
// import sanitize from 'sanitize-html'
import formbody from '@fastify/formbody'
import uniqueId from 'lodash.uniqueid';

import { readAndParse, addToRepo } from './repositories/utilRepository.js'


import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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

await app.register(formbody)

app.register(fastifyStatic, {
  root: path.join(__dirname, '../node_modules/bootstrap/dist/css'),
  prefix: '/assets/',
})

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
})

// Обработчики

// главная - PUG
app.get('/', (_req, res) => {
  res.view('src/views/index')
})

// отображение всех юзеров - PUG
app.get('/users', (_req, res) => {
  // const { users } = state
  const users = readAndParse('users')
  const data = {
    users,
  }
  res.view('src/views/users/index', data)
})

// отображаем юзера по ID
app.get('/users/:id', (req, res) => {
  // const { users } = state
  const users = readAndParse('users')

  const { id } = req.params

  const user = users.find(u => u.id === id)

  if (!user) {
    res.code(404).send('User not found')
  }

  res.view(`src/views/users/show/`, user)
})

// добавить нового Юзера
// форма
app.get('/users/new', (_req, res) => {
  res.view('src/views/users/new')
})

// отправка
app.post('/users', (req, res) => {
  const user = {
    id: uniqueId('user_'),
    username: req.body.name.trim(),
    email: req.body.email.toLowerCase(),
    password: req.body.password,
  }

  // state.users.push(user)
  addToRepo('users', user)

  res.redirect('/users')
})

// отображаем КУРСЫ и форму поиска

const normalized = (str) => str.trim().toLowerCase()

app.get('/courses', (req, res) => {
  const { term } = req.query
  const normalizedTerm = normalized(term || '');

  const courses = readAndParse('courses')
    
  const filteredCourses = courses.filter(c => 
    normalized(c.title).includes(normalizedTerm)
    || normalized(c.description).includes(normalizedTerm)
  )
  const data = {term, courses: filteredCourses}
  res.view('src/views/courses/index', data)
})

// добавляем новый КУРС
// форма
app.get('/courses/new', (_req, res)=> {
  res.view('src/views/courses/new')
})

// отправка
// app.post('/courses')
app.post('/courses', (req, res) => {
  const course = {
    id: uniqueId('course_'),
    title: req.body.title,
    description: req.body.description
  }

  // state.courses.push(course)
  addToRepo('courses', course)
  res.redirect('/courses')
})

// без отображения - тренировка - первые шаги
app.get('/users/:id/posts/:postId', (req, res) => {
  res.send(`User Id: ${req.params.id}; Post Id: ${req.params.postId}`)
})

// Приветствие по имени
app.get('/hello', (req, res) => {
  const name = req.query.name
  res.send(name ? `Hello, ${name}!` : `Hello, World!`)
})

// ОПАСНЫЙ html
// app.get('/users/:id', (req, res) => {
//   // const escapedId = sanitize(req.params.id)
//   const dangerHtml = req.params.id
//   res.type('html')
//   // res.send(`<h1>${escapedId}</h1>`)
//   // res.send(`<h1>${dangerHtml}</h1>`)
//   res.view('src/views/users/attack', { dangerHtml })
// })
