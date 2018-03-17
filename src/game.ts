import {$, dc, getRandomInt, getParameterByName} from './util'
import {World, Globals, getGlobals } from './globals'

import StateManager from './StateManager'

window.onload = function() {
    const globals: Globals = {
        context: null,
        world: null
    }

    const gLeft = $("left_col");
    const gRight = $("left_col");
    const gTable = $("thetable");

    const gCanvas: HTMLCanvasElement = dc("canvas");
    gCanvas.width = 800;
    gCanvas.height = 600;
    gLeft.appendChild(gCanvas);

    const gContext: CanvasRenderingContext2D = gCanvas.getContext("2d");

	if (getParameterByName("Pinyin") == '1') {
	    const gPinyin = dc("p");
        const text = document.createTextNode(" ");
        gPinyin.appendChild(text);
        gLeft.appendChild(gPinyin);
	}
	if (getParameterByName("Audio") == '1') {
        const gAudio = dc("span");
        $("foot").appendChild(gAudio);
	}
	if (getParameterByName("English") == '1' || (!gPinyin && !gAudio)) {
		gQuestion = dc("p");
        var text = document.createTextNode(" ");
        gQuestion.appendChild(text);
        gLeft.appendChild(gQuestion);
	}

	const gDivs = [gQuestion, gPinyin, gAudio];

    const world: World = {
        debug: false,

        keyState: Array(),
        state: new StateManager(), // Defaults to state LOADING.
        images: new game.ImageManager(),
        sounds: new game.SoundManager()

        playerinfo: new PlayerInfoManager(),

        tileDisplayWidth: 32,
        mapWidth: 800,
        mapHeight: 600,
        arenaWidth: 512,
        arenaHeight: 480,

        problems: Array(), // Randomly ordered array of problem instances grouped by level.
        mapplayer: null, // save the player obj

        loopCount: 0,

        message: null,
        textcolor: 'White',
        textsize: '18pt Arial',

        then: Date.now(),
        now: 0,
        dt: 0,

        localTTS: false,
        hp: new HanyuPinyin(),
        tts: new ChineseTextToSpeech(),
        toggleSpeaker: function() {
            world.localTTS = !world.localTTS;
            /*var s = 'Speaker A';
            if (world.localTTS) {
                s = 'Speaker B';
            }*/
            var s = "switching speaker";
            world.message = new game.Message(s);
        },
    };
    globals.world = world

    window.addEventListener('keydown', onKeyDown, false);
    window.addEventListener('keyup', onKeyUp, false);
    gCanvas.addEventListener('click', onMouseClick);

    loadWords();

    mainloop();
    //var ONE_FRAME_TIME = 1000 / 60; // 60 per second
    //setInterval( mainloop, ONE_FRAME_TIME );
}

function onKeyDown(event) {
    //console.log(event.keyCode);
    var stateengine = world.state.getStateEngine();
    if (typeof stateengine.onKeyDown === 'function') {
        stateengine.onKeyDown(event);
    }

    // The following should really be done in the relevant state engines.
    if (state == world.state.states.ARENA || state == world.state.states.PAUSED) {
        if (event.keyCode == 80) {
            // p
            pause();
        }
        if (event.keyCode == 77) {
            // m
            mute();
        }
        if (event.keyCode == 83) {
            // s
            world.toggleSpeaker();
        }
    }
    if (state == world.state.states.MAP || state == world.state.states.OVERLAY) {
        if (event.keyCode == 72) {
            // h
            overlay();
        }
    }
    world.keyState[event.keyCode] = true;
}
function onKeyUp(event) {
    world.keyState[event.keyCode] = false;
}
function onMouseClick(event) {
}
function pause() {
    var state = world.state.getState();
    if (state == world.state.states.ARENA) {
        world.state.pushState(world.state.states.PAUSED);
    } else if (state == world.state.states.PAUSED) {
        world.state.popState();
    }
    //ignore p if in any other state
}
function mute() {
    world.sounds.togglemute();
    if (world.sounds.enabled) {
        world.message = new game.Message('unmuted');
    } else {
        world.message = new game.Message('muted');
    }
}
function overlay() {
    var state = world.state.getState();
    if (state == world.state.states.MAP) {
        var stateEngine = world.state.getStateEngine();
        var cameraPosition = stateEngine.cameraposition;
        var bottomRight = stateEngine._getBottomRight();

        stateEngine = world.state.pushState(world.state.states.OVERLAY);
        stateEngine.cameraPosition = cameraPosition;
        stateEngine.bottomRight = bottomRight;
        
    } else if (state == world.state.states.OVERLAY) {
        world.state.popState();
    }
    //ignore h if in any other state
}

