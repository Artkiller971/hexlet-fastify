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

app.get('/', (req, res) => res.view('src/views/index'));


app.get('/users', (req, res) => {
  res.send('GET /users');
});

app.post('/users', (req, res) => {
  res.send('POST /users');
});

app.get('/hello', (req, res) => {
  const name = req.query.name || 'World';
  res.send(`Hello ${name}!`);
});

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

app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const user = state.users.find((user) => user.id === parseInt(id));
  if (!user) {
    res.code(404).send({ message: 'User not found' });
  } else {
    res.send(user);
  }
});

app.get('/courses/:courseId/lessons/:id', (req, res) => {
  res.send(`Course ID: ${req.params.courseId}; Lesson ID: ${req.params.id}`);
});

app.get('/users/:id/post/:postId', (req, res) => {
  res.send(`User ID: ${req.params.id}; Post ID: ${req.params.postId}`);
})

await app.register(view, { engine: { pug } });

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});