import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';
import sanitize from 'sanitize-html';

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
};

const app = fastify();
const port = 3000;

await app.register(view, { engine: { pug } });

app.get('/', (req, res) => res.view('src/views/index'));

app.get('/courses', (req, res) => {
  const term = req.query.term ?? '';


  const data = state.courses.filter((course) => course.title.toLowerCase().includes(term.toLowerCase())
   || course.description.toLowerCase().includes(term.toLowerCase()));
  res.view('src/views/courses/index', { term, courses: data });
});

app.get('/courses/:id', (req, res) => {
  const { id } = req.params
  const course = state.courses.find(({ id: courseId }) => courseId === parseInt(id));
  if (!course) {
    res.code(404).send({ message: 'Course not found' });
    return;
  }
  const data = {
    course,
  };
  res.view('src/views/courses/show', data);
});

app.get('/users/:id', (req, res) => {
  const escapedId = sanitize(req.params.id);
  res.type('html');
  res.send(`<h1>${escapedId}</h1>`);
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});