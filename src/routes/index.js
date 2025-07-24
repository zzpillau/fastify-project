import root from './root.js'
import users from './users.js'
import courses from './courses.js'

const controllers = [
  root,
  users,
  courses
]

export default (app) => controllers.forEach(f => f(app))