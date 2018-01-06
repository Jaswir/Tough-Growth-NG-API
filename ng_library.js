
var ngio;
var  ng_connect = function(app_id, encryption_key){
	ngio = new Newgrounds.io.core(app_id, encryption_key);
}



/* medal vars */
var medals;
var medalDOM = document.createElement("div");

/* handle loaded medals */
var onMedalsLoaded = function(result) {
    if (result.success) medals = result.medals;
}


var ng_initialize = function(){

	/* load our medals  from the server */
	_loadMedals();

    /* setup medalcarrier */
    _createMedalUI();
	
}

/* load our medals  from the server */
var _loadMedals = function(){	
	ngio.queueComponent("Medal.getList", {}, onMedalsLoaded);
	ngio.executeQueue();
}

var _createMedalUI = function(){

  // Creates the DOM with a medal carrier that is supposed to resemble the newgrounds version
  document.body.appendChild(medalDOM);
  medalDOM.innerHTML = 
        "<div id='medal_container' style="+
	        "'position:absolute; "+
	        "background-color: rgb(5, 6, 9);"+
	        "border: 7px solid  rgb(185, 163, 105);"+
	        "width:270px; "+
	        "height:70px; "+
	        "top: 51px; "+
	        "left: -310px; "+
	        "overflow:hidden; "+
	        "pointer-events: none;"+ 
	        "-webkit-transition:left 0.5s ease;"+
	        " -moz-transition:left 0.5s ease;"+
	        " -ms-transition:left 0.5s ease; "+
	        "-o-transition:left 0.5s ease;"+
	        "<div id = 'inner_medal' style = "+
        		"'left : -1px; "+
        		"position: relative;'>"+
    			"<div id = 'medal_icon' style = "+
    			"'background-color: rgb(5, 6, 9); "+
    			"border: 3.5px ridge  rgb(57, 55, 61);"+
    			"width: 59px; "+
    			"height: 59px; "+ 
    			"left: 3px; "+
    			"top: 3px; "+ 
    			"position: relative;'>"+
                "<img id = 'icon' style = "+
                	"'border: 3px solid "+
                	"rgb(57, 55, 61); "+
                	"width: 48px; "+
                	"height: 48px; "+
                	"left: 1px; "+
                	"top: 1px; "+
                	"position: relative;'"+
                	"src = ''>"+
        		"</div>"+  
    	       	"<div id = 'medal_describer' style = "+
        		"'background-color: rgb(5, 6, 9); " +
	        	"border: 3.5px ridge  rgb(57, 55, 61); "+
	        	"width: 196px; "+
	        	"height: 39px; "+
	        	"left: 66px; "+
	        	"top: -43px; "+
           		"position: relative;'>"+
                	"<div id = 'space' style = "+
	                	"'background-color: rgb(39, 39, 47);"+
	                	" width: 191px; "+
	                	" height: 35px; "+
	                	" line-height: 36px;"+
	                	" text-align: center;"+
	                	" left: 1px;"+
	                	" top: 0px;"+
	                	" position: relative; '> "+ 
					    "<span id = 'medal_description' style = "+
					    	"'/*font*/"+
					    	"font-family: arial;"+
					    	"font-weight: 720;"+
					    	"font-weight: 720;"+
					    	"font-size : 12px;"+
					    	" /*text*/"+
					    	"letter-spacing: 0.5px;"+
					    	"color: rgb(238, 240, 254);'> Sabooo"+
					    "</span>"+       
	                "</div>"+
	            "</div>"+
                "<div id = 'medal_headup' style ="+
					"'background-color: rgb(5, 6, 9);"+
					" border: 3.5px ridge  rgb(57, 55, 61);"+
					" width: 196px;"+
					" height: 22px;"+
					" left: 66px;"+
					" top: -109px;"+
					" position: relative;'>"+ 
	           		" <div id = 'medal_feedback' style = "+
	           			"' background-color: rgb(18, 15, 20);"+
	           			" border: 2px solid  rgb(39, 39, 47);" +
	           			" width: 187px;" +
	 					" height: 15px;"+
	 					" line-height: 12px;"+
	 					" left: 1px;"+
	 					" top: 0px;"+
	 					" position: relative;'>"+
	 					"<span id= 'feedback' style = "+
	 						"'  /*font*/"+
	 						"font-family: arial;"+
	 						"font-weight: 750;"+
	 						"font-size : 11px;"+
	 						"/*text*/"+
	 						"position: relative;"+
	 						"left: 9px;"+
	 						"text-transform: uppercase;"+
	 						"letter-spacing: 0.5px;"+
	 						" color: rgb(224, 192, 9);'>medal get!"+
	 					"</span>"+
						"<span id= 'medal_value' style = "+
							"'/*font*/"+
							"font-family: arial;"+
							"font-weight: 720;"+
							"font-size : 11px;"+
							"/*text*/"+
							"position: relative;"+
							"left: 64px;"+
							"letter-spacing: 0.5px;"+
							"color: rgb(93, 93, 99);'>25pts"+
						"</span>"+
					" </div>"+
				"</div>"+
        	"</div>"+
        "</div>";
};


