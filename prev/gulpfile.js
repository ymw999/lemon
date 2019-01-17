var gulp = require("gulp");
var webserver = require("gulp-webserver");
var sass = require("gulp-sass");

gulp.task("sass", function() {
    return gulp.src("./src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./src/css/"))
})

gulp.task("watch", function() {
    return gulp.watch("./src/scss/*.scss", gulp.series("sass"))
})

gulp.task("webserver", function() {
    return gulp.src("./src")
        .pipe(webserver({
            port: 9999,
            livereload: true,
            proxies: [{
                    source: "/users/adduser",
                    target: "http://192.168.0.224:3000/users/users/adduser"
                },
                {
                    source: "/icons/iconlist",
                    target: "http://192.168.0.224:3000/iconlist/icons/iconlist"
                },
                {
                    source: "/classify/findlist",
                    target: "http://192.168.0.224:3000/classify/classify/findlist"
                },
                {
                    source: "/classify/addlist",
                    target: "http://192.168.0.224:3000/classify/classify/addlist"
                }, {
                    source: "/billlist/findbill",
                    target: "http://192.168.0.224:3000/billlist/billlist/findbill"
                }, {
                    source: "/billlist/addbill",
                    target: "http://192.168.0.224:3000/billlist/billlist/addbill"
                }, {
                    source: "/classify/findonly",
                    target: "http://192.168.0.224:3000/classify/classify/findonly"
                },
                {
                    source: "/billlist/findbill",
                    target: "http://192.168.0.224:3000/billlist/billlist/findbill"
                },
                {
                    source: "/billlist/findbillonly",
                    target: "http://192.168.0.224:3000/billlist/billlist/findbillonly"
                },
                {
                    source: "/billlist/removebill",
                    target: "http://192.168.0.224:3000/billlist/billlist/removebill"
                }
            ]
        }))
})

gulp.task("dev", gulp.series("sass", "webserver", "watch"));