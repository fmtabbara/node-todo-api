const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/Todo');
const { User } = require('./../models/User');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', done => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({ text })
      .expect(200)
      .expect(res => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then(todos => {
            expect(todos.length).toBe(3);
            expect(todos[2].text).toBe(text);
          })
          .then(() => done())
          .catch(e => done(e));
      });
  });

  it('should not create a todo with invalid body data', done => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({})
          .then(todos => {
            expect(todos.length).toBe(2);
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', done => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc create by another user', done => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 if todo not found', done => {
    const objID = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${objID}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return a 404 for non-object ids', done => {
    const objID = '1234';

    request(app)
      .get(`/todos/${objID}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete a todo based on id', done => {
    const hexID = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body.todo._id).toBe(hexID);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexID)
          .then(todo => {
            expect(todo).toBeFalsy();
            done();
          })
          .catch(err => done(err));
      });
  });

  it('should not delete a todo', done => {
    const hexID = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(hexID)
          .then(todo => {
            expect(todo).toBeTruthy();
            done();
          })
          .catch(err => done(err));
      });
  });

  it('should return 404 if todo not found', done => {
    const hexID = new ObjectID().toHexString();
    request(app)
      .delete(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if ObjectID is invalid', done => {
    request(app)
      .delete(`/todos/1234`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', done => {
    const hexID = todos[0]._id.toHexString();
    const newText = 'Some fresh text';
    request(app)
      .patch(`/todos/${hexID}`)
      .set('x-auth', users[0].tokens[0].token)
      .send({
        text: newText,
        complete: true
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.complete).toBe(true);
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should not update the todo created by another user', done => {
    const hexID = todos[0]._id.toHexString();
    const newText = 'Some fresh text';
    request(app)
      .patch(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text: newText,
        complete: true
      })
      .expect(404)
      .end(done);
  });

  it('should clear the completedAt when todo is not completed', done => {
    const hexID = todos[1]._id.toHexString();
    const newText = 'Some fresh text';
    request(app)
      .patch(`/todos/${hexID}`)
      .set('x-auth', users[1].tokens[0].token)
      .send({
        text: newText,
        complete: false
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(newText);
        expect(res.body.todo.complete).toBe(false);
        expect(res.body.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect(res => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return a 401 if not authenticated', done => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token + 'abc')
      .expect(401)
      .expect(res => {
        expect(res.text).toBe('Unauthorized');
      })
      .end(done);
  });
});

describe('Post /users', () => {
  it('should create a user', done => {
    const email = 'exampleEmail@email.com';
    const password = 'examplePassword123';

    request(app)
      .post('/users')
      .send({ email, password })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end(err => {
        if (err) {
          return done(err);
        }

        User.findOne({ email })
          .then(user => {
            expect(user).toBeTruthy();
            expect(user.password).not.toBe(password);
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should return validation errors if request invalid', done => {
    const email = 'fouad';
    const password = 'password123';
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });

  it('should not create a user if email in use', done => {
    const email = users[0].email;
    const password = 'password123';
    request(app)
      .post('/users')
      .send({ email, password })
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect(res => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens[1]).toMatchObject({
              access: 'auth',
              token: res.headers['x-auth']
            });
            done();
          })
          .catch(e => done(e));
      });
  });

  it('should reject invalid login', done => {
    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password + '123'
      })
      .expect(400)
      .expect(res => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id)
          .then(user => {
            expect(user.tokens.length).toBe(1);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('DELETE users/me/token', () => {
  it(' should remove access token on logout if a token exists', done => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[0]._id)
          .then(user => {
            expect(user.tokens.length).toBe(0);
            done();
          })
          .catch(e => done(e));
      });
  });
});
