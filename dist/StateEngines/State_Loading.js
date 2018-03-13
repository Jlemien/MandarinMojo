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
var Thing = require('../Thing');
var State_Loading = /** @class */ (function (_super) {
    __extends(State_Loading, _super);
    function State_Loading() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.update = function (dt) {
        };
        return _this;
    }
    State_Loading.prototype.end = function () {
    };
    State_Loading.prototype.draw = function () {
        //drawInstructions(false);
        var total = gWorld.sounds.sounds.length + gWorld.images.images.length;
        var loaded = gWorld.sounds.numSoundsLoaded + gWorld.images.numImagesLoaded;
        if (loaded < total) {
            //gContext.clearRect(0, 0, gCanvas.width, gCanvas.height);
            var text = "Loading...    " + loaded + "/" + total;
            drawText(gContext, text, gWorld.textsize, gWorld.textcolor, gCanvas.width / 2, 400);
            //return;
        }
        else {
            gWorld.state.setState(gWorld.state.states.MAP);
        }
    };
    return State_Loading;
}(Thing));
exports.default = State_Loading;
