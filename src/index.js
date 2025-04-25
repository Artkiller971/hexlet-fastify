import fastify from 'fastify';
import view from '@fastify/view';
import formbody from '@fastify/formbody';
import pug from 'pug';
import sanitize from 'sanitize-html';
import yup from 'yup';

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

app.get('/', (req, res) => res.view('src/views/index'));

app.get('/courses', (req, res) => {
  const term = req.query.term ?? '';


  const data = state.courses.filter((course) => course.title.toLowerCase().includes(term.toLowerCase())
   || course.description.toLowerCase().includes(term.toLowerCase()));
  res.view('src/views/courses/index', { term, courses: data });
});

app.get('/courses/new', (req, res) => {
  res.view('src/views/courses/new');
});

app.post('/courses', {
  attachValidation: true,
  schema: {
    body: yup.object({
      title: yup.string().min(2, 'Название  не должно быть меньше двух символов'),
      description: yup.string().min(10, 'Описание не должно быть короче 10 символов'),
    })
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
    try {
      const result = schema.validateSync(data);
      return  {value: result };
    } catch (e) {
      return { error: e};
    }
  }
  }, (req, res) => {
  const id = state.courses[state.courses.length - 1].id + 1;

  const { title, description } = req.body;

  if (req.validationError) {
    const data = {
      title, description,
      error: req.validationError,
    };

    res.view('src/views/courses/new', data);
    return;
  }

  const course = {
    id,
    title,
    description,
  };

  state.courses.push(course);

  res.redirect('/courses');
})

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

app.get('/users/new', (req, res) => {
  res.view('src/views/users/new');
});

app.get('/users', (req, res) => {
  const term = req.query.term ?? '';


  const data = state.users.filter((user) => user.name.toLowerCase().includes(term.toLowerCase()))
  res.view('src/views/users/index', { term, users: data });
});

app.post('/users', {
  attachValidation: true,
  schema: {
    body: yup.object({
      name: yup.string().min(2, 'Имя должно быть не меньше двух символов'),
      email: yup.string().email(),
      password: yup.string().min(5),
      passwordConfirmation: yup.string().min(5),
    }),
  },
  validatorCompiler: ({ schema, method, url, httpPart }) => (data) => {
    if (data.password !== data.passwordConfirmation) {
      return {
        error: Error('Password confirmation is not equal the password'),
      };
    }
    try {
      const result = schema.validateSync(data);
      return { value: result };
    } catch (e) {
      return { error: e };
    }
  },
}, (req, res) => {
  const { name, email, password, passwordConfirmation } = req.body;

  if (req.validationError) {
    const data = {
      name, email, password, passwordConfirmation,
      error: req.validationError,
    };

    res.view('src/views/users/new', data);
    return;
  }

  const user = {
    name,
    email,
    password,
  };

  state.users.push(user);

  res.redirect('/users');
});

app.get('/users/:name', (req, res) => {
  const { name } = req.params
  const user = state.users.find(({ name: userName }) => userName === name);
  if (!user) {
    res.code(404).send({ message: 'User not found' });
    return;
  }
  const data = {
    user,
  };
  res.view('src/views/users/show', data);
  
});

app.listen({ port }, () => {
  console.log(`Example app listening on port ${port}`);
});