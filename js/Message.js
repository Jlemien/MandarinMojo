//(function() {

window.game = window.game || { };

game.Message = function(message) {
    //game.Thing.call(this, pos, [32,32], [0, 0]);
    this.age = 0;
    this.maxage = 2;
    this.message = message;
}
game.Message.prototype = new game.Thing();
game.Message.prototype.constructor = game.Message;

game.Message.prototype.draw = function(camerapos) {
    drawText(gContext,
             this.message,
             '48pt Arial',
             'yellow',
             gCanvas.width/2 + camerapos[0],
             gCanvas.height/2 + camerapos[1],
             0.4);
};
game.Message.prototype.update = function(dt) {
    //game.Thing.prototype.update.call(this, dt);
    this.age += dt;
    if (this.age > this.maxage) {
        return false;
    }
    return true;
};

//}());