/*Displays the medal carrier on the screen by transitioning it on the screen
and writes the medal details on the carrier */
var _showMedal = function(medal){

 	var medal_container = document.getElementById('medal_container');
    medal_container.style.left = '10px';
    setTimeout(function(){
        medal_container.style.left = '-310px';
    },2000);
    
    document.getElementById('icon').src = medal.icon;
    document.getElementById('medal_description').innerHTML = medal.name;
    var points = ["bogus", "5", "10", "25", "50", "100"];
    document.getElementById('medal_value').innerHTML = points[medal.difficulty] + "pts";
};


var to_unlock = []

var ng_unlockmedal = function(medal_name) {

   
    for (var i = 0; i < medals.length; i++) {

        var medal = medals[i];

        /* look for a matching medal name */
        if (medal.name == medal_name) {

    		// Unlock and display if it's not unlocked yet
    		if(!medal.unlocked){
    			to_unlock.push(medal);
				setTimeout(function(){ 
					_loadMedals();
					_showMedal(medal);				
					to_unlock.pop(); 
							/* unlock the medal from the server */
			                ngio.callComponent('Medal.unlock', {id:medal.id}, function(result) {

			               		console.log("Successfully unlocked: ", medal.name);
			                    	
		               		});   
					}, 

					2500 * (to_unlock.length - 1));	
        	}
  
            // I use this return value inside gamemaker to play the audio effect at the right time
            var sfxTimeout = 2500 * (to_unlock.length - 1);
            if(medal.unlocked) sfxTimeout = -1;
            return sfxTimeout;      	
        }
	}
}

var left = "";
var canvas_sides = ["Left", "Right", "Top", "Bottom"];

var initialize_hackzorMedalDetection = function(){

	
	var canvas = document.getElementById("canvas");

	// //Mouse leave canvas event	
	canvas.onmouseleave = function(e)
	{	
		if(!left)
		{	
			//Gets side the canvas was left from
			var mouseX = e.clientX;
			var mouseY = e.clientY; 

			var width = canvas.scrollWidth;
			var height = canvas.scrollHeight;

			if(mouseX > width){
				left = "Right";
			}
			else if(mouseX < 0){
				left = "Left"; 
			}
			else if(mouseY > height){
				left = "Bottom"; 
			
			}
			else if(mouseY < 0){
				left = "Top"; 
			}
		}

	};


	//Mouse enter canvas event
	canvas.onmouseenter= function(e)
	{
		if(left != ""){

			//Gets side the screen was entered from
			var mouseX = e.clientX;
			var mouseY = e.clientY; 

			var width = canvas.scrollWidth;
			var height = canvas.scrollHeight;

			//Finds the side of the screen the pos is closest to
			canvas_sides["Right"] =  mouseX/width;
			canvas_sides["Left"]  =  1 - canvas_sides["Right"];
			canvas_sides["Bottom"] =  mouseY/height;
			canvas_sides["Top"]  =  1 - canvas_sides["Bottom"];
			var closest = Object.keys(canvas_sides).reduce(function(a, b){ return canvas_sides[a] > canvas_sides[b] ? a : b });

			//Determines hackzor
			hackzor = closest != left; 
			if(hackzor){

				gml_Script_gmcallback_hacked();

			}
			
			left = "";

		}
	};

}


