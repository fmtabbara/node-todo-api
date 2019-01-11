const configEnv = () => {
  let MONGOURI;
  let JWT_SECRET;
  let db;

  const env = process.env.NODE_ENV || 'production';

  if (env === 'test') {
    const config = require('./config.json');
    var envConfig = config[env];
    process.env.JWT_SECRET = envConfig.JWT_SECRET;
    MONGOURI = envConfig.MONGOURI;
    db = 'Local';
  } else if (env === 'development') {
    const config = require('./config.json');
    var envConfig = config[env];
    process.env.JWT_SECRET = envConfig.JWT_SECRET;
    MONGOURI = envConfig.MONGOURI;
    db = 'Local';
  } else {
    JWT_SECRET = process.env.JWT_SECRET;
    MONGOURI = process.env.MONGOURI;
    db = 'Cloud';
  }

  return { MONGOURI, db };
};

module.exports = { configEnv };
