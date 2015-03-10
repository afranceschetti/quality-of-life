
var HOME_URL = "https://afranceschetti.github.com/quality-of-life/";
var LOGO_URL = HOME_URL + "img/logo/logo128.png";
var SHARE_PICTURE = HOME_URL + "img/share/share-";
var SHARE_HASHTAG = "qualityoflife";
var SHARE_TEXT = "My happiness level is  ";

var canvasMap = {};

var random_1 = {};
var random_2 = {};
var random_3 = {};
var random_4 = {};

var question_types = new Array(
	"wish", "satisfied"
);

var question_types_icons = {
	    "wish": "\uF12A",
    	"satisfied": "\uF11E"
};

var types =new Array(
		"love",
    	"sons",
	    "family",
	    "friends",
	    "fun",
	    "myself",
	    "work",
		"passion"
);

var fill_color = {
	    "love": "#F984EF",
    	"sons": "#8ae234",
	    "family": "#8f00ff",
	    "friends": "#ff9900",
	    "fun": "#fce94f",
	    "myself": "#19aeff",
	    "work": "#c17d11",
		"passion": "#ef2929",
		"sleep": "#eeeeec",
		"eat": "#babdb6",
		"minwork": "#888A85",
		"move": "#555753"
		
};

var stroke_color = {
	    "love": "#F400A1",
		"sons": "#73d216",
	    "family": "#5E00A6",
	    "friends": "#ff6600",
	    "fun": "#edd400",
	    "myself": "#008ac8",
	    "work": "#7d4f06",
		"passion": "#cc0000",
		"sleep": "#b3b3b1",
		"eat": "#8c8e8a",
		"minwork": "#666865",
		"move": "#40413F"
};

var types_icons = {
	    "love": "icon-heart",
    	"sons": "icon-puzzle-piece",
	    "family": "icon-home",
	    "friends": "icon-group",
	    "fun": "icon-smile",
	    "myself": "icon-eye-open",
	    "work": "icon-briefcase",
		"passion": "icon-rocket"
};

var types_labels = {
	    "love": "Amore",
    	"sons": "Figli",
	    "family": "Parenti",
	    "friends": "Amici",
	    "fun": "Divertimento",
	    "myself": "Me stesso",
	    "work": "Lavoro",
		"passion": "Passioni"
};

var type_offset_x = {
	    "love": 1,
		"sons": 2,
	    "family": 0,
	    "friends": 3,
	    "fun": 0,
	    "myself": 3,
	    "work": 1,
		"passion": 2
};

var type_offset_y = {
	    "love": 0,
		"sons": 0,
	    "family": 1,
	    "friends": 1,
	    "fun": 2,
	    "myself": 2,
	    "work": 3,
		"passion": 3
};

var day_types =new Array(
		"workday",
		"holiday"
);

var day_types_icons = {
	    "workday": "\uF0B1",
    	"holiday": "\uF185"
};

	
var necessary_activity_types =new Array(
		"sleep",
		"eat",
		"minwork",
		"move"
);

var wish_values = {};



function init(){


	$("#brand").click(function() {scroolTo("page-step-0"); });
	$("#restart").click(function() {scroolTo("page-step-0"); });
	$("#step-button-1").click(function() {scroolTo("page-step-1"); });
	$("#step-button-2").click(function() {scroolTo("page-step-2"); });
	$("#step-button-3").click(function() {scroolTo("page-step-3"); });
	$("#step-button-4").click(function() {scroolTo("page-step-4"); });
	
	$("#step-menu-1").click(function() {scroolTo("page-step-1"); });
	$("#step-menu-2").click(function() {scroolTo("page-step-2"); });
	$("#step-menu-3").click(function() {scroolTo("page-step-3"); });
	$("#step-menu-4").click(function() {scroolTo("page-step-4"); });
	
	$("#share-facebook-button").click(function(e) {e.preventDefault();postOnFacebook(); });
	$("#share-twitter-button").click(function(e) {e.preventDefault();postOnTwitter(); });
	$("#share-google-plus-button").click(function(e) {e.preventDefault();postOnGooglePlus(); });
	$("#share-tumblr-button").click(function(e) {e.preventDefault();postOnTumblr(); });

	
	//$('#page-intro').css("min-height", $(window).height());
	$('#page-intro').css("padding-top", $(window).height()-$("#page-intro-content").height()*1.2);
	$('.page').css("padding-top", $("#top-bar-container").height()/2);
	$('.page').css("min-height", $(window).height());
	
	for ( var i = 0; i < question_types.length; i++) {
		canvasMap[question_types[i]] = document.getElementById('canvas_'+question_types[i]);
		for (var j=0; j<types.length; j++) {
			random_1[types[j]] = Math.random();
			random_2[types[j]] = Math.random();
			random_3[types[j]] = Math.random();
			random_4[types[j]] = Math.random();
			
			initSlider(types[j],question_types[i]);
		}

		refreshCanvas(question_types[i]);
	}
	for(var i=0; i<day_types.length; i++) {
		canvasMap[day_types[i]] = document.getElementById('canvas_'+day_types[i]);
		var day_type=day_types[i];
		for (var j=0; j<necessary_activity_types.length; j++) {
			initHourTextField(necessary_activity_types[j], day_type);
		}
		for (var j=0; j<types.length; j++) {
			initHourTextField(types[j], day_type);
		}
		
		refreshHour(day_types[i]);
	}
		
	refreshTestResult();
}

