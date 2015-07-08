var async = require('async');
var request = require('request');
var fs = require('fs');

var logger = require('log4js').getLogger('crawler:getContent.js')
var api = require('./api.js');


logger.debug('抓取頁面內容...');

getContent('M.1436204828.A.C17');

function getContent(id, callback){
	api.getContent(id, function(err, result){

		var stream = fs.createWriteStream("./article/"+id+".txt");
		stream.write(JSON.stringify(result));
		stream.close();
		logger.debug(id + " 抓取完畢");

	});	
}
