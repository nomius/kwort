
function str2date(sdate) {
	day = sdate.split(" ")[0].split("-")[0];
	smonth = sdate.split(" ")[0].split("-")[1];
	year = sdate.split(" ")[0].split("-")[2];
	hour = sdate.split(" ")[1].split(":")[0];
	minute = sdate.split(" ")[1].split(":")[1];
	switch(smonth) {
		case 'Jan':
			month = 1;
			break;
		case 'Feb':
			month = 2;
			break;
		case 'Mar':
			month = 3;
			break;
		case 'Apr':
			month = 4;
			break;
		case 'May':
			month = 5;
			break;
		case 'Jun':
			month = 6;
			break;
		case 'Jul':
			month = 7;
			break;
		case 'Aug':
			month = 8;
			break;
		case 'Sep':
			month = 9;
			break;
		case 'Oct':
			month = 10;
			break;
		case 'Nov':
			month = 11;
			break;
		case 'Dec':
			month = 12;
			break;
		default:
			month = 0;
	}
	return new Date(year, month, day, hour, minute);
}

$(document).ready(function() {
	var packages = [];
	$.ajax("https://europa.fapyd.unr.edu.ar/pub/kwort/4.3.4/packages/").then(function (rawdata) {
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
		};
		packages.sort(function (a, b) {
			if (a['epoch'] < b['epoch']) {
				return 1
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
				out_size = Math.ceil(packages[i].size / 1048576) + "mb"
			}
			else {
				out_size = Math.ceil(packages[i].size/1024) + "kb"
			}
			out = out + "<tr><td>" + packages[i].name + "</td><td>" + packages[i].version + '</td"><td style="text-align: center;">' + packages[i].build + "</td><td>" + packages[i].odate.toDateString() + "</td><td>" + out_size+ "</td></tr>";
			//out = out + "<tr><td>" + packages[i].name + "</td><td>" + packages[i].version + '</td"><td style="text-align: center;">' + packages[i].build + "</td><td>" + packages[i].odate.toISOString().replace("T", " ").replace(/:00.000./, "") + "</td><td>" + out_size+ "</td></tr>";
		}
		out = out + bottom;
		$("#pkgstable").html(out);
	});
});
