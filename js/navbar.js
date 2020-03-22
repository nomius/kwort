$.get("navbar.html", function(data){
	$("#nav-placeholder").replaceWith(data);
	var link = document.URL.split("/").pop();
	links = document.getElementsByTagName("a");
	for (i = 0; i < links.lenght; i++) {
		if (links[i].pop() == link) {
			links[i].className = "nav-link active";
		}
	}
});
