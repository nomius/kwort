$(document).ready( function() {

	var news_per_page = 5;
	var urls = window.location.href.split("/");
	var idx = urls[urls["length"]-1].replace('.html', '').replace('.htm', '').replace('news', '');
	if (idx == "")
		idx = 1;
	show_news = news_per_page * idx;
	const news = new Array();

	$("#loader").hide();

	$.ajax("content/news/index.json")
		.then( function (nIndex) {
			if (nIndex.length < news_per_page) {
				to_show = nIndex.length;
			}
			else {
				to_show = news_per_page;
			}
			for(i = 0; i < to_show; i++) {
				news.push({ 'index' : i, 'done' : false });
				$.ajax(nIndex[i].link)
					.then(function (content) {
						j = news.findIndex(x => x.index = i);
						news[j] = { 'post' : content, 'index' : j, 'done' : true}
					} )
			}
			function checkNews() {
				done = true
				for(i = 0; i < to_show; i++) {
					if (!news[i].done) {
						window.setTimeout(checkNews, 100);
						done = false
					}
				}
				if (done) {
					return true;
				}
				else {
					checkNews();
				}
			}
			checkNews();
			var sorted_news = news.sort(function(a, b) { return a.index - b.index; } );
			for(i = 0; i < sorted_news.length; i++) {
				$("#newsplaceholder").append(marked(sorted_news[i]) + "<br>");
			}
		} )
		.fail (function (rawdata) {
			$("#newsplaceholder").html("<p>Can't read any news");
		} )
} )

