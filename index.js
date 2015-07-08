var async = require('async');
var request = require('request');
var fs = require('fs');
var stream = fs.createWriteStream("articles.txt");
var logger = require('log4js').getLogger('crawler:index.js')
var api = require('./api.js');



//最早要抓到第幾頁
var MIN_PAGE = 1;

logger.debug("抓取總頁數...");

api.getPageCount(function(err, result){
	if(err){
		logger.debug(err);
		return;
	}

	//成功抓取頁數
	logger.debug("總共 " + result + " 頁");

	//構造頁數陣列
	var pages = [];
	for(var i=result;i>=MIN_PAGE;i--){
		pages.push(i);
	}

	//一次抓太多會被檔
	var limit = 1;
	async.eachLimit(pages, limit, getArticleList, function(err, result){
		logger.debug("抓取完畢");
	});

	
});

function getArticleList(page, callback){

	api.getArticleList(page, function(err, result){
		if(err){
			logger.debug(err);
			return;
		}
		logger.debug(result);

		//寫入檔案
		result.forEach(function(item){
			stream.write(item.id + ",,," + item.title+"\n");
		});

		callback();
	});	
}
