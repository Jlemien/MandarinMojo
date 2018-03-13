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
//(function() {
var Thing = require('../Thing');
window.game = window.game || {};
var State_Arena = /** @class */ (function (_super) {
    __extends(State_Arena, _super);
    function State_Arena() {
        var _this = this;
        _this._level = -1; // set by setLevel().
        _this.wordindex = -1;
        _this.wordcount = -1;
        _this._monstertype = null;
        _this._monsterswitch = 0;
        _this._problems = null;
        _this._currentproblem = null;
        _this._lastCorrect = false;
        _this._currentcharacters = null;
        _this._score = 0;
        _this._characterpositions = Array([20, 40], //tl
        [20, 410], //bl
        [492, 40], //tr
        [492, 410]); //br
        _this._characteralignments = Array('left', 'left', 'right', 'right');
        _this._enemies = Array();
        _this._projectiles = Array();
        _this._powerups = Array();
        _this._decorations = Array();
        _this._shaketime = 0;
        _this._shakeoffset = [0, 0];
        _this._shakemax = 5;
        _this._shakeduration = 500; //ms
        _this.player = new game.Player([64, 85], true);
        return _this;
    }
    State_Arena.prototype.end = function () {
    };
    State_Arena.prototype.draw = function () {
        var now = Date.now();
        if (this._shaketime > now) {
            var max = ((this._shaketime - now) / this._shakeduration) * this._shakemax;
            this._shakeoffset[0] = getRandomInt(-max, max);
            this._shakeoffset[1] = getRandomInt(-max, max);
        }
        else {
            this._shakeoffset[0] = 0;
            this._shakeoffset[1] = 0;
        }
        var cameraPos = [0 + this._shakeoffset[0], 0 + this._shakeoffset[1]];
        var img = gWorld.images.getImage('background');
        if (img) {
            gContext.drawImage(img, 0 + this._shakeoffset[0], 0 + this._shakeoffset[1]);
        }
        for (var i in this._currentcharacters) {
            char = this._currentcharacters[i];
            char.draw(cameraPos);
        }
        if (gWorld.message) {
            gWorld.message.draw(cameraPos);
        }
        for (var i in this._projectiles) {
            this._projectiles[i].draw(cameraPos);
        }
        for (var i in this._powerups) {
            this._powerups[i].draw(cameraPos);
        }
        for (var i in this._enemies) {
            this._enemies[i].draw(cameraPos);
        }
        this.player.draw(cameraPos);
        for (var i in this._decorations) {
            this._decorations[i].draw(cameraPos);
        }
        var s = null;
        if (this._level > 0) {
            s = "HSK " + this._level;
        }
        else {
            s = "Review";
        }
        drawText(gContext, s, gWorld.textsize, gWorld.textcolor, 40, 0);
        s = this._score + "/" + this.wordcount;
        var x = gCanvas.width - (13 * s.length);
        drawText(gContext, s, gWorld.textsize, gWorld.textcolor, x, 0, 1.0, 'left');
    };
    ;
    State_Arena.prototype.update = function (dt) {
        updateObjects(this._enemies, dt, this.player);
        updateObjects(this._projectiles, dt);
        updateObjects(this._powerups, dt);
        updateObjects(this._decorations, dt);
        var bounds = [[0, 0], [gWorld.arenaWidth, gWorld.arenaHeight]];
        this.player.update(dt, bounds);
        this.checkCollisions();
        this.spawnMonsters();
    };
    ;
    State_Arena.prototype.onKeyDown = function (event) {
        // "e" to exit
        if (event.keyCode == 69) {
            this.player.health = 0;
            this.characterwrong();
        }
    };
    State_Arena.prototype.setLevel = function (level) {
        this._level = level;
        if (level > 0) {
            this._problems = gWorld.problems[this._level - 1].slice(0); //copy the array
            this._problems = shuffleArray(this._problems);
        }
        else {
            // Done in nextCharacter()
            // Use player list.
            this._problems = gWorld.playerinfo.problems.slice(0); //copy the array
            this.wordcount = this.getProblemsToGoCount();
        }
        this.nextCharacter();
    };
    ;
    State_Arena.prototype.checkCollisions = function () {
        var enemy;
        var projectile;
        for (var j = this._enemies.length - 1; j >= 0; j--) {
            enemy = this._enemies[j];
            if (enemy.collideThing(this.player)) {
                if (enemy.isDead()) {
                    continue;
                }
                enemy.die();
                this._enemies.splice(j, 1);
                this._decorations.push(new game.Explosion(enemy.pos));
                this.characterwrong();
                return;
            }
            for (var p in this._projectiles) {
                projectile = this._projectiles[p];
                if (enemy.collideThing(projectile)) {
                    enemy.hit(normalizeVector(projectile.vel));
                    this._projectiles.splice(p, 1);
                    this._decorations.push(new game.Explosion(enemy.pos));
                    this.spawnMonsters();
                    if (gWorld.debug) {
                        console.log('enemy hit');
                    }
                    this.shake();
                    break;
                }
            }
        }
        var char;
        for (var i in this._currentcharacters) {
            char = this._currentcharacters[i];
            if (!char.visible) {
                continue;
            }
            if (char.collideThing(this.player)) {
                this.explodestuff();
                this.clearDivs();
                if (char.iscorrect) {
                    this.shootProjectile();
                    this.charactercorrect(char.getCenter());
                }
                else {
                    this.characterwrong();
                }
                break;
            }
        }
        var powerup;
        for (var p in this._powerups) {
            powerup = this._powerups[p];
            if (powerup.collideThing(this.player)) {
                this.decorationHealth();
                this._powerups.splice(p, 1);
                this.player.healed();
                if (gWorld.debug) {
                    console.log('got power up');
                }
                break;
            }
        }
    };
    ;
    State_Arena.prototype.gotoend = function () {
        this.explodestuff();
        this.clearDivs();
        var stateengine = gWorld.state.setState(gWorld.state.states.ARENAEND);
        stateengine.decorations = this._decorations;
        stateengine.level = this._level;
        stateengine.wordcount = this.wordcount;
        stateengine.got = this._score;
    };
    ;
    State_Arena.prototype.explodestuff = function () {
        //explode monsters
        for (var j in this._enemies) {
            //this._decorations.push(new game.Explosion(this._enemies[j].pos));
        }
        //explode the characters
        for (var j in this._currentcharacters) {
            if (!this._currentcharacters[j].iscorrect) {
                this._decorations.push(new game.Explosion(this._currentcharacters[j].getCollisionPos()));
            }
        }
    };
    ;
    State_Arena.prototype.clearDivs = function () {
        for (var i in gDivs) {
            if (gDivs[i]) {
                gDivs[i].innerHTML = "";
            }
        }
    };
    ;
    State_Arena.prototype.shake = function () {
        this._shaketime = Date.now() + this._shakeduration;
    };
    ;
    State_Arena.prototype.shootProjectile = function () {
        if (this._enemies.length <= 0) {
            return;
        }
        // Find the closest enemy.
        var enemy = null;
        var leastdistance = null;
        var distance = null;
        for (var i in this._enemies) {
            distance = Math.abs(calcDistance(calcVector(this.player.pos, this._enemies[i].pos)));
            if (enemy == null || distance < leastdistance) {
                enemy = this._enemies[i];
                leastdistance = distance;
                continue;
            }
        }
        target = [enemy.pos[0] + enemy.size[0] / 2, enemy.pos[1] + enemy.size[1] / 2];
        var playerX = this.player.pos[0] + this.player.size[0] / 2;
        var playerY = this.player.pos[1] + this.player.size[1] / 2;
        var vector = calcNormalVector(target, [playerX, playerY]);
        var pos = [this.player.pos[0], this.player.pos[1]];
        var projectile = new game.Projectile(pos, [vector[0] * 200, vector[1] * 200]);
        this._projectiles.push(projectile);
    };
    ;
    State_Arena.prototype.spawnPowerup = function () {
        if (this._level == 0) {
            // No health in the review arena.
            return;
        }
        if (Math.random() < 0.1) {
            var pos = [getRandomInt(20, gCanvas.width - 20), getRandomInt(20, gCanvas.height - 20)];
            var p = new game.Powerup(pos);
            this._powerups.push(p);
        }
    };
    State_Arena.prototype.charactercorrect = function (pos) {
        this._score++;
        if (this._score > gWorld.playerinfo.highscores[this._level - 1]) {
            gWorld.playerinfo.highscores[this._level - 1] = this._score;
        }
        gWorld.playerinfo.problemCorrect(this._currentproblem);
        var n = null;
        if (this._score == 5) {
            n = 5;
        }
        else if (this._score == 10) {
            n = 10;
        }
        else if (this._score == 20) {
            n = 20;
        }
        else if (this._score == 50) {
            n = 50;
        }
        else if (this._score % 100 == 0) {
            n = this._score;
        }
        if (n) {
            gWorld.message = new game.Message(n + ' in a row');
        }
        this._lastcorrect = true;
        this.updateTable();
        //if (!gAudio) {
        //gWorld.sounds.play("success");
        //}
        this.decorationCorrect(pos);
        this.nextCharacter();
    };
    ;
    State_Arena.prototype.characterwrong = function () {
        this._lastcorrect = false;
        gWorld.playerinfo.problemWrong(this._currentproblem);
        this._decorations.push(new game.Explosion(this.player.pos));
        this.updateTable();
        // No health in the review arena.
        if (this._level > 0) {
            this.player.hurt();
        }
        if (this.player.health <= 0) {
            this.gotoend();
        }
        else {
            this.nextCharacter();
        }
    };
    ;
    State_Arena.prototype.updateTable = function () {
        if (this._currentproblem) {
            var tableRef = gTable.getElementsByTagName('tbody')[0];
            //var newRow = tableRef.insertRow(tableRef.rows.length);
            var newRow = tableRef.insertRow(0);
            if (!this._lastcorrect) {
                newRow.className = "wrong";
            }
            else {
                newRow.className = "correct";
            }
            var cell1 = newRow.insertCell(0);
            var cell2 = newRow.insertCell(1);
            var cell3 = newRow.insertCell(2);
            cell3.className = 'previouscharacter';
            var correctword = null;
            for (var i in this._currentcharacters) {
                if (this._currentcharacters[i].iscorrect) {
                    correctword = this._currentcharacters[i];
                    break;
                }
            }
            if (correctword != null) {
                var text = document.createTextNode(correctword.english);
                cell1.appendChild(text);
                var text = document.createTextNode(correctword.pinyin);
                cell2.appendChild(text);
                var text = document.createTextNode(correctword.character);
                cell3.appendChild(text);
            }
            else {
                console.log('null correctword detected');
            }
        }
    };
    ;
    State_Arena.prototype.spawnMonsters = function () {
        if (this._level == 0) {
            // No monsters in the review arena.
            return;
        }
        var totalcount = this.wordcount;
        var percentsolved = this._score / totalcount;
        var n = Math.ceil(percentsolved * 10);
        var door, pos, m;
        if (gWorld.debug) {
            //console.log("There are "+this._enemies.length+" monsters, there should be "+n);
        }
        while (this._enemies.length < n) {
            door = Math.floor(Math.random() * 4) + 1;
            if (door == 1) {
                pos = [0, gCanvas.height / 2];
            }
            else if (door == 2) {
                pos = [gCanvas.width / 2, 0];
            }
            else if (door == 3) {
                pos = [gCanvas.width, gCanvas.height / 2];
            }
            else if (door == 4) {
                pos = [gCanvas.width / 2, gCanvas.height];
            }
            this._monsterswitch--;
            if (this._monsterswitch <= 0) {
                if (gWorld.debug) {
                    console.log("changing monster type");
                }
                var newType = this._monstertype;
                while (newType == this._monstertype) {
                    newType = getRandomInt(0, 2);
                }
                this._monstertype = newType;
                this._monsterswitch = 10;
            }
            m = new game.Monster(pos, this._monstertype);
            this._enemies.push(m);
            if (gWorld.debug) {
                console.log("spawning a new monster");
            }
        }
    };
    ;
    State_Arena.prototype.getProblemsToGoCount = function () {
        if (this._level > 0) {
            return this._problems.length;
        }
        return gWorld.playerinfo.getProblemsToGoCount();
    };
    State_Arena.prototype.nextCharacter = function () {
        this._currentcharacters = Array();
        this._currentproblem = null;
        if (this._level == 0) {
            this._problems = gWorld.playerinfo.problems.slice(0); //re-copy the array
        }
        var togo = this.getProblemsToGoCount();
        if (gWorld.debug) {
            console.log('nextCharacter() ' + togo + " characters to go");
        }
        if (togo < 1) {
            var stateengine = gWorld.state.setState(gWorld.state.states.ARENAPASSED);
            stateengine.decorations = this._decorations;
            stateengine.level = this._level;
            return;
        }
        this._currentproblem = this._problems.pop();
        /*if (gWorld.debug) {
            console.log('FAVORING LONG WORDS');
            while (!this._currentproblem) {
                this._currentproblem = this._problems.pop();
                if (this._currentproblem.words[0].character.length <3) {
                    this._currentproblem = null;
                }
            }
        }*/
        if (this.player.health < this.player.maxhealth) {
            this.spawnPowerup();
        }
        if (gWorld.debug) {
            console.log("Retrieving next problem. " + this._problems.length + " problems remain after this one.");
        }
        if (gWorld.debug) {
            // http://en.wikipedia.org/wiki/Standard_Chinese_phonology#Tones
            // two 3rds 水果  33 becomes 23
            // a fifth 爸爸
            // 不 is 4th except when followed by another 4th when it changes to 2nd.
            /*var forcecharacter = '医院';
            console.log('FORCING '+forcecharacter);
            while (true) {
                if ((this._currentproblem.words[0].character == forcecharacter && this._currentproblem.words[0].correct)
                   || (this._currentproblem.words[1].character == forcecharacter && this._currentproblem.words[1].correct)
                   || (this._currentproblem.words[2].character == forcecharacter && this._currentproblem.words[2].correct)
                   || (this._currentproblem.words[3].character == forcecharacter && this._currentproblem.words[3].correct)) {
    
                    break;
                }
                this._currentproblem = this._problems.pop();
            }*/
        }
        for (var i = 0; i < this._currentproblem.words.length; i++) {
            if (this._currentproblem.words[i].correct) {
                if (gWorld.debug) {
                    console.log("next problem is " + this._currentproblem.words[i].english);
                }
                if (gQuestion) {
                    gQuestion.innerHTML = this._currentproblem.words[i].english;
                }
                if (gPinyin) {
                    gPinyin.innerHTML = this._currentproblem.words[i].pinyin;
                }
                if (gAudio) {
                    this.playAudio();
                }
            }
            //
        }
        this.spawnMonsters();
        var that = this;
        window.setTimeout(function () { that.showCharacters(); }, 2000);
        for (var i = 0; i < this._currentproblem.words.length; i++) {
            this._currentcharacters[i] = new game.Character(this._characterpositions[i], this._characteralignments[i], i, this._currentproblem.words[i].correct, this._currentproblem.words[i].character, this._currentproblem.words[i].pinyin, this._currentproblem.words[i].english);
        }
    };
    ;
    State_Arena.prototype.showCharacters = function () {
        if (gWorld.state.getState() == gWorld.state.states.ARENAEND) {
            return; // Player has died.
        }
        for (var i in this._currentcharacters) {
            char = this._currentcharacters[i];
            char.visible = true;
        }
    };
    ;
    State_Arena.prototype.decorationCorrect = function (pos) {
        this._decorations.push(new game.Aura_Round(pos, 'white', 3, 0.4));
    };
    ;
    State_Arena.prototype.decorationHealth = function () {
        this._decorations.push(new game.Aura(this.player, 'white', 3, 0.1));
    };
    ;
    State_Arena.prototype.playAudio = function () {
        var correct = this._currentproblem.getCorrectWord();
        if (gWorld.localTTS) {
            var s = correct.getToRead(true);
            gWorld.tts.setInput(s);
            if (gWorld.debug) {
                console.log("setting tts input to " + s);
            }
            gAudio.innerHTML = gWorld.tts.getHtml();
            window.setTimeout(gWorld.tts.speak, 1000);
        }
        else {
            var that = this;
            setTimeout(function () {
                that.playGoogleAudio();
            }, 1000);
        }
    };
    ;
    State_Arena.prototype.playGoogleAudio = function () {
        var text = this._currentproblem.getCorrectWord().character;
        var iframe = $('speechiframe');
        iframe.src = 'http://translate.google.com/translate_tts?ie=utf-8&tl=zh-CN&q=' + text;
        /*
        var src = 'http://translate.google.com/translate_tts?ie=utf-8&tl=zh-CN&q='+text;
        var script = '<script type="text/javascript">var a = document.getElementById("theaudio");a.addEventListener("error", function(e) {parent.gWorld.toggleSpeaker();}, true);</script>';
        var html = '<html><body><audio error="alert(7)" onstalled="alert(3)" autoplay name="media" id="theaudio"><source src="'+src+'" type="audio/mpeg"></audio>'+script+'</body></html>';
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(html);
        iframe.contentWindow.document.close();*/
    };
    return State_Arena;
}(Thing));
//}());
