const { mogoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/User');
const { ObjectID } = require('mongodb');
const id = '5bff0f3cde6694394ccbfd2c';
const userId = '5bfdcc7f3a7a3f1a5cf525e111';

if (!ObjectID.isValid(id)) {
  return console.log('ID not valid');
}

// Todo.find({
//   _id: id
// })
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// Todo.findById(id).then(res => {
//   if (!res) {
//     return console.log('The id is not recognised');
//   }
//   console.log('Todo by ID:', res);
// });

User.findById(userId)
  .then(user => {
    if (!user) {
      return console.log('user does not exist');
    }
    console.log({ user });
  })
  .catch(err => {
    if (err) {
      return console.log('There was an err');
    }
  });
