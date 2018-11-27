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

    //deleteMany
    // db.collection('Todos')
    //   .deleteMany({ text: 'Drink coffee' })
    //   .then(res => {
    //     console.log(res);
    //     client.close();
    //   });
    //deleteOne
    // db.collection('Todos')
    //   .deleteOne({ text: 'Eat lunch' })
    //   .then(res => {
    //     console.log(res);
    //     client.close();
    //   });
    //findOneAndDelete;
    const id = new ObjectID('5bfdb113bb1ee81ab81c8870');
    db.collection('Users')
      .findOneAndDelete({ _id: id })
      .then(res => {
        console.log(res);
        client.close();
      });
  }
);
