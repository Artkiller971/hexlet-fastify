import yup from 'yup';
import routesF from './routes.js';
import encrypt from '../encrypt.js';

const routes = routesF();

export default (app, state) => {
  app.get(routes.newUserPath(), (req, res) => {
    res.view('src/views/users/new', { flash: res.flash() });
  });
  
  app.get(routes.usersPath(), (req, res) => {
    const term = req.query.term ?? '';
  
  
    const data = state.users.filter((user) => user.name.toLowerCase().includes(term.toLowerCase()))
    res.view('src/views/users/index', { term, users: data, routes, flash: res.flash() });
  });
  
  app.post(routes.usersPath(), {
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
      
      req.flash('error', { type: 'error', message: 'Ошибка регистрации'});
      res.view('src/views/users/new', { data, flash: res.flash()});
      return;
    }
  
    const user = {
      name,
      email,
      passwordDigest: encrypt(password),
    };
  
    state.users.push(user);

    req.flash('success', { type: 'success', message: 'Пользователь зарегистрирован'});
  
    res.redirect('/users');
  });

  app.get('/login', (req, res) => {
    res.view('src/views/users/login');
  })

  app.post('/session', (req, res) => {
    const { email, password } = req.body;

    const user = state.users.find((user) => user.email === email); {
      if (!user) {
        res.view('src/views/users/login', { error: new Error('No match for this email')});
      }
    }

    if (user.passwordDigest === encrypt(password)) {
      req.session.username = user.name;
      res.redirect('/');
    };
  })

  app.post('/session/delete', (req, res) => {
    req.session.destroy();
    res.redirect('/');
  })
  
  app.get('/users/:name', (req, res) => {
    const { name } = req.params
    const user = state.users.find(({ name: userName }) => userName === name);
    if (!user) {
      res.code(404).send({ message: 'User not found' });
      return;
    }
    const data = {
      user,
      routes,
    };
    res.view('src/views/users/show', data);
    
  });
}