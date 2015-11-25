function currentDate(){
	var d = new Date()
	var months = ["Jan.", "Feb.","March","April","May", "June", "July", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
	var days = ["Sunday","Monday", "Tuesday","Wednesday","Thursday","Friday", "Saturday"];

	return days[d.getDay()]+" "+months[d.getMonth()]+" "+d.getDate()+dateSuffix(d.getDate);

	function dateSuffix(d){
		switch (d % 10) {
			case 1:  return "st";
			case 2:  return "nd";
			case 3:  return "rd";
			default: return "th";
    	}
	}
}

module.exports.getDate = currentDate; 