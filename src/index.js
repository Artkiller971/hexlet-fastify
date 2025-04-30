import fastify from 'fastify';
import view from '@fastify/view';
import formbody from '@fastify/formbody';
import fastifyCookie from '@fastify/cookie';
import pug from 'pug';
import addRoutes from './routes/index.js'

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

await addRoutes(app, state);

app.get('/', (req, res) => {
  const visited = req.cookies.visited;

  const templateData = {
    visited,
  }

  res.cookie('visited', true);

  res.view('src/views/index', { templateData });
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});