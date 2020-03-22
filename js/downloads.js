$(document).ready( function() {

	$("#loader").hide();
	$.ajax("content/downloads.md")
		.then( function (data) {
			data_section = document.getElementsByClassName("container")[0].innerHTML = marked(data);
		} )
		.fail( function (rawdata) {
			document.getElementsByClassName("container")[0].innerHTML = "<p>Download links not available";
		} )
} )

