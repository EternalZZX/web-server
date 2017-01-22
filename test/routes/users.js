var express = require('express');
var router = express.Router();
var $dbio = require('../src/dbio');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/addUser', function(req, res, next) {
	console.log('insert user');
	$dbio.addUser(req, res, next);
});

module.exports = router;
