
import fastify from 'fastify'
import fastifyStatic from '@fastify/static'
import view from '@fastify/view'
import pug from 'pug'
// import sanitize from 'sanitize-html'
import formbody from '@fastify/formbody'
import uniqueId from 'lodash.uniqueid';


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
  ],
  courses: [
    {
      id: 'frontend-dev',
      title: 'Фронтенд-разработка с HTML/CSS/JS',
      description: 'Создание интерфейсов и адаптивной верстки. Основы веб-дизайна и HTML/CSS.'
    },
    {
      id: 'react-spa',
      title: 'React: SPA-проекты',
      description: 'React-компоненты, хуки и маршрутизация. JavaScript для веб-разработки.'
    },
    {
      id: 'node-backend',
      title: 'Backend на Node.js',
      description: 'Маршруты, middleware и подключение баз данных. Серверная разработка на JavaScript.'
    },
    {
      id: 'fullstack-js',
      title: 'Fullstack JavaScript',
      description: 'Создание фронта и бэка на JS с использованием React и Node. Полный стек технологий.'
    },
    {
      id: 'python-ml',
      title: 'Python и машинное обучение',
      description: 'Алгоритмы, библиотеки, нейросети и API. Python для анализа данных.'
    },
    {
      id: 'devops-container',
      title: 'DevOps и контейнеризация',
      description: 'Инфраструктура, пайплайны, мониторинг. Контейнеризация и автоматизация.'
    },
    {
      id: 'figma-design',
      title: 'Дизайн интерфейсов в Figma',
      description: 'UX/UI, прототипирование и дизайн-системы. Инструменты для веб-дизайна.'
    },
    {
      id: 'sql-databases',
      title: 'SQL и реляционные базы данных',
      description: 'Запросы, схемы, оптимизация. Управление данными и базы данных.'
    },
    {
      id: 'flutter-mobile',
      title: 'Мобильная разработка с Flutter',
      description: 'Кроссплатформенные приложения и адаптивный UI. Разработка мобильных приложений.'
    },
    {
      id: 'cyber-basics',
      title: 'Основы кибербезопасности',
      description: 'Сетевые атаки, защита информации и этичный хакинг. Безопасность в интернете.'
    }
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
  const { users } = state
  const data = {
    users,
  }
  res.view('src/views/users/index', data)
})

// отображаем юзера по ID
app.get('/users/:id', (req, res) => {
  const { users } = state

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

  state.users.push(user)

  res.redirect('/users')
})

// отображаем КУРСЫ и форму поиска

const normalized = (str) => str.trim().toLowerCase()

app.get('/courses', (req, res) => {
  const { term } = req.query
  const normalizedTerm = normalized(term || '');
    
  const filteredCourses = state.courses.filter(c => 
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

  state.courses.push(course)
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
