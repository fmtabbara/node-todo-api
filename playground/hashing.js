const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
  id: 10
};

const token = jwt.sign(data, '123abc');

const decoded = jwt.verify(token, '123abc');

// const message = 'I am 11';
// const hash = SHA256(message).toString();

// const app = {
//   app: 'MyApp'
// };

// const data = {
//   id: 4
// };

// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data).toString())
// };

// console.log(data, JSON.stringify(data));
console.log(decoded);
