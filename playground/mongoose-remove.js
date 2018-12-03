const { mogoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/User');
const { ObjectID } = require('mongodb');

// Todo.remove({}).then(res => {
//   console.log(res)
// })

console.log(process.env);

Todo.findByIdAndRemove('5c02f38bc5bd9918b43adf18').then(res => {
  console.log(res);
});
