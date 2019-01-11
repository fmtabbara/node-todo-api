const mongoose = require('mongoose');
const { configEnv } = require('./../config/config');

mongoose.Promise = global.Promise;

const { MONGOURI, db } = configEnv();

mongoose
  .connect(
    MONGOURI,
    { useNewUrlParser: true }
  )
  .then(
    () => {
      console.log(`Connected to the ${db} Database!`);
    },
    err => {
      console.log(`Couldnt connect to the ${db} Database..`);
    }
  );

module.exports = { mongoose };
