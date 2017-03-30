/**
 * Created by yneos on 2017/3/30.
 */
var Schema = require('mongoose').Schema;
var crypto = require('crypto');
var async = require('async');


var url = "mongodb://192.168.2.56/weixin";
var tableName = "wechat";
var db = require('./db')(url, tableName);


var schema = new Schema({
        title: {type: String, default: ''},//标题
        url: {type: String, default: ''},//永久连接地址
        contentHtml: {type: String, default: ''},//html内容
        contentText: {type: String, default: ''},//文本内容
        wechat_number: {type: String, default: ''},//公众号名称
        read_num: {type: Number, default: 0},//阅读数量
        like_num: {type: Number, default: 0},//赞数量
        release_time: {type: Date},//发布时间
        bizBase64: {type: String},//公众号ID的Base64编码
        biz: {type: String},//公众号ID
        mid: {type: String},//推送消息ID
        idx: {type: String},//推送消息中的位置
        key: {type: String, index: true},//md5(biz+mid+idx)

    }
    , {strict: true,safe:true});

var Model = db.model(tableName, schema);

function saveDatas(dataList) {
    var dataList = dataList || [];
    var task = [];
    dataList.forEach(function (data) {
        if (!data) return;
        task.push(function (callback) {
            data = _processData(data);
            Model
                .findOne({key: data.key})
                .then(function (doc) {
                    if (doc) {
                        console.log(new Date(), doc.key, 'already exists');
                        callback(null);
                    } else {
                        _saveData(data,callback);
                    }

                })
                .catch(function (e) {
                    console.error(new Date(), "error:", e);
                    callback(null);
                });
        });
    });
    async.waterfall(task, function (err, result) {
        //console.log('complete');
    });
}


function _saveData(data, callback) {
    var entity = new Model(data);
    entity.save()
        .then(function (doc) {
            console.log(new Date(), doc.key, 'saved');
            callback(null);
        })
        .catch(function (e) {
            console.error(new Date(), "error:", e);
            callback(null);
        });
}

function _processData(data) {
    data.mid = _getParamByUrl(data.url, "mid");
    data.idx = _getParamByUrl(data.url, "idx");
    data.bizBase64 = _getParamByUrl(data.url, "__biz");
    data.biz = _base64_decode(data.bizBase64);
    data.key = _md5_encode(data);
    return data;
}

function _base64_decode(base64str) {
    var str = new Buffer(base64str, 'base64').toString();
    return str;
}
function _md5_encode(data) {
    var keyString = "" + data.biz + data.mid + data.idx;
    var md5 = crypto.createHash('md5');
    md5.update(keyString);
    var key = md5.digest('hex').toString();//32 characters
    return key;
}

function _getParamByUrl(url, paramName) {
    var ret = "";
    try {
        ret = url.split(paramName + "=")[1];
        ret = ret.split("&")[0];
        ret = ret.split("#")[0];
    } catch (e) {
    }
    return ret;
}

module.exports = saveDatas