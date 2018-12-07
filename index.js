var express = require('express');
var app = express();
var fs = require("fs");
//管理cookie信息
// body-parser - node.js 中间件，用于处理 JSON, Raw, Text 和 URL 编码的数据。

// cookie-parser - 这就是一个解析Cookie的工具。通过req.cookies可以取到传过来的cookie，并把它们转成对象。

// multer - node.js 中间件，用于处理 enctype="multipart/form-data"（设置表单的MIME编码）的表单数据。

var cookieParser = require('cookie-parser')
// 常用的工具
var util = require('util');

var bodyParser = require('body-parser');
var multer = require('multer');

var urlencodedParser = bodyParser.urlencoded({
    extended: false
})
// 注册允许访问静态资源
app.use(express.static('public'));
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser())


app.use(multer({
    dest: '/tmp/'
}).array('image'));

// 创建访问入口地址
app.get('/index.html', function (req, res) {
    // 请求接收到的cookie值
    console.log("Cookies: " + util.inspect(req.cookies));
    res.sendFile(__dirname + "/" + "index.html");

})


// get请求
app.get('/process_get', function (req, res) {
    console.log(req.query);
    // var response = {
    //     "first_name":req.query.fireName,
    //     "last_name":req.query.age
    // };

    res.end(JSON.stringify(req.query));
})

// post请求
app.post('/process_post', urlencodedParser, function (req, res) {
    // 输出 JSON 格式
    res.writeHead(200, {
        'Content-Type': 'text/html;charset=utf-8'
    }); //设置response编码为utf-8,避免中文乱码

    res.end(JSON.stringify(req.body));
})


// 上传的文件
app.post('/file_upload', function (req, res) {
    console.log(req.files[0]); // 上传的文件信息
    console.log(__dirname);
    var date = Date.parse(new Date());
    date = date + '.' + req.files[0].originalname.split('.')[1];
    var des_file = __dirname + "/public/images/" + date;

    fs.readFile(req.files[0].path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
            if (err) {
                console.log(err);
            } else {
                response = {
                    message: '文件上传成功',
                    filename: date,
                    filePath: "/images/" + date
                };
            }
            console.log(response);
            // 返回结果
            res.end(JSON.stringify(response));
        });
    });
})


var server = app.listen(8123, "127.0.0.1", function () {
    var host = server.address().address
    var port = server.address().port;
    // 在使用server.address()的时候,会出现::这个问题,是ipv6的原因,则在使用的过程中,加上ip地址或者localhost
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
})