
function str2date(sdate) {
	day = sdate.split(" ")[0].split("-")[0];
	smonth = sdate.split(" ")[0].split("-")[1];
	year = sdate.split(" ")[0].split("-")[2];
	hour = sdate.split(" ")[1].split(":")[0];
	minute = sdate.split(" ")[1].split(":")[1];
	all_months = { 'Jan' : 1, 'Feb' : 2, 'Mar' : 3, 'Apr' : 4, 'May' : 5, 'Jun' : 6, 'Jul' : 7, 'Aug': 8, 'Sep' : 9, 'Oct' : 10, 'Nov' : 11, 'Dec' : 12 }
	month = all_months[smonth];
	return new Date(year, month, day, hour, minute);
}

$(document).ready(function() {
	function create_array(rawdata) {
		var packages = [];
		splitted = rawdata.split("\n");
		items = splitted.filter(function f(item) { return (item.includes("<a href=") && !item.includes("../")); });

		for (i=0; i<items.length; i++) {
			pkg = items[i].split("\"")[1];
			name = pkg.split("%23")[0];
			version = pkg.split("%23")[1].replace("%2b", "+");
			build = pkg.split("%23")[3].replace(/.tar.*/, "");
			rdate_size = items[i].split("</a>")[1].trim();
			ssize = rdate_size.split(" ");
			nsize = Number(ssize[ssize.length-1]);
			sdate = rdate_size.split(" ")[0].trim() + " " + rdate_size.split(" ")[1].trim();
			odate = str2date(sdate);
			epoch = Number(odate);
			packages.push( { 'name': name, 'version' : version, 'build' : build, 'odate' : odate, 'epoch' : epoch, 'size' : nsize } );
		}
		return packages;
	}

	function create_table(packages) {
		packages.sort(function (a, b) {
			if (a['epoch'] < b['epoch']) {
				return 1;
			}
			else {
				return -1;
			}
		});

		head = "<table><tr><th>Name</th><th>Version</th><th>Build</th><th>Release date</th><th>Size</th></tr>";
		bottom = "</table><br>";
		out = head;
		for (i=0; i < (packages.length < 20 ? packages.length : 20); i++) {
			if (packages[i].size > 10485760) { // More than 10MB
				out_size = Math.ceil(packages[i].size / 1048576) + "mb";
			}
			else {
				out_size = Math.ceil(packages[i].size/1024) + "kb";
			}
			d = Date(packages[i].epoch).split(" ");
			out = out + "<tr><td>" + packages[i].name + "</td><td>" + packages[i].version + '</td"><td style="text-align: center;">' + packages[i].build + "</td><td>" + d[0] + " " + d[1] + " " + d[2] + " " + d[3] + "</td><td>" + out_size+ "</td></tr>";
		}
		out = out + bottom;
		$("#loader").hide();
		$("#pkgstable").html(out);
	}

	$.ajax("https://europa.fapyd.unr.edu.ar/pub/kwort/4.4/packages/")
		.then( function (rawdata) { // OK with primary mirror
			packages = create_array(rawdata);
			create_table(packages);
		})
		.fail( function(rawdata) {  // Primary mirror failed
			$.ajax("http://ctrl-c.club/~nomius/kwort/4.4/packages/")
				.then( function (rawdata2) { // Trying Secondary mirror now (hopefully ctrl-c implements https, otherwise this is useless).
					packages = create_array(rawdata2);
					create_table(packages);
				})
				.fail( function (rawdata2) { // Let's display an error message
					$("#loader").hide();
					$("#pkgstable").html("<p>All mirrors are down");
				})
		})
});
