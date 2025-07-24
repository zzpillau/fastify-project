import r from '../routes.js'

export default (app) => {
  app.get(r.homePath(), (_req, res) => {
    res.view('src/views/index')
  })
}