var mongodb = require("mongodb-curd");
var dbbasename = "lemon";
var dbusername = "username";
var dbclassifyname = "classify";
var dbbillname = "billlist";

var addbill = function(req, res, next) {
    var parmas = req.body,
        type = parmas.type,
        iname = parmas.iname,
        cname = parmas.cname,
        money = parmas.money,
        time = parmas.time,
        uid = parmas.uid,
        cid = parmas.cid;
    if (!type || !iname || !cname || !money || !time || !uid || !cid) {
        res.send({ code: "2", message: "参数为空" })
    } else {
        findiconname()
    }

    function findiconname() { //查找用户
        mongodb.find(dbbasename, dbusername, { _id: uid }, function(result) {
            if (result.length > 0) {
                findclassifyname()
            } else {
                res.send({ code: 2, message: "用户不存在" })
            }
        })
    }

    function findclassifyname() { //查找分类
        mongodb.find(dbbasename, dbclassifyname, { _id: cid }, function(result) {
            if (result.length > 0) {
                add()
            } else {
                res.send({ code: 2, message: "分类不存在" })
            }
        })
    }

    function add() { //添加账单
        parmas.time = new Date(parmas.time)
        mongodb.insert(dbbasename, dbbillname, parmas, function(result) {
            if (result) {
                res.send({ code: 0, message: "添加账单成功" })
            } else {
                res.send({ code: 1, message: "添加账单失败" })
            }
        })
    }
}

var findbillonly = function(req, res, next) { //查找账单
    var parmas = req.query,
        name = parmas.name,
        uid = parmas.uid,
        time = parmas.time;
    if (!uid || !time) {
        res.send({ code: 2, message: "参数为空" })
    } else {
        if (time.indexOf("-") != -1) { //判断   年(2018)  月(2018-01)
            var timeArr = time.split("-");
            if (timeArr[1] * 1 == 12) { //判断是否是12月
                var timeEnd = (timeArr[0] * 1 + 1) + "-01"
            } else {
                var month = timeArr[1] * 1 + 1;
                month = month < 10 ? "0" + month : month;
                var timeEnd = timeArr[0] * 1 + "-" + month
            }
        } else {
            var timeEnd = time * 1 + 1 + ""
        }
        if (name) {
            console.log(name)
            findbill() //查找账单
        } else {
            findbilllist(timeEnd)
        }

    }

    function findbill() {
        time = new Date(time);
        timeEnd = new Date(timeEnd);
        mongodb.find(dbbasename, dbbillname, { uid: uid, time: { $lt: timeEnd, $gte: time }, cname: { $in: name } }, function(result) {
            if (result.length > 0) {
                res.send({ code: 0, message: "查找成功", data: result })
            } else {
                res.send({ code: 1, message: "查找失败" })
            }
        }, {
            sort: { time: 1 }
        })
    }

    function findbilllist(timeEnd) {
        time = new Date(time);
        timeEnd = new Date(timeEnd);
        mongodb.find(dbbasename, dbbillname, { uid: uid, time: { $lt: timeEnd, $gte: time } }, function(result) {
            if (result.length > 0) {
                res.send({ code: 0, message: "查找成功", data: result })
            } else {
                res.send({ code: 1, message: "查找失败" })
            }
        })
    }
}


//删除账单
var removebill = function(req, res, next) {
    var id = req.query.id;
    if (!id) {
        res.send({ code: 2, message: "参数为空" })
    } else {
        mongodb.remove(dbbasename, dbbillname, { _id: id }, function(result) {
            if (result) {
                res.send({ code: 0, message: "删除成功" })
            } else {
                res.send({ code: 1, message: "删除失败" })
            }
        })
    }
}
module.exports = {
    addbill: addbill,
    findbillonly: findbillonly,
    removebill: removebill
}