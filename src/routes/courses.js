import yup from 'yup';
import routesF from './routes.js';

const routes = routesF();

export default (app, state) => {
  app.get(routes.coursesPath(), (req, res) => {
    const term = req.query.term ?? '';
  
  
    const data = state.courses.filter((course) => course.title.toLowerCase().includes(term.toLowerCase())
     || course.description.toLowerCase().includes(term.toLowerCase()));
    res.view('src/views/courses/index', { term, courses: data, routes });
  });
  
  app.get(routes.newCoursePath(), (req, res) => {
    res.view('src/views/courses/new');
  });
  
  app.post(routes.coursesPath(), {
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
  
    res.redirect(routes.coursesPath());
  })
  
  app.get(routes.coursePath(':id'), (req, res) => {
    const { id } = req.params
    const course = state.courses.find(({ id: courseId }) => courseId === parseInt(id));
    if (!course) {
      res.code(404).send({ message: 'Course not found' });
      return;
    }
    const data = {
      course,
      routes
    };
    res.view('src/views/courses/show', data);
  });
}