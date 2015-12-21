var HOUR_ROTATION = 360/14;
var MINUTE_ROTATION = 360/60;
var DAY_ROTATION = 360/12;
var h, m, s, d;

var hspeed, mspeed, dspeed, updateInterval;

var isFastMode = true;
var fastModeMilliSec = 1450730177066 + 14*60*60*1000;

$(function() {
	isFastMode = checkFastMode();
	if(isFastMode) { getFastModeDate(); }
	else { getNowDate(); }
	initSettings();
	changeNumPlate();
	minuteNeedle(0, m);
	hourNeedle(0, h);
	dayNeedle(0, d);
	setInterval(clockUpdate, updateInterval);
});

function checkFastMode() { 
    var vars = [], hash; 
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'); 
    for(var i = 0; i < hashes.length; i++) { 
        hash = hashes[i].split('='); 
        vars.push(hash[0]); 
        vars[hash[0]] = hash[1]; 
    }
    return hashes.length != 0 && vars["fast"] == "true"; 
}

function initSettings() {
	if(isFastMode) {
		hspeed = 300;
		mspeed = 1;
		dspeed = 600;
		updateInterval = 30;
		$("#switch-item-demo").addClass("selected");
	}	else {
		hspeed = 1000;
		mspeed = 1000;
		dspeed = 1000;
		updateInterval = 1000;
		$("#switch-item-now").addClass("selected");
	}
}

function getNowDate() {
	var today = new Date();
  m = today.getMinutes();
  s = today.getSeconds();
  d = (today.getDay() + 4) % 7;
	h = (d * 24 + today.getHours()) % 28;
	d = parseInt((d * 24 + today.getHours()) / 28);
}

function getFastModeDate() {
	fastModeMilliSec += 1000 * 60;
	var today = new Date(fastModeMilliSec);
  m = today.getMinutes();
  s = today.getSeconds();
  d = (today.getDay() + 4) % 7;
	h = (d * 24 + today.getHours()) % 28;
	d = parseInt((d * 24 + today.getHours()) / 28);
}

function clockUpdate() {
	if(isFastMode) { getFastModeDate(); }
	else { getNowDate(); }
  if(isFastMode || s == 0) {
  // 	console.log("change minute needle.");
  	minuteNeedle(m-1, 1);
	  if(m == 0) {
	  	// console.log("change hour needle.");
	  	hourNeedle(h-1, 1);
		  if(h == 0) {
		  	// console.log("change day needle.");
	  		if(d == 0) {
		  		dayNeedle(5, 7);
	  		} else {
		  		dayNeedle(d-1, 1);
	  		}
		  	changeNumPlate();
		  } else if(h==14) {
		  	changeNumPlate();
		  }
	  }
  }
}

function changeNumPlate() {
	var name = h < 14 ? 0 : 1;
  setTimeout(function() {
  	var css = '<style id="num-plate-style" type="text/css">#hour:before{background-image: url("./img/01/hour_num_'+name+'.png");}</style>';
  	$('#num-plate-style').replaceWith($(css));
  }, 500);
}

function minuteNeedle(baseRot, mRot) {
	$("#min").animate({"z-index": 1},
	  { duration: mspeed,
	    step: function (num) {
	      $(this).css({transform: "rotate(" + ((baseRot + num * mRot) * MINUTE_ROTATION) + "deg)"});
	    },
	    complete: function () {
	      $('#min').css('z-index', 0);
	    }
	  }
	);
}
function hourNeedle(baseRot, hRot) {
	$("#hour div").animate({"z-index": 1},
	  { duration: hspeed,
	    step: function (num) {
	      $(this).css({transform: "rotate(" + ((baseRot + num * hRot) * HOUR_ROTATION) + "deg)"});
	    },
	    complete: function () {
	      $('#hour div').css('z-index', 0);
	    }
	  }
	);
}
function dayNeedle(baseRot, dRot) {
	$("#day div").animate({"z-index": 1},
	  { duration: dspeed,
	    step: function (num) {
	      $(this).css({transform: "rotate(-" + ((baseRot + num * dRot) * DAY_ROTATION) + "deg)"});
	    },
	    complete: function () {
	      $('#day div').css('z-index', 0);
	    }
	  }
	);
}