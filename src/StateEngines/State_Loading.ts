const Thing = require('../Thing');

export default class State_Loading extends Thing {
    end() {
    }

    draw() {
        //drawInstructions(false);
        var total = gWorld.sounds.sounds.length + gWorld.images.images.length;
        var loaded = gWorld.sounds.numSoundsLoaded + gWorld.images.numImagesLoaded;
        if (loaded < total) {
            //gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
            var text = "Loading...    "+loaded+"/"+total;
            drawText(gContext, text, gWorld.textsize, gWorld.textcolor, gCanvas.width/2, 400);
            //return;
        } else {
            gWorld.state.setState(gWorld.state.states.MAP);
        }
    }
    
    update = function(dt) {
    }
}
