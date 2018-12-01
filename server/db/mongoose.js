const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(
  'mongodb://Fouad:todolist1@ds141284.mlab.com:41284/todolist',
  { useNewUrlParser: true },
  () => console.log('Connected to the Database!'),
  err => console.log('Couldnt connect to the database...')
);

module.exports = { mongoose };
