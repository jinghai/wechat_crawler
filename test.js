var ut = require('./common.js');
var async = require('async');
//var saveDatas = require('./model');
console.log('开始!!!');
//要确保按关键字关键字搜素出的结果排在第一位
//搜素地址:http://weixin.sogou.com/weixin 输入关键字，然后点“搜素众号”。。。
var keyworld = '青海政务';//[上海发布、三亚政务、青海政务]
//任务数组
var task = [];
//根据public_num搜索公众号,最好是微信号或者微信全名.
task.push(function (callback) {
    ut.search_wechat(keyworld, callback)
});
//根据url获取公众号获取最后10条图文列表
task.push(function (url, callback) {
    ut.look_wechat_by_url(url, callback)
});

var i = 0;

async.whilst(
    function() {
        i++;
        console.log(new Date(),'循环次数',i);
        return true
    },
    function(cb) {
        //执行任务
        async.waterfall(task, function (err, result) {
            if (err) {
                console.error(err);
                //process.exit(0);
            }
            setTimeout(function(){
                cb();
            },2*60*60*1000 /*30*1000*/);

        })
    }
);

