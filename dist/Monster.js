"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Thing = require('./Thing');
var Monster = /** @class */ (function (_super) {
    __extends(Monster, _super);
    function Monster(pos, type) {
        var _this = this;
        _this.type = type;
        _this.frame = 0;
        _this.maxframe = 1;
        switch (_this.type) {
            case 0:
                // Fly.
                _this.lives = 1;
                _this.sourcesize = [
                    [72, 36],
                    [75, 31]
                ];
                _this.sourcelocations = [
                    [0, 32],
                    [0, 0],
                ];
                _this.deadsize = [59, 33];
                _this.deadlocation = [143, 0];
                break;
            case 1:
                // Blob.
                _this.lives = 2;
                _this.sourcesize = [
                    [50, 28],
                    [51, 26]
                ];
                _this.sourcelocations = [
                    [52, 125],
                    [0, 125],
                ];
                _this.deadsize = [59, 12];
                _this.deadlocation = [0, 112];
                break;
            case 2:
                // Snail.
                _this.lives = 3;
                _this.sourcesize = [
                    [54, 31],
                    [57, 31]
                ];
                _this.sourcelocations = [
                    [143, 34],
                    [67, 87],
                ];
                _this.deadsize = [44, 30];
                _this.deadlocation = [148, 118];
                break;
        }
        //game.Thing.call(this, pos, [32, 32]);
        _this.pos, [32, 32];
        return _this;
    }
    return Monster;
}(Thing));
exports.default = Monster;
game.Monster.prototype.draw = function (camerapos) {
    var img = gWorld.images.getImage('monster');
    if (!img) {
        return;
    }
    if (this.isDead()) {
        var sourceX = this.deadlocation[0];
        var sourceY = this.deadlocation[1];
        var sourceWidth = this.deadsize[0];
        var sourceHeight = this.deadsize[1];
        gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, this.pos[0] + camerapos[0], this.pos[1] + camerapos[1], sourceWidth / 2, sourceHeight / 2);
        return;
    }
    if (gWorld.loopCount % 10 == 0) {
        this.frame++;
    }
    if (this.frame > this.maxframe) {
        this.frame = 0;
    }
    if (this.vel[0] > 0) {
        gContext.save();
        var flipAxis = this.pos[0] + this.size[0] / 2;
        gContext.translate(flipAxis, 0);
        gContext.scale(-1, 1);
        gContext.translate(-flipAxis, 0);
    }
    var sourceX = this.sourcelocations[this.frame][0];
    var sourceY = this.sourcelocations[this.frame][1];
    var sourceWidth = this.sourcesize[this.frame][0];
    var sourceHeight = this.sourcesize[this.frame][1];
    gContext.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, this.pos[0] + camerapos[0], this.pos[1] + camerapos[1], sourceWidth / 2, sourceHeight / 2);
    if (this.vel[0] > 0) {
        gContext.restore();
    }
    game.Thing.prototype.draw.call(this); // Draw bounding box.
};
game.Monster.prototype.update = function (dt, player) {
    if (this.isDead() && Date.now() > this.timeDied + 2000) {
        return false;
    }
    if (this.isDead()) {
        return true;
    }
    if (player != undefined) {
        var vect = calcNormalVector(player.pos, this.pos);
        var maxvar = null;
        switch (this.type) {
            case 0:
                // Fly.
                maxvar = 2500;
                break;
            case 1:
                // Blob.
                maxvar = 1600;
                break;
            case 2:
                // Snail.
                maxvar = 1000;
                break;
        }
        this.vel[0] = maxvar * dt * vect[0];
        this.vel[1] = maxvar * dt * vect[1];
    }
    game.Thing.prototype.update.call(this, dt);
    return true;
};
game.Monster.prototype.die = function () {
    //$("left_col").removeChild(this.div);
};
game.Monster.prototype.hit = function (vector) {
    this.lives--;
    if (this.isDead()) {
        this.timeDied = Date.now();
    }
    pushback = 5;
    this.pos[0] += (vector[0] * pushback);
    this.pos[1] += (vector[1] * pushback);
};
game.Monster.prototype.isDead = function () {
    return this.lives <= 0;
};
//}());
