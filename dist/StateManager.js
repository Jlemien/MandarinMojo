var StateArena = require('./StateEngines/State_Arena');
var StateArenaEnd = require('./StateEngines/State_ArenaEnd.js');
var StateArenaIntro = require('./StateEngines/State_ArenaIntro');
var StateArenaPassed = require('./StateEngines/State_ArenaPassed');
var StateLoading = require('./StateEngines/State_Loading');
var StateMap = require('./StateEngines/State_Map');
var StateOverlay = require('./StateEngines/State_Overlay');
var StatePaused = require('./StateEngines/State_Paused');
var StateManager = /** @class */ (function () {
    function StateManager() {
        this.states = {
            LOADING: 0,
            ARENAINTRO: 1,
            ARENA: 2,
            ARENAEND: 3,
            ARENAPASSED: 4,
            PAUSED: 5,
            MAP: 6,
            OVERLAY: 7,
        };
        this._statestack = [];
        this._enginestack = [];
        this.setState(this.states.LOADING);
    }
    ;
    StateManager.prototype.setState = function (s) {
        if (this._enginestack.length > 0) {
            this._enginestack[this._enginestack.length - 1].end();
        }
        // Start new stacks.
        this._statestack = [s];
        this._enginestack = [this._getStateEngineForState()];
        return this.getStateEngine(); // Return the state engine so caller can set properties on it.
    };
    ;
    StateManager.prototype._getStateEngineForState = function () {
        var engine = null;
        var state = this.getState();
        switch (state) {
            case this.states.LOADING:
                engine = new game.State_Loading();
                break;
            case this.states.ARENAINTRO:
                engine = new game.State_ArenaIntro();
                break;
            case this.states.ARENA:
                engine = new game.State_Arena();
                break;
            case this.states.ARENAEND:
                engine = new game.State_ArenaEnd();
                break;
            case this.states.ARENAPASSED:
                engine = new game.State_ArenaPassed();
                break;
            case this.states.PAUSED:
                engine = new game.State_Paused();
                break;
            case this.states.MAP:
                engine = new game.State_Map();
                break;
            case this.states.OVERLAY:
                engine = new game.State_Overlay();
                break;
            default:
                console.log('unknown state:' + s);
        }
        return engine;
    };
    ;
    StateManager.prototype.getState = function () {
        return this._statestack[this._statestack.length - 1];
    };
    ;
    StateManager.prototype.getStateEngine = function () {
        var i = this._enginestack.length - 1;
        return this._enginestack[i];
    };
    ;
    StateManager.prototype.pushState = function (s) {
        this._statestack.push(s);
        this._enginestack.push(this._getStateEngineForState());
        return this.getStateEngine(); // Return the state engine so caller can set properties on it.
    };
    ;
    StateManager.prototype.popState = function () {
        this.getStateEngine().end();
        this._statestack.pop();
        this._enginestack.pop();
    };
    ;
    return StateManager;
}());
//}());