function loadWords() {
	var traditionaloffset = 0;
	if (getParameterByName("traditional") == '1') {
		traditionaloffset = 1;
	}
	var squiglytoneoffset = 1; // hē
	if (getParameterByName("tone") == '1') {
		squiglytoneoffset = 0; // he1
	}

	var files = ["./lang/HSK Official With Definitions 2012 L1.txt",
				 "./lang/HSK Official With Definitions 2012 L2.txt",
				 "./lang/HSK Official With Definitions 2012 L3.txt",
				 "./lang/HSK Official With Definitions 2012 L4.txt",
				 "./lang/HSK Official With Definitions 2012 L5.txt",
				 "./lang/HSK Official With Definitions 2012 L6.txt"];
	var filestouse = Array();
	var wordobjects = Array();
	for (var i in files) {
		var n = i;
		var name = "HSK"+(++n);
		wordobjects[i] = Array();
		//if (util.getParameterByName(name)) {
			var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
			xmlhttp.onreadystatechange = function() {
				
			}
			xmlhttp.open("GET", files[i], false);
			xmlhttp.send();
			if(xmlhttp.status==200 && xmlhttp.readyState==4) {
				//replace new lines with tabs then split on tabs.
			    var words = xmlhttp.responseText.replace(/(\r\n|\n|\r)/gm,"\t").split(/\t/g);

			    for (var j = 0; j < words.length; j += 5) {
			    	if (words[j] && words[j + traditionaloffset] != "") {

					    wordobjects[i].push(new game.Word(words[j + traditionaloffset],
                                                        words[j + 2 + squiglytoneoffset],
                                                        squiglytoneoffset == 1 ? words[j + 2] : null,
					                                    words[j + 4],
					                                    true));
			        }
			    }
			}
		//}
	}

    var correctwordcharcount = 0;
    var wrongword = null;
    var wordarray = null;
    var totalwordcount = wordobjects[i].length;
    var attempts = 0;
    for (var i in files) {
        totalwordcount = wordobjects[i].length;
        world.problems[i] = Array();

        if (world.debug) {
            var lengthnotmatch = 0;
        }
	    for (var j in wordobjects[i]) {
	        correctwordcharcount = wordobjects[i][j].character.length;
	        wordarray = Array();
	        wordarray.push(wordobjects[i][j]);
	        attempts = 0;

	        while (wordarray.length < 4) {
	            wrongword = wordobjects[i][getRandomInt(0, totalwordcount - 1)];
	            if (wrongword.character != wordobjects[i][j].character
	                && (attempts > 40 || wrongword.character.length == correctwordcharcount)) {

                    if (world.debug && attempts > 40) {
                        lengthnotmatch++;
                        //console.log("gave up trying to character count match "+wordobjects[i][j].character);
                    }
                    wrongword = new Word(wrongword.character, wrongword.pinyin, wrongword.getToRead(), wrongword.english, false);
                    wordarray.push(wrongword);
                    attempts = 0;
	            } else {
	                attempts++;
	            }
	        }
	        world.problems[i].push(new game.Problem(shuffleArray(wordarray)));
	    }
	    if (world.debug) {
	        //world.problems[i].splice(0, world.problems[i].length - 3);
	    }
	    world.problems[i] = shuffleArray(world.problems[i]);

	    if (world.debug) {
	        console.log("loaded file "+i);
	        console.log("contains how many phrases? " + world.problems[i].length);
	        console.log(lengthnotmatch+" incorrect answers could not be length matched");
	    }
    }
}

function updateGame(dt) {
    var stateengine = world.state.getStateEngine();
    if (stateengine) {
        stateengine.update(dt);
    }
    if (world.message) {
        if (world.message.update(dt) == false) {
            world.message = null;
        }
    }
}
    
function drawGame() {
    gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
    world.state.getStateEngine().draw();
    if (world.debug) {
        var frames = Math.floor(1/world.dt);
        drawText(gContext,
                 frames,
                 world.textsize,
                 world.textcolor,
                 150,
                 0);
    }
}

var mainloop = function() {
    const globals = getGlobals()
    const world = globals.world

    if (world != null) {
        world.now = Date.now();

        const state = world.state.getState();
        if (state != world.state.states.PAUSED && world.then != 0) {
            world.dt = (world.now - world.then)/1000;
            //world.dt = (1000 / 60)/1000;

            if (world.dt > 0.25) {
                console.log('large dt detected');
                //world.dt = (1000 / 60)/1000; // 1/60th of a second.
                world.dt = 0;
            } else {
                world.loopCount++;
                world.loopCount %= 20; //stop it going to infinity

                updateGame(world.dt);
                drawGame();
            }
        }
        world.then = world.now;
    }

    window.requestAnimFrame(mainloop);
};
window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

