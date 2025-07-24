import * as yup from 'yup'
import { readAndParse, addToRepo } from '../repositories/utilRepository.js'
import r from '../routes.js'
import { v4 as uuidv4 } from 'uuid'

export default (app) => {
  const normalized = (str) => str.trim().toLowerCase()

  app.get(r.coursesPath(), (req, res) => {
    const { term } = req.query
    const normalizedTerm = normalized(term || '');

    const courses = readAndParse('courses')
      
    const filteredCourses = courses.filter(c => 
      normalized(c.title).includes(normalizedTerm)
      || normalized(c.description).includes(normalizedTerm)
    )
    const data = {
      term,
      courses: filteredCourses,
      routes: r
    }
    res.view('src/views/courses/index', data)
  })

  // добавляем новый КУРС
  // форма
  app.get(r.newCoursePath(), (_req, res)=> {
    res.view('src/views/courses/new', { routes: r })
  })

  // отправка
  app.post(r.coursesPath(), (req, res) => {
    const course = {
      id: uuidv4(),
      title: req.body.title,
      description: req.body.description
    }

    addToRepo('courses', course)
    res.redirect(r.coursesPath())
  })
}