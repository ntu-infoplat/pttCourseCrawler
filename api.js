var request = require('request');
var logger = require('log4js').getLogger('crawler:api.js')

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
	}



}

module.exports = API
