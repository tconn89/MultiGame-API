factory = require('factory-girl').factory;
Account = require('../../models/account.js');

factory.define('account', Account, {
  username: 'Bob',
  password: 'pass'
});

factory.build('account').then(user => {
  console.log(user);
});
