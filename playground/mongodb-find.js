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

    // db.collection('Users')
    //   .find({ name: 'Fill' })
    //   .toArray()
    //   .then(
    //     docs => {
    //       console.log('Users:');
    //       console.log(JSON.stringify(docs, undefined, 2));
    //       client.close(() => console.log('Database is now closed'));
    //     },
    //     err => {
    //       console.log('Unable to fetch users', err);
    //     }
    //   );

    db.collection('Users')
      .find({ name: 'Fluff' })
      .toArray()
      .then(
        docs => {
          console.log('Users doc:' + JSON.stringify(docs, undefined, 2));
          client.close(() => console.log('Database is now closed'));
        },
        err => {
          return console.log('Unable to fetch users', err);
        }
      );
  }
);
