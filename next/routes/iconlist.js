var express = require('express');
var router = express.Router();
var mongodb = require("mongodb-curd");
var basename = "lemon";
var collname = "iconlist";

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//查找所有icon图标
router.get("/icons/iconlist", function(req, res, next) {
    mongodb.find(basename, collname, {}, function(result) {
        if (result.length > 0) {
            res.send({
                code: 0,
                message: "查找成功",
                data: result
            })
        } else {
            res.send({
                code: 1,
                message: "查找失败"
            })
        }
    })
})


module.exports = router;