const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect(
  'mongodb://localhost:27017/TodoApp',
  { useNewUrlParser: true },
  (err, client) => {
    if (err) {
      return console.log('Unable to connect to the MongoDB server');
    }
    console.log('Connected to the MongoDB server');
    const db = client.db('TodoApp');

    db.collection('Users')
      .findOneAndUpdate(
        {
          _id: ObjectID('5bfdb1348c44043578452ece')
        },
        {
          $set: {
            name: 'Blowfeld'
          },
          $inc: {
            age: 1
          }
        },
        {
          returnOriginal: false
        }
      )
      .then(res => {
        console.log(res);
        client.close();
      });
  }
);