function scroolTo( panelId){
	var top= $('#'+panelId).offset().top;
	$('html,body').animate({scrollTop:top}, 500);
}

function initHourTextField(type, day_type){
	$("#hour-"+day_type+"-"+type).change(function() { refreshHour(day_type); });
}

function initSlider(type, question_type){
	$("#checkbox-ignore-" +type+"-"+question_type).on('change', function(e) {
		enableType(type, question_type, !this.checked);
	});
	$("#"+type+"-slider-"+question_type).slider({
		range: "min",
		min: 0,
		max: 100,
		value: 50,
		slide: function( event, ui ) {
				refreshPercent(type,  ui.value,question_type);
			}
		});
		refreshPercent(type, "50",question_type);
}

function refreshPercent(type, value, question_type){
	$( "#"+type+"-percent-"+question_type ).text( value);
	wish_values[type]=value;
    refreshCanvas(question_type);
    refreshTestResult();
}

function refreshCanvas(question_type){
	
	var canvas = canvasMap[question_type];
	var context = canvas.getContext("2d");
	
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "lightgray";
    context.font = 'normal 48pt FontAwesome';

	context.textAlign = 'center';
    context.fillStyle = '#364e59';

	context.fillText(question_types_icons[question_type], canvas.width/2, canvas.height/1.8);

	for (var i=0; i<types.length; i++) {
		drawEllipse(types[i], question_type);
	}
}

function drawEllipse(type, question_type) {
	
	var canvas = canvasMap[question_type];
	var context = canvas.getContext("2d");
	
	var value = Math.round($( "#"+type+"-percent-"+question_type ).text());
	var offset = canvas.width /5;
	var centerX = offset*type_offset_x[type] + canvas.width / 5;
	var centerY = offset*type_offset_y[type] + canvas.height / 5;
	var radius = canvas.width*value / 800;
	    
	var random_p1 = radius*(1*(random_1[type]-0.5));
	var random_p2 = radius*(1*(random_2[type]-0.5));

	var random_p3 = radius*(1*(random_3[type]-0.5));
	var random_p4 = radius*(1*(random_4[type]-0.5));
	
	context.beginPath();
	context.moveTo(centerX, centerY - radius); // A1
	context.bezierCurveTo(
		centerX + radius + random_p1, centerY - radius + random_p2, // C1
		centerX + radius + random_p3, centerY + radius + random_p4, // C2
		centerX, centerY + radius); // A2

	context.bezierCurveTo(
		centerX - radius - random_p3, centerY + radius - random_p4, // C3
		centerX - radius - random_p1, centerY - radius - random_p2, // C4
		centerX, centerY - radius); // A1
	 

	context.fillStyle = fill_color[type];
	context.fill();
	context.lineWidth = 6;
	context.strokeStyle = stroke_color[type];
	context.stroke();
	
//	context.fillStyle = "#bcbcbc";
//	context.font      = "bold 18px sans-serif";
//	context.fillText("IMPORTANTE", canvas.width/2, canvas.height/2);

//	context.fillStyle = "rgba(255, 255, 255, 0.7)";
//	context.textAlign = 'right';
//	context.fillText("\f013", 110, counter.y - halfWidth +20);
//	context.textAlign = 'center';
}

