window.onload = function() {
    var dtPicker = new mui.DtPicker({ type: "date" }),
        nowY = new Date().getFullYear(),
        nowM = new Date().getMonth() + 1,
        nowD = new Date().getDate(),
        getNewDate = document.querySelector("#getdate span"),
        slidergroup = document.querySelector(".mui-slider-group"),
        type = location.search.split("=")[1] || "1",
        custom = null,
        iname = "",
        cname = "",
        money = "0.00",
        cid = "",
        selectItem = {
            y: nowY,
            m: nowM,
            d: nowD
        };
    getNewDate.innerHTML = nowM + "月" + nowD + "日"; //日期替换
    if (type == "1") {
        document.querySelector("[data-type='expenditure']").classList.add("span_active")
        document.querySelector("[data-type='income']").classList.remove("span_active")
    } else {
        document.querySelector("[data-type='expenditure']").classList.remove("span_active")
        document.querySelector("[data-type='income']").classList.add("span_active")
    }
    init()
        //请求classify渲染icon页面
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
            mui.ajax('/classify/findlist', {
                type: 'get', //HTTP请求类型
                data: {
                    uid: uid,
                    type: type
                },
                success: function(data) {
                    //服务器返回响应，根据响应结果，分析是否登录成功；
                    if (data.code == 0) {
                        renderIcon(data.data)
                    }
                }
            });
        }

        //渲染icon页面
        function renderIcon(data) {
            data.push({
                iname: "mui-icon mui-icon-plusempty",
                cname: "自定义"
            })
            var page = Math.ceil(data.length / 8);
            var html = "";
            var lasthtml = "";
            var arr = [];
            for (var i = 0; i < page; i++) {
                arr.push(data.splice(0, 8));
            }
            arr.map(function(v, i) {
                html += `<div class="mui-slider-item"><div>`
                v.map(function(item) {
                    if (item.cname !== "自定义") {
                        html += `<dl>
                            <dt>
                                <span class="${item.iname}"></span>
                            </dt>
                            <dd>${item.cname}</dd>
                        </dl>`
                    } else {
                        html += `<dl id="custom">
                            <dt>
                                <span class="${item.iname}"></span>
                            </dt>
                            <dd>${item.cname}</dd>
                        </dl>`
                    }
                })
                html += ` </div></div>`
            })
            slidergroup.innerHTML = html;
            //点击自定义跳转
            custom = document.querySelector("#custom");
            custom.addEventListener("tap", function() {
                    location.href = "./createIcon.html" + "?type=" + type;
                })
                //实例化轮播
            var gallery = mui('.mui-slider');
            gallery.slider({
                // interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
            });
        }
    }

    //点击切换  支出/收入
    mui(".mui-nav-top").on("tap", "span", function() {
        var types = this.dataset.type;
        this.classList.add("span_active");
        if (types == "expenditure") {
            this.nextElementSibling.classList.remove("span_active");
            this.nextElementSibling.nextElementSibling.classList.remove("span_active");
            type = 1;
            init()
        } else if (types == "income") {
            this.nextElementSibling.classList.remove("span_active");
            this.previousElementSibling.classList.remove("span_active");
            type = 2;
            init()
        } else {
            this.previousElementSibling.classList.remove("span_active");
            this.previousElementSibling.previousElementSibling.classList.remove("span_active");
        }
    })


    // 获得slider插件对象
    var gallery = mui('.mui-slider');
    gallery.slider({
        // interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
    });

    //获取日期
    getdate.addEventListener("tap", function() {
        dtPicker.show(function(selectItems) {
            selectItem = {
                y: selectItems.y.text,
                m: selectItems.m.text,
                d: selectItems.d.text
            }
            getNewDate.innerHTML = selectItems.m.text + "月" + selectItems.d.text + "日";
            // console.log(selectItems.y); //{text: "2016",value: 2016} 
            // console.log(selectItems.m); //{text: "05",value: "05"} 
        })
    })

    //点击键盘
    mui(".mui-count-left").on("tap", "li", function() {
        var txt = this.innerHTML;
        if (txt == "." || txt == "0") {
            if (moneys.value == "") {
                moneys.value = "0."
            } else {
                moneys.value += txt;
            }
        } else if (txt == "X") {
            moneys.value = moneys.value.substring(0, moneys.value.length - 1);
        } else {
            if (moneys.value == "0") {
                moneys.value = ""
            }
            moneys.value += txt;
        }
        money = moneys.value;
    })

    //点击完成
    save.addEventListener("tap", function() {
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
            getCid()
        }

        //请求cid
        function getCid() {
            mui.ajax('/classify/findonly', {
                type: 'get', //HTTP请求类型
                data: {
                    iname: iname,
                    cname: cname
                },
                success: function(data) {
                    //服务器返回响应，根据响应结果，分析是否登录成功；
                    if (data.code == 0) {
                        cid = data.data
                        ajaxAdd();
                    }
                }
            });
        }

        function ajaxAdd() {
            money = moneys.value
            mui.ajax('/billlist/addbill', {
                type: 'post', //HTTP请求类型
                data: {
                    uid: uid,
                    type: type,
                    iname: iname,
                    cname: cname,
                    time: selectItem.y + "-" + selectItem.m + "-" + selectItem.d,
                    money: money,
                    cid: cid
                },
                success: function(data) {
                    //服务器返回响应，根据响应结果，分析是否登录成功；
                    if (data.code == 0) {
                        location.href = "/"
                    }
                }
            });
        }
    })

    //返回主页面
    var pullleft = document.querySelector(".mui-pull-left");
    pullleft.addEventListener("tap", function() {
        location.href = "/"
    })

    //点击icon图标选择分类
    mui(".mui-slider-group").on("tap", "dl", function() {
        var allDl = Array.from(slidergroup.querySelectorAll("dl"));
        allDl.map(function(item) {
            item.classList.remove("dl_active");
        })
        this.classList.add("dl_active")
        var spans = this.querySelector("span");
        iname = spans.className;
        cname = this.querySelector("dd").innerHTML;
    })
}