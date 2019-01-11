const config = require('./config.json');

const configEnv = () => {
  let MONGOURI;
  let db;
  const JWT_SECRET = "JWT_SECRET"
  const env = process.env.NODE_ENV || 'production';
  const envConfig = config[env];

  if (env === 'development') {
    process.env[JWT_SECRET] = envConfig[JWT_SECRET]
    MONGOURI = envConfig.MONGOURI;
    db = 'Local';
  } else {
    process.env[JWT_SECRET] = envConfig[JWT_SECRET]
    MONGOURI = envConfig.MONGOURI;
    db = 'Cloud';
  }

  return { MONGOURI, db };
};

module.exports = { configEnv };
