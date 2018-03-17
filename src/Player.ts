import {numberPair} from './types'
import Thing from './Thing'
import {getGlobals} from './globals'
import {drawRect} from './util'

export class Player extends Thing {
    drawhealth: boolean
    maxvel: number
    frame: number
    maxframe: number
    walking: boolean
    goingleft: boolean
    health: number
    maxhealth: number
    lasthittime: number | null
    standingsourcelocations: numberPair
    walkingsourcelocations: numberPair[]

    constructor(pos: numberPair, drawhealth: boolean) {
        super(pos, [32, 48]);
        this.drawhealth = drawhealth;
    
        this.maxvel = 200;
        this.frame = 0;
        this.maxframe = 10;
        this.walking = false;
        this.goingleft = false;
    
        this.health = 4;
        this.maxhealth = 4;
        this.lasthittime = null;
        
        // these came from images/player/p1_spritesheet.txt
        this.standingsourcelocations = [67, 196];
        this.walkingsourcelocations = [
            [0, 0],
            [73, 0],
            [146, 0],
            [0, 98],
            [73, 98],
            [146, 98],
            [219, 0],
            [292, 0],
            [219, 98],
            [365, 0],
            [292, 98],
        ];
    }

    draw(cameraposition: numberPair) {
        const globals = getGlobals()
        const world = globals.world
        const context = globals.context

        var img = world.images.getImage('hero');
        if (!img) {
            return;
        }
        if (!cameraposition) {
            cameraposition = [0, 0];
        }
    
        var sourceWidth = 72;
        var sourceHeight = 92;//97;
    
        var drawX = this.pos[0] - cameraposition[0];
        var drawY = this.pos[1] - cameraposition[1];
    
        if (this.walking) {
            if (world.loopCount % 2 == 0) {
                this.frame++;
            }
            if (this.frame > this.maxframe) {
                this.frame = 0;
            }
            var sourceX = this.walkingsourcelocations[this.frame][0];
            var sourceY = this.walkingsourcelocations[this.frame][1];
    
            if (this.goingleft) {
                context.save();
                var flipAxis = drawX + this.size[0]/2;
                context.translate(flipAxis, 0);
                context.scale(-1, 1);
                context.translate(-flipAxis, 0);
            }
    
            context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, drawX, drawY, this.size[0], this.size[1]);
    
            if (this.goingleft) {
                context.restore();
            }
        } else {
            var sourceX = this.standingsourcelocations[0];
            var sourceY = this.standingsourcelocations[1];
            context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, drawX, drawY, this.size[0], this.size[1]);
        }
        super.draw(); // Draw bounding box.
    
        if (this.drawhealth) {
            var width = (this.health/this.maxhealth) * this.size[0];
            var opacity = 0.0;
            if (this.lasthittime) {
                var timepassed = new Date().getTime() - this.lasthittime;
                if (timepassed < 5000) {
                    opacity = 1.0 - (timepassed/5000);
                }
            }
            if (opacity > 0) {
                drawRect(context, drawX, drawY + this.size[1], width, 4, 'green', opacity);
            }
        }
    }
    //setvisibility(visibility: boolean) {
        //this.div.style.visibility = visibility;
    //}
    hurt() {
        const globals = getGlobals()
        const world = globals.world

        this.health--;
        this.showHealth();
        world.sounds.play("fail");
    }
    healed() {
        this.health++;
        this.showHealth();
    }
    showHealth() {
        this.lasthittime = new Date().getTime();
    }
    resetHealth() {
        this.health = this.maxhealth;
    }
    
    update(dt: number, bounds: any) {
        const globals = getGlobals()
        const world = globals.world

        this.walking = false;
        this.goingleft = false;
        var lastpos = null;
        if (bounds) {
            lastpos = this.pos.slice(0);
        }
    
        //gWorld.keyState[87] ||
        if (world.keyState[38]) { //up
            //this.vel[1] = -this.maxvel;
            this.pos[1] = Math.round(this.pos[1] - this.maxvel * dt);
            this.walking = true;
        }
        //gWorld.keyState[83] || 
        if (world.keyState[40]) { //down
            //this.vel[1] = this.maxvel;
            this.pos[1] = Math.round(this.pos[1] + this.maxvel * dt);
            this.walking = true;
        }
        //gWorld.keyState[65] || 
        if (world.keyState[37]) { //left
            //this.vel[0] = -this.maxvel;
            this.pos[0] = Math.round(this.pos[0] - this.maxvel * dt);
            this.walking = true;
            this.goingleft = true;
        }
        //gWorld.keyState[68] || 
        if (world.keyState[39]) { //right
            //this.vel[0] = this.maxvel;
            this.pos[0] = Math.round(this.pos[0] + this.maxvel * dt);
            this.walking = true;
        }
        //if (gWorld.keyState[32]) { //spacebar - guns
        //    this.shoot();
        //}
    
        if (bounds) {
            if (this.pos[0] < bounds[0][0]) {
                this.pos[0] = lastpos[0];
            }
            if (this.pos[0] + this.size[0] > bounds[0][0] + bounds[1][0]) {
                this.pos[0] = bounds[0][0] + bounds[1][0] - this.size[0];
            }
            if (this.pos[1] < bounds[0][1]) {
                this.pos[1] = lastpos[1];
            }
            if (this.pos[1] + this.size[1] > bounds[0][1] + bounds[1][1]) {
                this.pos[1] = bounds[0][1] + bounds[1][1] - this.size[1];
            }
        }
        //super.update(this, dt);
        return true
    }
}
