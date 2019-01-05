const { ObjectID } = require('mongodb');
const { Todo } = require('./../../models/Todo');
const { User } = require('./../../models/User');
const jwt = require('jsonwebtoken');
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
  {
    _id: userOneId,
    email: 'fouad.tabbara@email.com',
    password: 'password123',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth' }, 'abc123').toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: 'userTwoEmail@email.com',
    password: 'password123'
  }
];
const todos = [
  {
    _id: new ObjectID(),
    text: 'First todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second todo',
    complete: true,
    completedAt: 333
  }
];

const populateTodos = done => {
  Todo.remove({})
    .then(() => {
      Todo.insertMany(todos);
    })
    .then(() => done());
};

const populateUsers = done => {
  User.remove({})
    .then(() => {
      const userOne = new User(users[0]).save();
      const userTwo = new User(users[1]).save();
      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};
module.exports = { todos, populateTodos, users, populateUsers };
