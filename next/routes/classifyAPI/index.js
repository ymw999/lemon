var mongodb = require("mongodb-curd");
var basename = "lemon";
var collname = "classify";

//查找所有icon图标
var findlist = function(req, res, next) {
    var uid = req.query.uid,
        type = req.query.type;
    mongodb.find(basename, collname, { type: type, uid: { $in: ["*", uid] } }, function(result) {
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
}

//添加个人分类
var addlist = function(req, res, next) {
    var obj = req.body,
        type = obj.type,
        uid = obj.uid,
        iname = obj.iname,
        cname = obj.cname;
    if (!type || !uid || !iname || !cname) {
        res.send({ code: 2, message: "缺少参数" })
    } else {
        getClassify()
    }

    //判断当前分类是否存在
    function getClassify() {
        mongodb.find(basename, collname, { type: type, iname: iname, cname, cname, uid: { $in: ["*", uid] } }, function(result) {
            if (result.length > 0) {
                res.send({ code: 3, message: "该分类已经存在" })
            } else {
                add()
            }
        })
    }

    //添加分类
    function add() {
        mongodb.insert(basename, collname, obj, function(result) {
            if (result) {
                res.send({
                    code: 0,
                    message: "插入成功"
                })
            } else {
                res.send({
                    code: 1,
                    message: "插入失败"
                })
            }
        })
    }
}


var findonly = function(req, res, next) {
    var iname = req.query.iname,
        cname = req.query.cname;
    if (!iname || !cname) {
        res.send({ code: 2, message: "参数为空" })
    } else {
        find()
    }

    function find() {
        mongodb.find(basename, collname, { iname: iname, cname: cname }, function(result) {
            if (result.length > 0) {
                res.send({ code: 0, message: "查找成功", data: result[0]._id })
            } else {
                res.send({ code: 1, message: "分类不存在" })
            }
        })
    }

}

module.exports = {
    findlist: findlist,
    addlist: addlist,
    findonly: findonly
}