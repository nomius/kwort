
$(document).ready( function() {

	function get_new_content(link) {
		$.ajax(link)
			.then( function (new_rawdata) {
				return new_rawdata;
			} )
			.fail( function (new_err) {
				return "";
			} )
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
			for(i = 0; i < news_per_page; i++) {
				var new_data = sorter_nIndex[show_news + i];
				if (new_data == undefined) {
					break;
				news_content += "<br>" + get_new_content(new_data.link);
			}
			$("#newsplaceholder").html(news_content);
		} )
		.fail (function (rawdata) {
			$("#newsplaceholder").html("<p>Can't read any news");
		} )
} )