function enableType(type, question_type, enable){
	

	if(enable){
		$("#"+type+"-slider-"+question_type).slider('enable');
		initSlider(type, question_type);
	}
	else{
		wish_values[type] = -1;
		$("#"+type+"-slider-"+question_type).slider('disable');
		$("#"+type+"-slider-"+question_type).slider({ value: 0 });
		refreshPercent(type, 0, question_type);
	}
}

function refreshHour(day_type){
	var total = 0;
	for (var j=0; j<necessary_activity_types.length; j++) {
		total += parseFloat($("#hour-"+day_type+"-"+necessary_activity_types[j]).val());
		//console.debug(total);
	}
	for (var j=0; j<types.length; j++) {
		total += parseFloat($("#hour-"+day_type+"-"+types[j]).val());
		//console.debug("#hour-"+day_type+"-"+types[j] + ":" +total);
	}
	if(total>24){
		$("#total-hour-"+day_type+"-message").text(" too many hours in a single day... ");
		$("#total-hour-"+day_type).css("color", "#fcaf3e");
	}
	else if(total<24){
		$("#total-hour-"+day_type+"-message").text(" some more hours... ");
		$("#total-hour-"+day_type).css("color", "#fcaf3e");
	}
	else{
		$("#total-hour-"+day_type+"-message").text("");
		$("#total-hour-"+day_type).css("color", "#73d216");
	}
	$("#total-hour-"+day_type).text(total);
	drawSectorRing(day_type);
	refreshTestResult();
}

function drawSector(day_type) {
	
	var canvas = canvasMap[day_type];
	var context = canvas.getContext("2d");

	context.clearRect(0, 0, canvas.width, canvas.height);
	var centerX = canvas.width/2;
	var centerY = canvas.height/2;
	var radius = canvas.width/2-64; 
	var endAngle = 0;
   
	for (var j=0; j<necessary_activity_types.length; j++) {
		var value = parseFloat($("#hour-"+day_type+"-"+necessary_activity_types[j]).val());
		var startAngle = endAngle;
		endAngle += 2*Math.PI*value/24;

		var offsetX = Math.cos(endAngle-(endAngle-startAngle)/2)*24;
		var offsetY = Math.sin(endAngle-(endAngle-startAngle)/2)*24;
		var offsetR = Math.sqrt(offsetX*offsetX + offsetY*offsetY);
		context.fillStyle = 'red';
		//context.fillRect(centerX + offsetX,centerY + offsetY,4,4);
	    context.beginPath();
		//context.moveTo(centerX + offsetX, centerY +offsetY);
	    context.arc(centerX + offsetX, centerY +offsetY, radius + offsetR, startAngle, endAngle, false);
		//context.closePath();
	    context.fillStyle = fill_color[necessary_activity_types[j]];
	    //context.fill();	
	    context.lineWidth = 1;
	    context.strokeStyle = stroke_color[necessary_activity_types[j]];
		context.stroke();
	}
	for (var j=0; j<types.length; j++) {
		var value = parseFloat($("#hour-"+day_type+"-"+types[j]).val());
		var startAngle = endAngle;
		endAngle += 2*Math.PI*value/24;
		var offsetX = Math.cos(endAngle-(endAngle-startAngle)/2)*24;
		var offsetY = Math.sin(endAngle-(endAngle-startAngle)/2)*24;
		var offsetR = Math.tan(endAngle-(endAngle-startAngle)/2)*24;
		context.fillStyle = 'blue';
		//context.fillRect(centerX + offsetX,centerY + offsetY,4,4);
		
	    context.beginPath();
		//context.moveTo(centerX + offsetX, centerY +offsetY);
	    context.arc(centerX + offsetX, centerY +offsetY, radius+offsetR, startAngle, endAngle, false);
		//context.closePath();
	    context.fillStyle = fill_color[types[j]];
	    //context.fill();
	    context.lineWidth = 1;
		context.strokeStyle = stroke_color[types[j]];
		context.stroke();

	}
}

