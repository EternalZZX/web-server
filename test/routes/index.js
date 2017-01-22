var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: '拾光镇-Memory Minecraft Server' });
});

router.get('/gallery', function(req, res, next) {
    res.render('gallery', { title: '拾光镇画廊-Memory Minecraft Server' });	
});

module.exports = router;
