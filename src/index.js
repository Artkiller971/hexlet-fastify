import fastify from 'fastify';
import view from '@fastify/view';
import formbody from '@fastify/formbody';
import fastifyCookie from '@fastify/cookie';
import session from '@fastify/session';
import pug from 'pug';
import addRoutes from './routes/index.js'
import routesF from './routes/routes.js';
import flash from '@fastify/flash';

const routes = routesF();

const state = {
  courses: [
    {
      id: 1,
      title: 'JS: Массивы',
      description: 'Курс про массивы в JavaScript',
    },
    {
      id: 2,
      title: 'JS: Функции',
      description: 'Курс про функции в JavaScript',
    },
    {
      id: 3,
      title: 'JS: Асинхронное программирование',
      description: 'Курс по асинхронному программированию в JavaScript',
    }
  ],
  users: [],
};



const app = fastify();
const port = 3000;

await app.register(view, { engine: { pug } });
await app.register(formbody);
await app.register(fastifyCookie);
await app.register(session, {
  secret: '1234567890asdfghjkl;qwertyuiopzx',
  cookie: { secure: false },
});
await app.register(flash);

await addRoutes(app, state);

app.get('/', (req, res) => {
  const visited = req.cookies.visited;
  const username = req.session.username;

  const templateData = {
    visited,
    username
  }

  res.cookie('visited', true);

  res.view('src/views/index', { templateData, routes });
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});