function drawSectorRing(day_type) {
	
	var canvas = canvasMap[day_type];
	var context = canvas.getContext("2d");

	context.clearRect(0, 0, canvas.width, canvas.height);
	var centerX = canvas.width/2;
	var centerY = canvas.height/2;
	var radius = canvas.width/3-10; 
	var endAngle = 0;
	var all_activity_type = new Array();
	var counter = 0;
	for (var j=0; j<necessary_activity_types.length; j++) {
		all_activity_type[counter] = necessary_activity_types[j];
		counter++;
	}
	for (var j=0; j<types.length; j++) {
		all_activity_type[counter] = types[j];
		counter++;
	}
	
	context.fillStyle = "lightgray";
    context.font = 'normal 48px FontAwesome';

	context.textAlign = 'center';
    context.fillStyle = '#364e59';

	context.fillText(day_types_icons[day_type], centerX, centerY+16);
	
	for (var j=0; j<all_activity_type.length; j++) {
		var value = parseFloat($("#hour-"+day_type+"-"+all_activity_type[j]).val());
		var startAngle = endAngle;
		var lineWidth = radius*.8;

		// segment before
//		endAngle += 2*Math.PI*.25/(24+all_activity_type.length/4);
//	    context.beginPath();
//	    context.arc(centerX, centerY, radius, startAngle, endAngle, false);
//		context.lineWidth = radius*.8;
//	    context.strokeStyle = stroke_color[all_activity_type[j]];
//	    context.stroke();

	    // segment
		startAngle = endAngle;
		endAngle += 2*Math.PI*value/(24+all_activity_type.length);
	    context.beginPath();
	    context.arc(centerX, centerY, radius, startAngle, endAngle, false);
		context.lineWidth = radius*.8;
	    context.strokeStyle = fill_color[all_activity_type[j]];
	    context.stroke();

	    context.beginPath();
	    context.arc(centerX, centerY, radius+lineWidth/2, startAngle, endAngle, false);
		context.lineWidth = 8;
	    context.strokeStyle = stroke_color[all_activity_type[j]];
	    context.stroke();

	    context.beginPath();
	    context.arc(centerX, centerY, radius-lineWidth/2, startAngle, endAngle, false);
		context.lineWidth = 8;
	    context.strokeStyle = stroke_color[all_activity_type[j]];
	    context.stroke();
	    

	    // segment after
//		startAngle = endAngle;
//		endAngle += 2*Math.PI*.25/(24+all_activity_type.length/2);
//	    context.beginPath();
//	    context.arc(centerX, centerY, radius, startAngle, endAngle, false);
//		context.lineWidth = radius*.8;
//	    context.strokeStyle = stroke_color[all_activity_type[j]];
//	    context.stroke();

		startAngle = endAngle;
		endAngle += 2*Math.PI*.75/(24+all_activity_type.length/4);
		
		
	}
}

function drawSectorPie(day_type) {
	
	var canvas = canvasMap[day_type];
	var context = canvas.getContext("2d");

	context.clearRect(0, 0, canvas.width, canvas.height);
	var centerX = canvas.width/2;
	var centerY = canvas.height/2;
	var radius = canvas.width/2-10; 
	var endAngle = 0;
	for (var j=0; j<necessary_activity_types.length; j++) {
		var value = parseFloat($("#hour-"+day_type+"-"+necessary_activity_types[j]).val());
		var startAngle = endAngle;
		endAngle += 2*Math.PI*value/24;
	    context.beginPath();
		context.moveTo(centerX,centerY);
	    context.arc(centerX, centerY, radius, startAngle, endAngle, false);
		context.moveTo(centerX,centerY);
	    context.fillStyle = fill_color[necessary_activity_types[j]];
	    context.fill();
	}
	for (var j=0; j<types.length; j++) {
		var value = parseFloat($("#hour-"+day_type+"-"+types[j]).val());
		var startAngle = endAngle;
		endAngle += 2*Math.PI*value/24;
	    context.beginPath();
		context.moveTo(centerX,centerY);
	    context.arc(centerX, centerY, radius, startAngle, endAngle, false);
		context.moveTo(centerX,centerY);
	    context.fillStyle = fill_color[types[j]];
	    context.fill();

	}
}


