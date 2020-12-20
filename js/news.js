$(document).ready( function() {

	var news_per_page = 5;
	var urls = window.location.href.split("/");
	var idx = urls[urls["length"]-1].replace('.html', '').replace('.htm', '').replace('news', '');
	if (idx == "")
		idx = 0;
	show_news = news_per_page * idx;

	$("#loader").hide();

	$.ajax("content/news/index.json")
		.then( function (nIndex) {
			var sorter_nIndex = nIndex.sort(function(a, b) { return b.date - a.date; } );
			if (sorter_nIndex.length < news_per_page;) {
				to_show = sorter_nIndex.length;
			}
			else {
				to_show = news_per_page;
			}
			for(i = 0; i < to_show; i++) {
				var new_item = sorter_nIndex[show_news + i];
				$.ajax(new_item.link)
					.then(function (new_content) {
						$("#newsplaceholder").append(marked(new_content) + "<br>");
					} )
			}
		} )
		.fail (function (rawdata) {
			$("#newsplaceholder").html("<p>Can't read any news");
		} )
} )

