
express = require('express');
router = express.Router();

Account = require('../models/account');

router.get('/users', function(req, res){
    console.log(Object.keys(Account.schema.paths));
    Account.find({}, function(err, users){
        result = Object.keys(users).reduce(function (previous, key) {
            return previous + '\n' + users[key];
        }, 0);
        m_keys = Object.keys(Account.schema.paths).filter(function(elem){
            return elem != 'emailToken' && elem != '_id'
        })
        res.render('dbTable', { myUsers: users, keys: m_keys } );
    })
});

module.exports = router;