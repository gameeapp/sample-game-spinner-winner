var GameeConnector = function (Game) {
    this.sound = false;
    this.controller = null;
    this.gameInstance = null;
    this.Game = Game;
    this._initGame();
};

GameeConnector.prototype = {
    _initGame: function () {
        var controllerType = 'FullScreen',
            controllerOpts = {},
            capabilities = ["saveState", "socialData"];

        // before your game calls gamee.gameInit, it must be able to accept mute and unmute command
        // but your game MUST NOT play any sound durring this phase
        gamee.emitter.addEventListener("mute", function (ev) {
            try {
                this.gameInstance.setSound(false);
            } catch (e) {
                // game instance doesnt exist yet
                this.sound = false;
            }
        }.bind(this));

        gamee.emitter.addEventListener("unmute", function (ev) {
            try {
                this.gameInstance.setSound(true);
            } catch (e) {
                // game instance doesnt exist yet
                this.sound = true;
            }
        }.bind(this));


        gamee.emitter.addEventListener("pause", function (ev) {
            try {
                this.gameInstance.pause();
            } catch (e) {
            }
        }.bind(this));

        gamee.emitter.addEventListener("resume", function (ev) {
            try {
                this.gameInstance.resume();
            } catch (e) {
            }
        }.bind(this));

        // calling init
        // in this phase, your game notifies platform what kind of controller it uses and what capabilities it has
        gamee.gameInit(controllerType, controllerOpts, capabilities, this._initGameCb.bind(this));
    },
    _initGameCb: function (error, data) {
        // callback for gameInit
        // response for gameInit contains requested controller instance, some other data based on capabilities and sound otpion
        this.controller = data.controller;
        this.sound = data.sound;
        this.data = data;

        this.saveState = {
        };
        if (data.saveState !== null) {
            try {
                var saveState = JSON.parse(data.saveState);
                if (saveState !== null)
                    this.saveState = saveState;
            } catch (err) {
            }
        }


        // now your game can setup assets and other stuff
        // durring this phase, gamee.loadingProgress(int) to notify platform about preparation progress
        // durring this phase, your game is allowed to play sound

        // once preparation is ready, continue


        this._gameReady();
    },
    _gameReady: function () {

        // before you continue, you must be able to accept gameStart command
        gamee.emitter.addEventListener("start", this.gameStart.bind(this));

        // calling gamee.gameReady
        // this method will notify platform, your game is ready to accept gameStart command
        // gamee.gameReady(this._gameReadyCb.bind(this));
        gamee.gameReady();
    },
    _gameReadyCb: function () {
        // there you won't get any data
    },
    gameStart: function (ev) {

        if (this.gameInstance !== null) {

            this.gameInstance.restart();
            //this.gameInstance.forceEnd();

        } else {
            this.gameInstance = new this.Game(this.sound, this.controller, this.saveState, this.data);
            
        }

        this.gameInstance.resume();


        // when you start new game instance, you will probably want to pass some parameters based on:
        // type of game should run (is it first game? did player died already?)
        // call signature might differ a lot,
        // this is just sample how it could look like:

        // this.gameInstance = new this.Game(this.sound, this.controller, this.saveState);
        // once game is ready, you must call callback
        // this is standart CustomEvent instance, callback is property of event.detail
        ev.detail.callback();
    }
};



export var createGameeConnector = function (Game) {
    
    window.testt = new GameeConnector(Game);
};