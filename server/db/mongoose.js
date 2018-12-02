const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose
  .connect(
    'mongodb://localhost:27017/TodoApp',
    { useNewUrlParser: true }
  )
  .then(
    () => {
      console.log('Connected to the Local Database!');
    },
    err => {
      mongoose
        .connect(
          'mongodb://Fouad:todolist1@ds141284.mlab.com:41284/todolist',
          { useNewUrlParser: true }
        )
        .then(
          () => {
            console.log('Connected to the Cloud Database!');
          },
          err => {
            console.log('Couldnt connect to the database..');
          }
        );
    }
  );

module.exports = { mongoose };
