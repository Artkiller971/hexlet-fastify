import users from './users.js';
import courses from './courses.js'

const controllers = [
  users,
  courses,
];

export default (app, state) => controllers.forEach((f) => f(app, state));
