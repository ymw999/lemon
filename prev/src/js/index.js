window.onload = function() {
    var picker, dtPicker;
    var nameArr = [];
    var year = new Date().getFullYear(),
        month = new Date().getMonth() + 1,
        month = month < 10 ? "0" + month : month,
        sel1 = document.querySelector(".header-center #sel1"),
        b1 = document.querySelector(".header-center #sel1>b"), //年月
        sel2 = document.querySelector(".header-center #sel2"),
        b2 = document.querySelector(".header-center #sel2>b"), //日期
        muiBillY = document.querySelector(".mui-bill-year"),
        muiBillM = document.querySelector(".mui-bill-month"),
        muiChart = document.querySelector(".mui-bill-chart");
    var val = b2.innerHTML;


    onload()

    function onload() {
        picker = new mui.PopPicker();
        dtPicker = new mui.DtPicker({ type: "month" });
        init()
    }

    function init() {
        var uid = window.localStorage.getItem("uid") || "";
        if (!uid) {
            mui.ajax('/users/adduser', {
                type: 'post', //HTTP请求类型
                data: {
                    name: "ymw"
                },
                success: function(data) {
                    //服务器返回响应，根据响应结果，分析是否登录成功；
                    if (data.code == 0) {
                        uid = data.data;
                        window.localStorage.setItem("uid", uid)
                    }
                }
            })
        } else {
            ajax();
        }

        //已登录请求渲染
        function ajax() {
            mui.ajax('/billlist/findbillonly', {
                type: 'get', //HTTP请求类型
                data: {
                    uid: uid,
                    time: b2.innerHTML,
                    name: nameArr
                },
                success: function(data) {
                    //服务器返回响应，根据响应结果，分析是否登录成功；
                    if (data.code == 0) {
                        val = b2.innerHTML;
                        if (nameArr.length == 0) {
                            renderNav(data.data)
                        }
                        renderBill(data.data)
                    } else {
                        b2.innerHTML = val;
                        alert(data.message)
                    }
                }
            });
        }

        //交换数据
        function change(obj1, obj2) {
            for (var k in obj2) {
                obj1[k] = obj2[k];
            }
        }


        //渲染账单页面
        function renderBill(data) {
            //排序
            for (var i = 0; i < data.length - 1; i++) {
                for (j = 0; j < data.length - 1 - i; j++) {
                    if (new Date(data[j].time) * 1 < new Date(data[j + 1].time) * 1) {
                        var newDatas = {}
                        change(newDatas, data[j])
                        change(data[j], data[j + 1])
                        change(data[j + 1], newDatas)
                    }
                }
            }
            var newData = fen(data, b1.innerHTML);
            if (b1.innerHTML == "年") {
                var html = "";
                for (var item in newData) {
                    var date = item + "月"
                    var newObj =
                        html += `<ul class="mui-table-view">
                                <li class="mui-table-view-cell mui-collapse">
                                    <a class="mui-navigate-right" href="#">
                                        <div class="mui-top">
                                            <p>
                                                <img src="./images/date_03.gif" alt="">
                                                <span>${ date}</span>
                                            </p>
                                            <div class="mui-top-content">
                                                <dl>
                                                    <dt>花费</dt>
                                                    <dd>${newData[item].totalpop}</dd>
                                                </dl>
                                                <dl>
                                                    <dt>收入</dt>
                                                    <dd>${newData[item].totalpush}</dd>
                                                </dl>
                                                <dl>
                                                    <dt>结余</dt>
                                                    <dd>${newData[item].totalpush-newData[item].totalpop}</dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </a>
                                    <div id="Billlist">
                        <ul id="OA_task_1" class="mui-table-view">`
                    newData[item].list.map(function(v, i) {
                        var time = new Date(v.time).getMonth() + 1 + "月" + new Date(v.time).getDate() + "日"
                        var className = v.type == "1" ? "expenditure" : "income"
                        html += `<li class="mui-table-view-cell">
                                        <div class="mui-slider-right mui-disabled" >
                                            <a class="mui-btn mui-btn-red" data-id="${v._id}">删除</a>
                                        </div>
                                        <div class="mui-slider-handle">
                                            <div class="mui-contents">
                                                <dl>
                                                    <dt>
                                                        <a><span class="${v.iname}"></span></a>
                                                    </dt>
                                                    <dd>
                                                        <div>
                                                            <p>${v.cname}</p>
                                                            <p>${time}</p>
                                                        </div>
                                                        <b class="${className}">${v.money}</b>
                                                    </dd>
                                                </dl>
                                            </div>
                                        </div>
                                    </li>`
                    })
                    html += `</ul></div></li></ul>`
                }
                document.querySelector("#mui-bill-year").innerHTML = html;
            } else {
                var html = ""
                for (var item in newData) {
                    var date = item.split("-")[0] + "月" + item.split("-")[1]
                    var total = getTotal(newData[item].list);
                    html += `<div class="date">
                                    <p>
                                        <img src="./images/date_03.gif" alt="">
                                        <span>${date}</span>
                                    </p>
                                    <p>
                                        <b>支出</b>
                                        <span>${total}</span>
                                    </p>
                                </div>
                                <ul id="OA_task_1" class="mui-table-view">`
                    newData[item].list.map(function(v) {
                        var className = v.type == "1" ? "expenditure" : "income"
                        html += ` <li class="mui-table-view-cell">
                                    <div class="mui-slider-right mui-disabled" >
                                        <a class="mui-btn mui-btn-red" data-id="${v._id}">删除</a>
                                    </div>
                                    <div class="mui-slider-handle">
                                        <div class="mui-contents">
                                            <dl>
                                                <dt>
                                                    <a><span class="${v.iname}"></span></a>
                                                </dt>
                                                <dd>
                                                    <p>${v.cname}</p>
                                                    <b class="${className}">${v.money}</b>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </li> `
                    })
                    html += `</ul>`
                }
                document.querySelector("#mui-bill-month").innerHTML = html;
            }
            Disabled()
        }
    }

    function getTotal(data) {
        var sum = 0;
        data.map(function(item) {
            sum += item.money * 1
        })
        return sum;
    }

    function fen(data, mask) {
        var obj = {}
        data.map(function(v, i) {
            if (mask == "年") {
                var time = moment(v.time).format("MM")
                if (!obj[time]) {
                    obj[time] = {
                        time: time,
                        totalpop: 0,
                        totalpush: 0,
                        list: []
                    }
                }
                obj[time].list.push(v);
                if (v.type == 1) {
                    obj[time].totalpop += v.money * 1
                } else {
                    obj[time].totalpush += v.money * 1
                }
            } else {
                var time = moment(v.time).format("MM-DD")
                if (!obj[time]) {
                    obj[time] = {
                        time: time,
                        totalmoney: 0,
                        list: []
                    }
                }
                obj[time].list.push(v);
            }

        })
        return obj;
    }

    //点击获取年月
    sel1.addEventListener("tap", function() {
        picker.setData([{ value: 'year', text: '年' }, { value: 'month', text: '月' }]);
        var titleY = document.querySelector(".mui-dtpicker-title [data-id=title-y]"),
            titleM = document.querySelector(".mui-dtpicker-title [data-id=title-m]"),
            pickerY = document.querySelector(".mui-dtpicker-body [data-id=picker-y]"),
            pickerM = document.querySelector(".mui-dtpicker-body [data-id=picker-m]");
        picker.show(function(selectItems) {
            b1.innerHTML = selectItems[0].text
            if (selectItems[0].text == "年") {
                b2.innerHTML = year;
                titleM.style.display = "none";
                pickerM.style.display = "none";
                titleY.style.width = "100%";
                pickerY.style.width = "100%";
                muiBillY.style.display = "block";
                muiBillM.style.display = "none";
            } else {
                b2.innerHTML = year + "-" + month
                titleM.style.display = "inline-block";
                pickerM.style.display = "inline-block";
                titleY.style.width = "50%";
                pickerY.style.width = "50%";
                muiBillY.style.display = "none";
                muiBillM.style.display = "block";
            }
            init()
                // console.log(selectItems[0].text); //智子
                // console.log(selectItems[0].value); //zz 
        })
    })

    //点击获取日期
    sel2.addEventListener("tap", function() {
        dtPicker.show(function(selectItems) {
            if (b1.innerHTML == "年") {
                b2.innerHTML = selectItems.y.text
            } else {
                b2.innerHTML = selectItems.y.text + "-" + selectItems.m.text
            }
            init()
                // console.log(selectItems.y); //{text: "2016",value: 2016} 
                // console.log(selectItems.m); //{text: "05",value: "05"} 
        })
    })



    var offCanvasInner = document.querySelector("#mui-off-canvas-wrap").querySelector('.mui-inner-wrap');
    offCanvasInner.addEventListener('drag', function(event) {
        event.stopPropagation();
    });

    //better-scroll
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });

    //点击 账单/图表
    mui("#bill_click").on("tap", "p", function() {
        var id = this.dataset.id;
        if (id == 0) {
            if (b1.innerHTML == "年") {
                muiBillY.style.display = "block";
                muiBillM.style.display = "none";
            } else {
                muiBillY.style.display = "none";
                muiBillM.style.display = "block";
            }
            muiChart.style.display = "none";
            this.classList.add("p-active");
            this.nextElementSibling.classList.remove("p-active")

        } else {
            muiBillY.style.display = "none";
            muiBillM.style.display = "none";
            muiChart.style.display = "block";
            this.classList.add("p-active");
            this.previousElementSibling.classList.remove("p-active")
        }
    })

    //点击删除
    function Disabled() {
        mui('.mui-disabled').on('tap', '.mui-btn', function(event) {
            var elem = this;
            var li = elem.parentNode.parentNode;
            var id = this.dataset.id;
            mui.confirm('确认删除该条记录？', '删除', btnArray, function(e) {
                if (e.index == 0) {
                    mui.ajax('/billlist/removebill', {
                        type: 'get', //HTTP请求类型
                        data: {
                            id: id
                        },
                        success: function(data) {
                            //服务器返回响应，根据响应结果，分析是否登录成功；
                            if (data.code == 0) {
                                init()
                            }
                        }
                    })
                    li.parentNode.removeChild(li);
                } else {
                    setTimeout(function() {
                        mui.swipeoutClose(li);
                    }, 0);
                }
            });
        });
        var btnArray = ['确认', '取消'];
    }


    //侧边栏
    document.querySelector("#but").addEventListener("tap", function() {
        mui('.mui-off-canvas-wrap').offCanvas('show');
    })

    //渲染侧边栏收支分类
    function renderNav(data) {
        var incomeArr = [],
            popArr = [];
        data.map(function(item) {
            if (item.type == "1" && popArr.indexOf(item.cname) == -1) {
                popArr.push(item.cname);
            } else if (item.type == "2" && incomeArr.indexOf(item.cname) == -1) {
                incomeArr.push(item.cname);
            }
        })

        incomeArr.map(function(item) {
            document.querySelector("#mui-income").innerHTML += `<li>${item}</li>`
        })
        popArr.map(function(item) {
            document.querySelector("#mui-expenditure").innerHTML += `<li>${item}</li>`
        })
        navClick()
    }

    function navClick() {
        var paylist = Array.from(document.querySelectorAll("#mui-income li"));
        var getlist = Array.from(document.querySelectorAll("#mui-expenditure li"));

        //侧边栏点击全部 收入/支出
        mui("#mui-list").on("tap", "li", function() {
            var type = this.dataset.type;
            this.classList.toggle("mui-active")
            if (this.classList.contains("mui-active")) {
                if (type == "income") {
                    paylist.map(function(v) {
                        v.classList.add("mui-active")
                    })
                } else if (type == "expenditure") {
                    getlist.map(function(v) {
                        v.classList.add("mui-active")
                    })
                }
            } else {
                if (type == "income") {
                    paylist.map(function(v) {
                        v.classList.remove("mui-active")
                    })
                } else if (type == "expenditure") {
                    getlist.map(function(v) {
                        v.classList.remove("mui-active")
                    })
                }
            }
        })

        //侧边栏点击收支分类中   支出
        mui("#mui-income").on("tap", "li", function() {
            this.classList.toggle("mui-active");
            var len = paylist.length;
            var reallen = Array.from(document.querySelectorAll("#mui-income .mui-active")).length;
            if (len == reallen) {
                document.querySelector('[data-type="income"]').classList.add("mui-active");
            } else {
                document.querySelector('[data-type="income"]').classList.remove("mui-active");
            }
        })

        //侧边栏点击收支分类中   收入
        mui("#mui-expenditure").on("tap", "li", function() {
            this.classList.toggle("mui-active");
            var len = getlist.length;
            var reallen = Array.from(document.querySelectorAll("#mui-expenditure .mui-active")).length;
            if (len == reallen) {
                document.querySelector('[data-type="expenditure"]').classList.add("mui-active");
            } else {
                document.querySelector('[data-type="expenditure"]').classList.remove("mui-active");
            }
        })

        //侧边栏点击重置
        var alllist = Array.from(document.querySelectorAll(".mui-list li"));
        document.querySelector("#reset").addEventListener("tap", function() {
            alllist.map(function(item) {
                item.classList.remove("mui-active");
            })
        })

        //侧边栏点击确定
        document.querySelector("#sure").addEventListener("tap", function() {
            var lis = Array.from(document.querySelectorAll("#mui-type .mui-active"));
            nameArr = [];
            lis.map(function(item) {
                nameArr.push(item.innerHTML)
            })
            mui('.mui-off-canvas-wrap').offCanvas().close();
            init()
        })
    }


    //点击+
    var bottom = document.querySelector("#bottom");
    bottom.addEventListener("tap", function() {
        location.href = "createBill.html";
    })
}