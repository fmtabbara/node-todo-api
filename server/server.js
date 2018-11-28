const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/Todo');
const { User } = require('./models/User');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const newTodo = new Todo({
    text: req.body.text
  });

  newTodo.save().then(
    doc => {
      res.send(doc);
    },
    err => res.status(400).send(err)
  );
});

app.get('/todos', (req, res) => {
  Todo.find({}).then(
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

app.listen(3000, () => console.log('Server started on PORT: 3000'));

module.exports = { app };