const { MongoClient } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return console.log('Unable to connect to the MongoDB server');
    }
    console.log('Connected to the MongoDB server');
    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne(
    //   {
    //     text: 'Something to do',
    //     completed: false
    //   },
    //   (err, res) => {
    //     if (err) {
    //       return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(res, undefined, 2));
    //   }
    // );

    db.collection('Users').insertOne(
      {
        name: 'Fluff',
        age: 8,
        location: 'Dreamland'
      },
      (err, res) => {
        if (err) {
          return console.log('There was an error');
        }
        console.log('User successfully added', res.ops);
      }
    );
    client.close();
  }
);
