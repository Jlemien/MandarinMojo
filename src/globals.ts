import {Globals, World} from './types'

let g: Globals | null = null
export function createGlobals(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, world: World) {
    g = {
        canvas,
        context,
        world
    }
}
export function getGlobals() {
    return g
}