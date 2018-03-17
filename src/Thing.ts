import {drawBox} from './util'
import {getGlobals} from './globals'
import {config} from './config'
import { numberPair } from './types';

export default class Thing {
    pos: numberPair
    size: numberPair
    vel: numberPair
    footprint: numberPair
    angle: number

    constructor(pos?: numberPair, size?: numberPair, vel?: numberPair) {
        this.pos = pos;

        this.size = size;
        if (this.size != undefined) {
            this.footprint = [this.size[0], this.size[1]/3];
        }
    
        if (vel == undefined) {
            this.vel = [0, 0];
        } else {
            this.vel = vel;
        }
        this.angle = 0; //radians
    };

    update(dt: number, _?: any): boolean {
        if (this.vel == undefined) {
            return true;
        }
        if (this.vel[0] != 0 || this.vel[1] != 0) {
            var deltaX = this.vel[0] * dt;
            var deltaY = this.vel[1] * dt;
            this.pos[0] += deltaX;
            this.pos[1] += deltaY;
        }
        
        //lockToScreen(this, false);
        return true
    };
    draw(drawpos?: number[], imageName?: string) {
        const globals = getGlobals()
        const world = globals.world
        const context = globals.context

        if (config.debug) {
            // Draw bounding box.
            var pos = this.pos;
            /*if (this.getCollisionPos) {
                pos = this.getCollisionPos();
            }*/
            drawBox(context,
                    pos[0] + this.size[0] - this.footprint[0],
                    pos[1] + this.size[1] - this.footprint[1],
                    this.footprint[0], this.footprint[1], 'yellow', 0.6);
        }
    
        if (imageName) {
            var img = world.images.getImage(imageName);
            if (img) {
                context.drawImage(img, drawpos[0], drawpos[1]);
            }
        }
    };
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
    collideThing(other: Thing) {
        var thispos = this._getOwnPos();
        var otherpos = other._getOwnPos();
    
        if (thispos[0] + this.footprint[0] < otherpos[0]
            || thispos[0] > otherpos[0] + other.footprint[0]
            || thispos[1] > otherpos[1] + other.size[1]
            || thispos[1] + this.size[1] < otherpos[1] + other.size[1] - other.footprint[1]) {
            
            return false;
        } else {
            return true;
        }
    }
    getCenter() {
        var pos = this._getOwnPos();
        return [pos[0]+(this.footprint[0]/2), pos[1]+(this.footprint[1]/2)];
    }
    getCollisionPos() {
        return this.pos
    }
    _getOwnPos() {
        // will this call getCollisionPos() on a child class?
        var thispos = this.getCollisionPos()
        return thispos;
    }
    /*game.Thing.prototype.circleCollide = function(otherThing) {
        var p1 = [this.pos[0] + this.size/2, this.pos[1] + this.size/2];
        var p2 = [otherThing.pos[0] + otherThing.size/2, otherThing.pos[1] + otherThing.size/2];
        var dist = calcDistance(calcVector(p1, p2));
        return dist < this.size/2 + otherThing.size/2;
    };*/
    /*game.Thing.prototype.damage = function(n) {
        this.health -= n;
        if (this.health <= 0) {
            console.log('dead');
        }
    };*/
}

