import * as yup from 'yup'
import { readAndParse, addToRepo } from '../repositories/utilRepository.js'
import r from '../routes.js'
import { v4 as uuidv4 } from 'uuid'

export default (app) => {
// Просмотр списка пользователей
  app.get(r.usersPath(), (_req, res) => {
    const users = readAndParse('users')
    const data = {
      users,
    }
    res.view('src/views/users/index', data)
  })

// Просмотр конкретного пользователя
  app.get(r.userPath(':id'), (req, res) => {
    const users = readAndParse('users')

    const { id } = req.params

    const user = users.find(u => u.id === id)

    if (!user) {
      res.code(404).send('User not found')
    }

    res.view(`src/views/users/show/`, user)
  })

// Форма создания нового пользователя
  app.get(r.newUserPath(), (_req, res) => {
    res.view('src/views/users/new', {routes: r})
  })

// Создание пользователя
  app.post(r.usersPath(), {
    attachValidation: true,
    schema: {
      body: yup.object({
        username: yup.string().min(2, 'Имя должно быть не меньше двух символов'),
        email: yup.string().email('Обязательное поле'),
        password: yup.string().min(5, 'Пароль должен быть не меньше пяти символов'),
        passwordConfirmation: yup.string().min(5, 'Пароль должен быть не меньше пяти символов')
      })
    },
    validatorCompiler: ({ schema }) => (data) => {
      if (data.password !== data.passwordConfirmation) {
        return {
          error: Error('Пароли должны совпадать'),
        }
      }
      try {
        const result = schema.validateSync(data)
        return { value: result }
      }
      catch (e) {
        return { error: e }
      }
    }
  }, (req, res) => {

    if(req.validationError) {
      const { username, email, password, passwordConfirmation } = req.body;
      const data = {
        username, email, password, passwordConfirmation,
        error: req.validationError,
        routes: r
      }
      
      res.view('src/views/users/new', data)
      return
    }

    const { username, email, password } = req.body

    const user = {
      id: uuidv4(),
      username: username.trim(),
      email: email.toLowerCase(),
      password,
    }

    addToRepo('users', user)

    res.redirect(r.usersPath())
  })

// Форма редактирования пользователя
  app.get(r.editUserPath(':id'), (req, res) => {
    const { id: userId } = req.params

    const users = readAndParse('users')
    const user = users.find(({id}) => id === userId)

    if (!user) {
      res.code(404).send({message: 'User not found'})
    } else {
      res.view('src/views/users/edit.pug', { user, routes: r })
    }
  })

}