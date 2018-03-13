"use strict";
//(function() {
Object.defineProperty(exports, "__esModule", { value: true });
//window.game = window.game || { };
var Thing = /** @class */ (function () {
    function Thing(pos, size, vel) {
        this.pos = pos;
        this.size = size;
        if (this.size != undefined) {
            this.footprint = [this.size[0], this.size[1] / 3];
        }
        if (vel == undefined) {
            this.vel = [0, 0];
        }
        else {
            this.vel = vel;
        }
        this.angle = 0; //radians
    }
    ;
    Thing.prototype.update = function (dt) {
        if (this.vel == undefined) {
            return;
        }
        if (this.vel[0] != 0 || this.vel[1] != 0) {
            var deltaX = this.vel[0] * dt;
            var deltaY = this.vel[1] * dt;
            this.pos[0] += deltaX;
            this.pos[1] += deltaY;
        }
        //lockToScreen(this, false);
    };
    ;
    Thing.prototype.draw = function (drawpos, imageName) {
        if (gWorld.debug) {
            // Draw bounding box.
            var pos = this.pos;
            if (this.getCollisionPos) {
                pos = this.getCollisionPos();
            }
            drawBox(gContext, pos[0] + this.size[0] - this.footprint[0], pos[1] + this.size[1] - this.footprint[1], this.footprint[0], this.footprint[1], 'yellow', 0.6);
        }
        if (imageName) {
            var img = gWorld.images.getImage(imageName);
            if (img) {
                gContext.drawImage(img, drawpos[0], drawpos[1]);
            }
        }
    };
    ;
    /*game.Thing.prototype.getCenter = function() {
        return [this.pos[0]+(this.size/2), this.pos[1]+(this.size/2)];
    };*/
    /*game.Thing.prototype.containsPoint = function(p) {
        var v = calcVector(p, this.getCenter());
        var dist = calcDistance(v);
        if (dist <= this.size/2) {
            return true;
        } else {
            return false;
        }
    };*/
    Thing.prototype.collideThing = function (other) {
        var thispos = this._getOwnPos();
        var otherpos = other._getOwnPos();
        if (thispos[0] + this.footprint[0] < otherpos[0]
            || thispos[0] > otherpos[0] + other.footprint[0]
            || thispos[1] > otherpos[1] + other.size[1]
            || thispos[1] + this.size[1] < otherpos[1] + other.size[1] - other.footprint[1]) {
            return false;
        }
        else {
            return true;
        }
    };
    Thing.prototype.getCenter = function () {
        var pos = this._getOwnPos();
        return [pos[0] + (this.footprint[0] / 2), pos[1] + (this.footprint[1] / 2)];
    };
    Thing.prototype._getOwnPos = function () {
        var thispos = this.pos;
        if (this.getCollisionPos) {
            thispos = this.getCollisionPos();
        }
        return thispos;
    };
    return Thing;
}());
exports.default = Thing;
//}());
