import fastify from 'fastify';
import view from '@fastify/view';
import pug from 'pug';

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
  ],
};

const app = fastify();
const port = 3000;

await app.register(view, { engine: { pug } });

app.get('/', (req, res) => res.view('src/views/index'));

app.get('/courses', (req, res) => {
  const data = {
    courses: state.courses, // Где-то хранится список курсов
    header: 'Курсы по программированию',
  };
  res.view('src/views/courses/index', data);
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


app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});