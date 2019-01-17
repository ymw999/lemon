var express = require('express');
var router = express.Router();
var mongodb = require("mongodb-curd");
var basename = "lemon";
var collname = "username";

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//添加用户
router.post("/users/adduser", function(req, res, next) {
    var name = req.body.name;
    mongodb.insert(basename, collname, { name: name }, function(result) {
        if (result) {
            res.send({
                code: 0,
                message: "添加成功",
                data: result.ops[0]._id
            })
        } else {
            res.send({
                code: 1,
                message: "添加失败"
            })
        }
    })
})

module.exports = router;