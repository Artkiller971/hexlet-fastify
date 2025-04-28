import fastify from 'fastify';
import view from '@fastify/view';
import formbody from '@fastify/formbody';
import pug from 'pug';
import sanitize from 'sanitize-html';
import yup from 'yup';
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

await addRoutes(app, state);

app.get('/', (req, res) => res.view('src/views/index'));

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});