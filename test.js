/**
 * Created by Administrator on 2017/3/27.
 */
var request = require('request');
var cheerio = require('cheerio');

//request.debug = true;

var encode_public_num = encodeURIComponent("上海发布");
var u = `http://weixin.sogou.com/weixin?type=1&query=${encode_public_num}&ie=utf8&_sug_=y&_sug_type_=1`;


var FileCookieStore = require("tough-cookie-filestore");
var jar = request.jar(new FileCookieStore("./cookie.json"));
var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; rv:50.0) Gecko/20100101 Firefox/50.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3',
    //'Accept-Encoding': 'gzip, deflate',
    'Accept-Encoding': 'gzip',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
}
var request = request.defaults({
    headers:headers,
    jar: jar,
    gzip:true,
    /*proxy:'http://proxy.dc.lan:1234',*/
    /*encoding : null,*/
});

var url = "http://mp.weixin.qq.com/profile?src=3&timestamp=1490603427&ver=1&signature=WJrm-DvNBw04WoeJpGkrCYFTZxkAAdYDsuTf7tP2g6tW6pvK6uMFzn8XOK*wXftc0*WLSaRlHV2EEMWycpAf8A==";
url = 'http://mp.weixin.qq.com/s?__biz=MjM5NTA5NzYyMA==&mid=2654009223&idx=3&sn=84979e97bdd09f4779d3d308608e896d&scene=0#wechat_redirect';
request(url, function (err, response, html) {
    if (err) {
        console.log("err:",err);
        return;
    }
    var $ = cheerio.load(html);
    var text = $('#page-content').text();

    console.log(text);
    //var t = iconv.decode(html, "utf8");
    //console.log(t);

})