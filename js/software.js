
function str2date(sdate) {
	day = sdate.split(" ")[0].split("-")[0];
	smonth = sdate.split(" ")[0].split("-")[1];
	year = sdate.split(" ")[0].split("-")[2];
	hour = sdate.split(" ")[1].split(":")[0];
	minute = sdate.split(" ")[1].split(":")[1];
	all_months = { 'Jan' : 0, 'Feb' : 1, 'Mar' : 2, 'Apr' : 3, 'May' : 4, 'Jun' : 5, 'Jul' : 6, 'Aug': 7, 'Sep' : 8, 'Oct' : 9, 'Nov' : 10, 'Dec' : 11 }
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
		var weekday = new Array(7);
		weekday[0]="Sun";
		weekday[1]="Mon";
		weekday[2]="Tue";
		weekday[3]="Wed";
		weekday[4]="Thu";
		weekday[5]="Fri";
		weekday[6]="Sat";

		var month = new Array(12);
		month[0] = 'Jan';
		month[1] = 'Feb';
		month[2] = 'Mar';
		month[3] = 'Apr';
		month[4] = 'May';
		month[5] = 'Jun';
		month[6] = 'Jul';
		month[7] = 'Aug';
		month[8] = 'Sep';
		month[9] = 'Oct';
		month[10] = 'Nov';
		month[11] = 'Dec';
		for (i=0; i < (packages.length < 20 ? packages.length : 20); i++) {
			if (packages[i].size > 10485760) { // More than 10MB
				out_size = Math.ceil(packages[i].size / 1048576) + "mb";
			}
			else {
				out_size = Math.ceil(packages[i].size/1024) + "kb";
			}
			d = new Date(packages[i].epoch)

			out = out + "<tr><td>" + packages[i].name + "</td><td>" + packages[i].version + '</td"><td style="text-align: center;">' + packages[i].build + "</td><td>" + weekday[d.getDay()] + " " + month[d.getMonth()] + " " + d.getDate() + " " + 1900 + d.getYear() + "</td><td>" + out_size+ "</td></tr>";
		}
		out = out + bottom;
		$("#loader").hide();
		$("#pkgstable").html(out);
	}

	const PRIMARY_API_URL = 'https://europa.fapyd.unr.edu.ar/pub/kwort/4.5/packages/';
	const FALLBACK_API_URL = 'https://ctrl-c.club/~nomius/kwort/4.5/packages/';

	async function callPrimaryApi() {
		try {
			const response = await fetch(PRIMARY_API_URL, { timeout: 5000 }); // Added a timeout for faster failure
			if (!response.ok) {
				throw new Error(`Primary API responded with status: ${response.status}`);
			}
			const data = await response.text();
			return create_array(data);
		} catch (error) {
			console.error('Primary API call failed:', error);
			throw new Error(`Primary API failed: ${error.message}. Trying fallback.`);
		}
	}

	async function callFallbackApi() {
		try {
			const response = await fetch(FALLBACK_API_URL);
			if (!response.ok) {
				throw new Error(`Fallback API responded with status: ${response.status}`);
			}
			const data = await response.text();
			return create_array(data);
		} catch (error) {
			console.error('Fallback API call failed:', error);
			throw new Error(`Fallback API also failed: ${error.message}. No data available.`);
		}
	}

	async function handleApiCall() {
		try {
			// Attempt primary mirror
			const packages1 = await callPrimaryApi();
			create_table(packages1);
		} catch (primaryError) {
			// If primary mirror fails, attempt fallback mirror
			try {
				const packages2 = await callFallbackApi();
				create_table(packages2);
			} catch (fallbackError) {
				// If both fail, show the final error
				$("#loader").hide();
				$("#pkgstable").html("<p>All mirrors are down");
				throw new Error(`Both servers are down`);
			}
		}
	}
	handleApiCall();
});
