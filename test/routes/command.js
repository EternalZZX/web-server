var express = require('express');
var router = express.Router();
var $dbio = require('../src/dbio');
var $cmd = require('../src/cmd');

router.post('/addwhitelist', function(req, res, next) {
	$dbio.regist(req, res, next);
});

router.get('/getcode', function(req, res, next) {
	$dbio.getInvitecode(req, res, next);
});

router.get('/addinvitecode', function(req, res, next) {
	$dbio.addInvitecode(req, res, next);
	res.send('add invite code');
});

router.get('/addmoney', function(req, res, next) {
	$cmd.addMoney(req, res, next);
});

router.post('/suggestion', function(req, res, next) {
	$dbio.suggest(req, res, next);
});

router.get('/gallerypic', function(req, res, next) {
    $dbio.getGalleryPic(req, res, next);
});

router.get('*', function(req, res, next) {
	res.send('404');
});
 
module.exports = router;

