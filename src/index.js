import fastify from 'fastify'

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

app.get('/', (req, res) => {
  res.send('I\'m Fastify project!')
})

app.get('/hello', (req, res) => {
  const name = req.query.name
  res.send(name ? `Hello, ${name}!` : `Hello, World!`)
})

app.get('/users', (req, res) => {
  res.header('Content-Type', 'text/html; charset=utf-8')
  res.log.info({msg: 'Some info about the current request'})
  res.send(`
    <html>
      <head><title>Users</title></head>
      <body>
        <h1>Список пользователей</h1>
        <p>Тут будет HTML, а не просто текст.</p>
      </body>
    </html>
  `)
})

app.post('/users', (req, res) => {
  res.send('POST /users')
})

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`)
})