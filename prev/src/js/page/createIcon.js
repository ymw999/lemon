var type = location.search.split("=")[1];

//请求iconlist渲染icon页面
mui.ajax('/icons/iconlist', {
    type: 'get', //HTTP请求类型
    success: function(data) {
        //服务器返回响应，根据响应结果，分析是否登录成功；
        if (data.code == 0) {
            renderIcon(data.data)
        }
    }
});

//渲染icon页面
var slidergroup = document.querySelector(".mui-slider-group"),
    iconspan = document.querySelector(".mui-icon span");

function renderIcon(data) {
    var page = Math.ceil(data.length / 15);
    var html = "";
    var arr = [];
    for (var i = 0; i < page; i++) {
        arr.push(data.splice(0, 15));
    }
    arr.map(function(v, i) {
        if (i == 0) {
            iconspan.className = v[0].icon
        }
        html += `<div class="mui-slider-item">
        <div>`
        v.map(function(item) {
            html += `<div class="iconlist">
                <span class="${item.icon}"></span>
            </div>`
        })
        html += ` </div>
        </div>`
    })
    slidergroup.innerHTML = html;
    //实例化轮播
    var gallery = mui('.mui-slider');
    gallery.slider({
        // interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
    });
}

//返回主页面
var pullleft = document.querySelector(".mui-pull-left");
pullleft.addEventListener("tap", function() {
    location.href = "createBill.html" + "?type=" + type;
})

//点击icon图标
mui(".mui-slider-group").on("tap", ".iconlist>span", function() {
    iconspan.className = this.className;
})

//点击保存
var save = document.querySelector("#save");
save.addEventListener("tap", function() {
    var iname = iconspan.className,
        cname = document.querySelector("#cname").value,
        uid = window.localStorage.getItem("uid") || "";
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
        mui.ajax('/classify/addlist', {
            type: 'post', //HTTP请求类型
            data: {
                type: type,
                uid: uid,
                iname: iname,
                cname: cname
            },
            success: function(data) {
                //服务器返回响应，根据响应结果，分析是否登录成功；
                if (data.code == 0) {
                    location.href = "./createBill.html" + "?type=" + type
                }
            }
        })
    }

})