function refreshTestResult(){
	var qolIndex = 0;

	$("#result-error-message-container").hide();
	
	var errorMessage = "";
	var errorOnHoliday = false;
	var errorOnWorkday = false;
	if($("#total-hour-holiday").text()!="24"){
		errorOnHoliday = true;
	}
	if($("#total-hour-workday").text()!="24")
		errorOnWorkday = true;
	
	if(errorOnHoliday || errorOnWorkday){
		$("#result-error-message-container").show();
		if(errorOnHoliday && errorOnWorkday)
			errorMessage = "lavorative e di vacanza";
		else if(errorOnHoliday)
			errorMessage = "di vacanza";
		else 
			errorMessage = "lavorative";
		$("#result-error-message").html("Warning, something is wrong in your days "+ errorMessage +", the total of hours isn't 24...");
	}
	
	
	
	
	
	var workdaysInYear = parseInt($("#workdays-in-year").val());
	// satisfaction
	var qImportanceTime = {};
	var qSatisfactionTime = {};
	var qImportanceSatisfaction = {};
	var detailsTableRows  ="";
	var necessaryTimeWorkday = 0;
	var necessaryTimeHoliday = 0;
	for (var j=0; j< necessary_activity_types.length; j++) {
		necessaryTimeWorkday += parseFloat($("#hour-"+day_types[0]+"-"+necessary_activity_types[j]).val());
		necessaryTimeHoliday += parseFloat($("#hour-"+day_types[1]+"-"+necessary_activity_types[j]).val());
	}
	for (var j=0; j<types.length; j++) {
		var important =  ($( "#"+types[j]+"-percent-"+question_types[0] ).text())/100;
		var satisfaction =  ($( "#"+types[j]+"-percent-"+question_types[1] ).text())/100;

		
		var workdayTime = parseFloat($("#hour-"+day_types[0]+"-"+types[j]).val());
		var holidayTime = parseFloat($("#hour-"+day_types[1]+"-"+types[j]).val());

		var time = 0;
		if((365*24 - workdaysInYear*necessaryTimeWorkday - (365-workdaysInYear)*necessaryTimeHoliday)>0)
			time = ((workdayTime*workdaysInYear+holidayTime*(365-workdaysInYear))/(365*24 - workdaysInYear*necessaryTimeWorkday - (365-workdaysInYear)*necessaryTimeHoliday))*types.length;
		
		console.debug(types[j] + " - W: " + workdayTime + " - H: " + holidayTime + " - T: " + time );
		var limitTime = time;
		if(time>1)
			limitTime=1;
		qImportanceTime[types[j]] = 1-Math.abs(important-limitTime);
		qSatisfactionTime[types[j]] = 1-Math.abs(satisfaction-limitTime);
		qImportanceSatisfaction[types[j]] = 1-Math.abs(important-satisfaction);
		
		qolIndex +=((qImportanceTime[types[j]] + qSatisfactionTime[types[j]] +qImportanceSatisfaction[types[j]])*100/24);
		detailsTableRows += "<tr>";
		detailsTableRows += "<td><span class='"+types[j]+ "-color'><i class='"+types_icons[types[j]]+ "'></i> "+types_labels[types[j]]+"</span></td>";
		detailsTableRows += "<td>";
		detailsTableRows += "<div>"+format01Percent(qImportanceTime[types[j]]) +getTestResultIcon(qImportanceTime[types[j]],1,0)+ "</div>";
		detailsTableRows += "<div class='test-deep-detail-label'>Time"+getTestDetailResultIcon(time,1,0)+" Importance"+getTestDetailResultIcon(important,1,0)+"</div>";
		detailsTableRows += "</td>";

		detailsTableRows += "<td>";
		detailsTableRows += "<div>"+format01Percent(qSatisfactionTime[types[j]]) +getTestResultIcon(qSatisfactionTime[types[j]],1,0)+ "</div>";
		detailsTableRows += "<div class='test-deep-detail-label'>Time"+getTestDetailResultIcon(time,1,0)+" Satisfaction"+getTestDetailResultIcon(satisfaction,1,0)+"</div>";
		detailsTableRows += "</td>";

		detailsTableRows += "<td>";
		detailsTableRows += "<div>"+format01Percent(qImportanceSatisfaction[types[j]]) +getTestResultIcon(qImportanceSatisfaction[types[j]],1,0)+ "</div>";
		detailsTableRows += "<div class='test-deep-detail-label'>Importance"+getTestDetailResultIcon(important,1,0)+" Satisfaction"+getTestDetailResultIcon(satisfaction,1,0)+"</div>";
		detailsTableRows += "</td>";


		detailsTableRows += "</tr>";

	}
	console.warn(qolIndex);
	qolIndex = Math.round((qolIndex-33)/.67);
	$("#test-result").text(qolIndex +"%");
	$("#test-result-int").text(qolIndex);
	$("#test-result-icon").html(getTestResultIcon(qolIndex,100,0));
	$("#test-detail-result-tbody").html(detailsTableRows);
	
	//console.debug("Q: " +qolIndex);
	
}

