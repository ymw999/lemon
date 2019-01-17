var express = require('express');
var router = express.Router();
var billlist = require("./billAPI/index.js")

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//添加账单
router.post("/billlist/addbill", billlist.addbill);

//查找账单
router.get("/billlist/findbillonly", billlist.findbillonly);

//删除账单
router.get("/billlist/removebill", billlist.removebill);


module.exports = router;