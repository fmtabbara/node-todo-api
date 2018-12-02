const { mogoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');
const { User } = require('./../server/models/User');
const { ObjectID } = require('mongodb');
const id = '5c02f38bc5bd9918b43adf18';

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

Todo.findById(id)
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
