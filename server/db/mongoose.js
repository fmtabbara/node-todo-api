const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let MONGOURI;
let db;

if (process.env.NODE_ENV === 'development') {
  MONGOURI = 'mongodb://127.0.0.1:27017/TodoApp';
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
      console.log(`Couldnt connect to the ${db} Database..`);
    }
  );

module.exports = { mongoose };
