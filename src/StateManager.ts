const StateArena = require('./StateEngines/State_Arena');
const StateArenaEnd = require('./StateEngines/State_ArenaEnd.js');
const StateArenaIntro = require('./StateEngines/State_ArenaIntro');
const StateArenaPassed = require('./StateEngines/State_ArenaPassed');
const StateLoading = require('./StateEngines/State_Loading');
const StateMap = require('./StateEngines/State_Map');
const StateOverlay = require('./StateEngines/State_Overlay');
const StatePaused = require('./StateEngines/State_Paused');

class StateManager {
    constructor() {
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
    };

    setState(s) {
        if (this._enginestack.length > 0) {
            this._enginestack[this._enginestack.length - 1].end();
        }
    
        // Start new stacks.
        this._statestack = [s];
        this._enginestack = [this._getStateEngineForState()];
    
        return this.getStateEngine(); // Return the state engine so caller can set properties on it.
    };
    _getStateEngineForState() {
        var engine = null;
    
        var state = this.getState();
        switch(state) {
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
                console.log('unknown state:'+s);
        }
        return engine;
    };
    getState() {
        return this._statestack[this._statestack.length - 1];
    };
    getStateEngine() {
        var i = this._enginestack.length - 1;
        return this._enginestack[i];
    };
    pushState(s) {
        this._statestack.push(s);
        this._enginestack.push(this._getStateEngineForState());
    
        return this.getStateEngine(); // Return the state engine so caller can set properties on it.
    };
    popState() {
        this.getStateEngine().end();
        this._statestack.pop();
        this._enginestack.pop();
    };
}

//}());
