var express = require('express');
var router = express.Router();
var classify = require("./classifyAPI/index.js")

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//查找个人icon图标
router.get("/classify/findlist", classify.findlist)

//插入icon图标
router.post("/classify/addlist", classify.addlist)

//查找单个图标_id
router.get("/classify/findonly", classify.findonly)

module.exports = router;