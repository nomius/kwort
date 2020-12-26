$(document).ready(function() {

	function makeAjaxCall(url, parameters, methodType, callback){
		return $.ajax({
			url : url,
			cache: true,
			method : methodType,
			data : parameters,
			dataType : "json",
			contentType : 'application/json'
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
		for(i = 0; i < to_show; i++) {
			var new_item = sorter_nIndex[show_news + i];
			makeAjaxCall(new_item.link, null, "GET").then(function(content) {
				$("#newsplaceholder").append(marked(new_content) + "<br>");
			});
		}
	});
});
