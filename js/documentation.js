$(document).ready( function() {
	var section = document.URL.split("?")[1];
	if (section != null) {
		var active_item = document.getElementById(section);
		active_item.className = active_item.className + " active";
	}
	else {
		section = "documentation";
	}

	$("#loader").hide();
	$.ajax("content/documentation/" + section + ".md")
		.then( function (data) {
			data_section = document.getElementsByClassName("col-lg-8")[0].innerHTML = marked(data);
		} )
		.fail( function (rawdata) {
			document.getElementsByClassName("col-lg-8")[0].innerHTML = "<p>Documentation not accessible";
		} )
} )

