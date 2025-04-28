export default () => {
  const routes = {
    coursesPath: () => '/courses',
    coursePath: (id) => `/courses/${id}`,
    newCoursePath: () => '/courses/new',
    usersPath: () => '/users',
    newUserPath: () => '/users/new',
    userPath: (id) => `/users/${id}`
  }
  
  return routes;
}