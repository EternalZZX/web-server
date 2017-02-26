var express = require('express');
var router = express.Router();
var $dbio = require('../src/dbio');

router.get('/', function(req, res, next) {
    res.render('index', { title: '拾光镇-Memory Minecraft Server' });
});

router.get('/gallery', function(req, res, next) {
    $dbio.getGallery(req, res, next);
});

module.exports = router;
