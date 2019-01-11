const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');
const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/Todo');
const { User } = require('./models/User');
const { authenticate } = require('./middleware/authenticate');

const app = express();
const PORT = process.env.PORT || 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the app...');
});

app.post('/todos', authenticate, (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  newTodo.save().then(
    doc => {
      res.send(doc);
    },
    err => res.status(400).send(err)
  );
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id }).then(
    todos => {
      res.send({
        success: true,
        todos
      });
    },
    err => {
      res.status(400).send(err);
    }
  );
});

app.get('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send({});
  }

  Todo.findOne({
    _id: id,
    _creator: req.user.id
  })
    .then(todo => {
      if (!todo) {
        return res.status(404).send({});
      }

      res.send({ todo });
    })
    .catch(err => res.status(400).send({}));
});

app.delete('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  })
    .then(todo => {
      if (todo) {
        res.send({ todo });
      }
      return res.status(404).send();
    })
    .catch(err => res.status(404).send('Id not found'));
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const { id } = req.params;
  const body = _.pick(req.body, ['text', 'complete']);

  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.complete) && body.complete) {
    body.completedAt = new Date().getTime();
  } else {
    body.complete = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
    { _id: id, _creator: req.user._id },
    { $set: body },
    { new: true }
  )
    .then(todo => {
      if (!todo) {
        return res.status(404).send();
      }
      res.send({ todo });
    })
    .catch(err => {
      res.status(400).send();
    });
});

//POST /users

app.post('/users', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  const user = new User(body);
  user.generateAuthToken().then(result => {
    user.tokens = user.tokens.concat([result]);

    user
      .save()
      .then(user => res.header('x-auth', result.token).send(user))
      .catch(err => res.status(400).send(err));
  });
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//POST /users/login

app.post('/users/login', (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      user.generateAuthToken().then(result => {
        user.tokens = user.tokens.concat([result]);

        user
          .save()
          .then(user => res.header('x-auth', result.token).send(user))
          .catch(err => res.status(400).send(err));
      });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

//DELETE /users/me/token

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => {
      res.status(400).send();
    }
  );
});
app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));

module.exports = { app };
