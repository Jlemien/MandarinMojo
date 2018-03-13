import Thing from './Thing'

export function $(id: string): any { return document.getElementById(id); };
export function dc(tag: string): any { return document.createElement(tag); };

/*function createDiv(parent, imagesrc, width, height, id) {
    var screen = $(parent);

    const div = dc("div");
    if (id) {
        div.setAttribute("id", id);
    }
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.width = width;
    div.style.height = height;
    div.style.overflow = "hidden";
    
    div.style.backgroundImage = "url("+imagesrc+")";

    screen.appendChild(div);
    
    return div;
}*/
export function getParameterByName(name: string) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
export function updateObjects(arr: Thing[], dt: number, arg: any) {
    for (var i = arr.length - 1;i >= 0;i--) {
        if (arr[i].update(dt, arg) == false) {
            arr.splice(i, 1);
        }
    }
    //return arr;
}
export function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffleArray(array: any[]) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
export function drawRect(context: CanvasRenderingContext2D, x:number, y:number, width: number, height: number, color: string, opacity:number) {
    if (color && context.fillStyle != color) {
        context.fillStyle = color;
    }

    var changed = false;
    if (opacity && context.globalAlpha != opacity) {
        changed = true;
        context.save(); // This is kind of over-kill for just setting alpha...
        context.globalAlpha = opacity;
    }
    context.fillRect(x, y, width, height);
    if (changed) {
        context.restore();
    }
}
export function drawBox(context: CanvasRenderingContext2D, x:number, y:number, width: number, height:number, color: string, opacity:number) {
    if (context.lineWidth != 1) {
        context.lineWidth = 1;
    }
    if (context.strokeStyle != color) {
        context.strokeStyle = color;
    }

    var changed = false;
    if (opacity && context.globalAlpha != opacity) {
        changed = true;
        context.save();
        context.globalAlpha = opacity;
    }
    context.beginPath();
    context.rect(x, y, width, height);
    context.stroke();
    if (changed) {
        context.restore();
    }
}
function drawCircle(context: CanvasRenderingContext2D, x: number, y: number, radius: number, color: string, opacity: number) {
    if (color && context.strokeStyle != color) {
        context.strokeStyle = color;
    }

    var changed = false;
    if (opacity && context.globalAlpha != opacity) {
        changed = true;
        context.save();
        context.globalAlpha = opacity;
    }

    context.beginPath();
    context.arc(x,y,radius,0,2*Math.PI);
    context.stroke();

    if (changed) {
        context.restore();
    }
}
export function drawText(context: CanvasRenderingContext2D, text: string, font: string, style: string, x: number, y: number, opacity: number, align: string) {
    if (!align) {
        align = 'center';
    }
    if (align && context.textAlign != align) {
        context.textAlign = align;
    }
    if (context.textBaseline != "top") {
        context.textBaseline = "top";
    }
    if (context.font != font) {
        context.font = font;
    }
    if (context.fillStyle != style) {
        context.fillStyle = style;
    }

    var changed = false;
    if (opacity && context.globalAlpha != opacity) {
        changed = true;
        context.save();
        context.globalAlpha = opacity;
    }
    context.fillText(text, x, y);
    if (changed) {
        context.restore();
    }
}
function angleToVector(ang) {
    return [Math.cos(ang), Math.sin(ang)]
}
function calcDistance(vect) {
    return Math.sqrt(Math.pow(vect[0], 2) + Math.pow(vect[1], 2));
}
function calcVector(p1, p2) {
    return [p1[0] - p2[0], p1[1] - p2[1]];
}
function calcNormalVector(p1, p2) {
    var vect = calcVector(p1, p2);
    var h = calcDistance(vect);
    vect[0] = vect[0] / h;
    vect[1] = vect[1] / h;
    return vect;
}
function normalizeVector(v) {
    var vect = [0, 0];
    var h = calcDistance(v);
    vect[0] = v[0] / h;
    vect[1] = v[1] / h;
    return vect;
}
/*function getDrawPos(p) {
    return [p[0] - gCamera[0], p[1] - gCamera[1]];
}*/
function lockToScreen(thing: Thing) {
    _lockToScreen(thing, true);
    _lockToScreen(thing, false);
}
function _lockToScreen(thing: Thing, width) {
    var i = width?0:1;
    if (thing.pos[i] < 0) {
        thing.pos[i] = 0;
    } else if (thing.pos[i] + thing.size[i] > gCanvas.width) {
        thing.pos[i] = gCanvas.width - thing.size[i];
    }
}
