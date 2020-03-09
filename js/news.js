$(document).ready( function() {

	function waiter(complete, news_content) {
		if (!complete) {
			return false;
		}
		$("#newsplaceholder").html(news_content);
	}

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
			var news_content = "";
			var complete = false;
			for(i = 0; i < news_per_page; i++) {
				var new_item = sorter_nIndex[show_news + i];
				if (new_item == undefined) {
					complete = true;
					break;
				}
				$.ajax(new_item.link)
					.then( function (new_item_data) {
						news_content += "<br>" + new_item_data;
					} )
			}
			if (!setTimeout(waiter, 2000, complete, news_content)) {
				$("#newsplaceholder").html("<p>Can't read any news");
			}
		} )
		.fail (function (rawdata) {
			$("#newsplaceholder").html("<p>Can't read any news");
		} )
} )

