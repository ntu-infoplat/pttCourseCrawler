var request = require('request');
var logger = require('log4js').getLogger('crawler:api.js')
var cheerio = require('cheerio');

var NTUcourseHost = "https://www.ptt.cc/bbs/NTUcourse/";

var API = {

	getPageCount: function(callback){
		request(NTUcourseHost + 'index.html', function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    
		    //抓取成功，解析body
		    var pattern = /bbs\/NTUcourse\/index(\d{2,}).html/; 
			var result = pattern.exec(body);

			//頁數加一才是正確的
			callback(null, parseInt(result[1],10)+1);

		  }else{
		  	callback(new Error('抓取頁數錯誤'), null);
		  }
		});
	},

	getArticleList: function(page, callback){
		var url = NTUcourseHost + "index" + page + ".html";
		logger.debug("正在抓取第 " + page + " 頁");
		request(url, function(error, response, body){
			if (!error && response.statusCode == 200) {
		    
			    //抓取成功，解析body
			    var pattern = /bbs\/NTUcourse\/(.{10,30})\.html">(\s*\[評價\].*)<\/a>/g; 
			    var list = [];

			    while(result = pattern.exec(body)){
			    	list.push({
			    		id: result[1],
			    		title: result[2]
			    	});
			    }
				callback(null, list);
		  }else{
		  	callback(new Error('抓取第'+page+'頁時錯誤'), null);
		  }
		});
	},

	getContent: function(id, callback){
		var url = NTUcourseHost + id + '.html';
		request(url, function(error, response, body){
			if (!error && response.statusCode == 200) {
		    
		    	var $ = cheerio.load(body);

		    	//作者 看板 標題 時間
		    	var metaTag = ['author', 'board', 'title', 'time'];
		    	var metaValue = $('#main-container').find('.article-meta-value');
		    	var metaData = {};
		    	for(var i=0;i<metaValue.length;i++){

		    		metaData[metaTag[i]] = $(metaValue[i]).text();
		    	}

			    var text = $('#main-content').text();
			    var ret = {
			    	metaData: metaData,
			    	content: text
			    }

				callback(null, ret);
		  }else{
		  	callback(new Error('抓取第'+page+'頁時錯誤'), null);
		  }
		});
	}
}

module.exports = API
