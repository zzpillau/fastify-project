const routes = {
  homePath: () => '/',
  usersPath: () => '/users',
  userPath: (id) => `/users/${id}`,
  newUserPath: () => '/users/new',
  editUserPath: (id) => `/users/${id}/edit`,
  coursesPath: () => '/courses',
  newCoursePath: () => '/courses/new',
}

export default routes
