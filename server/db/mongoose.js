const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let MONGOURI;
let db;

if (process.env.NODE_ENV === 'development') {
  MONGOURI = 'mongodb://localhost:27017/TodoApp';
  db = 'Local';
} else {
  MONGOURI = 'mongodb://Fouad:todolist1@ds141284.mlab.com:41284/todolist';
  db = 'Cloud';
}

mongoose
  .connect(
    MONGOURI,
    { useNewUrlParser: true }
  )
  .then(
    () => {
      console.log(`Connected to the ${db} Database!`);
    },
    err => {
      console.log(`Couldnt connect to the ${db} database..`);
    }
  );

module.exports = { mongoose };
