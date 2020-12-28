$(document).ready(function() {

	function makeAjaxCall(url, parameters, methodType, callback){
		return $.ajax({
			url : url,
			cache: true,
			method : methodType,
			data : parameters,
		});
	}

	var news_per_page = 5;
	var urls = window.location.href.split("/");
	var idx = urls[urls["length"]-1].replace('.html', '').replace('.htm', '').replace('news', '');
	if (idx == "")
		idx = 0;
	show_news = news_per_page * idx;

	$("#loader").hide();

	makeAjaxCall("content/news/index.json", null, "GET").then(function(nIndex){
		if (nIndex.length < news_per_page) {
			to_show = nIndex.length;
		}
		else {
			to_show = news_per_page;
		}
		for (i = show_news; i < show_news + news_per_page; i++) {
			nIndex[i].date = -1;
		}

		nIndex.reduce((promise, item) => {
			return promise.then(() => {
				if (item.date == -1) {
					return makeAjaxCall(item.link, null, "GET");
				}
			}).then((content) => {
				$("#newsplaceholder").append(marked(content) + "<br>");
			});
		}, Promise.resolve());
	});
});
