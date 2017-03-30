/**
 * Created by yneos on 2017/3/30.
 */
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

module.exports = function(url){
    var db =  mongoose.createConnection(url);
    db.on('error', function(e) {
        console.error(new Date(),"error:", e);
    })
    return db;
};