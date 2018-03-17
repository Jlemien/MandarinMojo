// the onscreen representation of the character

import Thing from '../Thing'
import {drawText, drawRect} from '../util'
import {config} from '../config'
import {getGlobals} from '../globals'

class Character extends Thing {
visible: boolean = false
    alignment: string
slotindex: number
iscorrect: boolean
character: string
pinyin: string
english: string

    constructor(pos: number[], alignment: string, slotindex: number, iscorrect: boolean, character: string, pinyin: string, english: string) {
    super(pos, [32,32], [0, 0])
    this.alignment = alignment
    this.slotindex = slotindex
    this.iscorrect = iscorrect
    this.character = character
    this.pinyin = pinyin
    this.english = english

    this._fixSize();
}

draw(camerapos: number[]) {
    const globals = getGlobals()
    const gContext = globals.context

    if (this.visible) {
        drawText(gContext,
                 this.character,
                 globals.world.textsize,
                 'yellow',
                 this.pos[0] + camerapos[0],
                 this.pos[1] + camerapos[1],
                 1.0,
                 this.alignment)
    }
    if (config.debug) {
        // Character position.
        drawRect(gContext,
                 this.getCollisionPos()[0] + camerapos[0],
                 this.getCollisionPos()[1] + camerapos[1],
                 2, 2)
        //game.Thing.prototype.draw.call(this); // Draw bounding box.
    }

}
_fixSize() {
    this.size = this.footprint = [this.character.length * 24, 28]
}
getCollisionPos() {
    if (this.alignment == 'right') {
        return [this.pos[0] - this.footprint[0], this.pos[1]]
    } else {
        return this.pos
    }
}

}