function getTestResultIcon(value, maxValue, offset){
	var formatIconsValue = formatTestResultIcons(value, maxValue, offset);
	return "&nbsp;<span class='"+formatIconsValue+"-life'><i class='icon-"+formatIconsValue+"'></i></span>";
}

function getTestDetailResultIcon(value, maxValue, offset){
	var icon;
	if(value<(maxValue-offset)/3+offset){
		icon = "down";
		title = "low " + format01Percent(value);
	}
	else if(value<2*(maxValue-offset)/3+offset){
		icon =  "right";
		title = "middle " + format01Percent(value);
	}
	else{
		icon  = "up";
		title = "high " + format01Percent(value);
	}
	return "<span class='deep-detail-icon deep-detail-icon-"+icon+"' title='"+title+"'><i class='icon-caret-"+icon+"'></i></span>";
}

function formatTestResultIcons(value, maxValue, offset){
	//console.debug("v: " + value + " max: " + maxValue + " offset: " + offset);
	if(value<(maxValue-offset)/3+offset){
		return "frown";
	}
	else if(value<2*(maxValue-offset)/3+offset){
		return "meh";
	}
	else{
		return "smile";
	}
}


function getSharePicture(value, maxValue, offset){
	if(value<(maxValue-offset)/3+offset){
		return SHARE_PICTURE +"frown.png";
	}
	else if(value<2*(maxValue-offset)/3+offset){
		return SHARE_PICTURE +"meh.png";
	}
	else{
		return SHARE_PICTURE +"smile.png";
	}
}

function format01Percent(value){
	return (value*100).toFixed(0)+"  %  ";
}

function getShareMessage(includeUrl){
	var message= SHARE_TEXT+$("#test-result").text();
	if(includeUrl)
		message += " - Try your level on " + HOME_URL; 
	return escape(message);
}


function postOnFacebook() {
	var picture = getSharePicture(parseInt($("#test-result-int").text()),100,0);
    var obj = {
      method: 'feed',
      link: HOME_URL,
      picture: picture,
      name: SHARE_TEXT+$("#test-result").text(),
      caption: '',
      description: "Calcola la tua percentuale su " + HOME_URL
    };
    function callback(response) {
      document.getElementById('msg').innerHTML = "Post ID: " + response['post_id'];
    }

    FB.ui(obj, callback);
  }


function postOnFacebookWithLink(){
	var urlComplete = "http://www.facebook.com/sharer/sharer.php?s=100&p[url]="+HOME_URL+"&p[images][0]="+LOGO_URL+"&p[title]="+getShareMessage(false)+"&p[summary]=Calcola la tua percentuale su " + HOME_URL;
	console.info(urlComplete);
	window.open(urlComplete, "_blank","toolbar=no,width=600,height=600,fullscreen=no, resizable=1, scrollbars=1");
}

function postOnTwitter(){
	var urlComplete = "http://twitter.com/share?hashtags="+SHARE_HASHTAG+"&text="+getShareMessage(true);
	window.open(urlComplete, "_blank","toolbar=no,width=600,height=600,fullscreen=no, resizable=1, scrollbars=1");
}

function postOnGooglePlus(){
	var urlComplete = "https://plus.google.com/share?url="+HOME_URL+"&title="+getShareMessage(true);
	window.open(urlComplete, "_blank","menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600");
}

function postOnTumblr(){http://www.tumblr.com/share/text?title=
	var urlComplete = "http://www.tumblr.com/share/text?title=" + getShareMessage(false) + "&body=" + escape("Calcola la tua percentuale su " + HOME_URL)+"&tags="+SHARE_HASHTAG;
	window.open(urlComplete, "_blank","menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600");
}
 

