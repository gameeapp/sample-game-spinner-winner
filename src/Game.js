import * as controlls from "./ui/controlls.js"
import { Chronos } from "./Chronos.js"
import { audio } from "./Audio.js"
import * as spinner from "./ui/2dCanvas.js"

var SPEED_MULT = 35 * 50;
var MAX_SPEED_MUlT = 2.5 * 0.01;
var INERTIA_MULT = 3;
var SPEED_DECOY = 65;
var LEVEL_SPINS_MULT = 25;
var UPGRADE_COST_MULT = 25;
export var SPIN_ATTEMPTS = 5;

export function Game(sound, controller, saveState, data) {
    console.log("game started");
    this._initSavedData(saveState);
    this._initUpgradeCosts();
    this._initUpgradeAvailability();
    this._initBuyUpgradeCallback();
    this.data = data;

    controlls.prepareScreen(this.getLevelMultiplier(), this.coins, this.level);
    this.setScore();
    controlls.spinsCounterUI.setSpinsCount(0, 0);
    controlls.hintHand.setSpinsRemain(SPIN_ATTEMPTS);

    this._registerSlideEvent();
    this._initSound(sound);
    this._start();


}

export var timeLoop = new Chronos();

Game.prototype = {
    _initSavedData: function (saveState) {
        this.speedUpgrades = saveState.speedUpgrades || 0;
        this.inertiaUpgrades = saveState.inertiaUpgrades || 0;
        this.timeRewardUpgrades = saveState.timeRewardUpgrades || 0;
        //this.useAvatar = saveState.useAvatar || 0;                    //future feature
        this.level = saveState.level || 0;
        this.coins = saveState.coins || 0;
        this.bestSpins = saveState.bestSpins || 0;
        this.highestScore = saveState.highestScore || 0;
        this.gameTries = 0;
    },
    _initUpgradeCosts: function () {
        controlls.upgradeUI.updateCost(
            this.getUpgradeCost("speedUpgrades"),
            this.getUpgradeCost("inertiaUpgrades"),
            this.getUpgradeCost("timeRewardUpgrades")
        );
        controlls.upgradeUI.updateLevel(this.speedUpgrades, this.inertiaUpgrades, this.timeRewardUpgrades);
    },
    _initUpgradeAvailability: function () {
        controlls.upgradeUI.updateAvailability(
            this.getUpgradeCost("speedUpgrades") > this.coins ? false : true,
            this.getUpgradeCost("inertiaUpgrades") > this.coins ? false : true,
            this.getUpgradeCost("timeRewardUpgrades") > this.coins ? false : true//this.useAvatar
        );
    },
    _initBuyUpgradeCallback: function () {
        var buyCallback = function (type, e) {

            var upgradeCost = this.getUpgradeCost(type);

            // check if you can upgrade
            if (upgradeCost > this.coins)
                return;

            this[type] += 1;

            this.addCoins(-upgradeCost);
            this._initUpgradeCosts();
            this._initUpgradeAvailability();

            this.saveState();
        };

        //future feature
        /*
        var updateAvatar = function(){
        
            this.useAvatar = !this.useAvatar;


            this._initUpgradeAvailability();

            this.saveState();
        };
        */

        controlls.upgradeUI.bindUpgradeCallbacks(
            buyCallback.bind(this, "speedUpgrades"),
            buyCallback.bind(this, "inertiaUpgrades"),
            buyCallback.bind(this, "timeRewardUpgrades")//updateAvatar.bind(this)
        );
    },
    _initSound: function (sounded) {
        audio.mute(!sounded);
    },
    getLevelMultiplier: function () {
        return Math.pow(2, this.level);
    },
    getUpgradeCost: function (type) {
        return Math.floor(UPGRADE_COST_MULT * Math.pow(1.4, this[type]));
    },
    _registerSlideEvent: function () {
        controlls.slideAreaUI.registerSlide((function (deltaTime, distance) {
            // TODO start lobby

            if (!this.lobby)
                this.createLobby();

            this.lobby.spinAttempt(deltaTime, distance);

            console.log("createlobby");
            controlls.hintHand.freezeHand();

        }).bind(this));
    },
    createLobby: function () {
        controlls.upgradeUI.upgradesEnabled(false);
        this.lobby = new Lobby(this.speedUpgrades, this.inertiaUpgrades, this.level, this.bestSpins, this.endLobby.bind(this));
        this.gameTries += 1;


    },
    forceEnd: function () {
        controlls.resetAll();
        this.gameTries = 0;
        this.setScore();
        this.resume();
    },
    saveState: function (share) {
        gamee.gameSave(JSON.stringify({
            speedUpgrades: this.speedUpgrades,
            inertiaUpgrades: this.inertiaUpgrades,
            timeRewardUpgrades: this.timeRewardUpgrades,
            //useAvatar: this.useAvatar,        //future feature
            level: this.level,
            coins: this.coins,
            bestSpins: this.bestSpins,
            highestScore: this.highestScore
        }), false);
    },
    pause: function () {
        audio.pause(true);
        timeLoop.setUpdating(false);
    },
    resume: function () {
        audio.pause(false);
        timeLoop.setUpdating(true);
    },
    setSound: function (sounded) {
        audio.mute(!sounded);
    },
    setScore: function () {
        // var score = Math.pow(this.highestScore, 0.7);
        // score = Math.floor(score);
        // score = parseInt(score);
        // gamee.updateScore(score);

        gamee.updateScore(this.bestSpins);
    },
    restart: function () {

        if (this.lobby) {

            this.lobby.restart();
            this.endLobby(0, 0, 0);
        }

        controlls.resetAll();


        this.setScore();


    },
    endLobby: function (coins, bestSpins, levelup) {
        this.lobby = null;
        this.addCoins(coins);

        this.highestScore += coins;


        // level up ?
        if (levelup) {
            this.level += 1;
            controlls.spinsCounterUI.setLevelMultiplier(this.getLevelMultiplier());
        }
        controlls.setLevelBackground(this.level);

        // save new best score
        var share = false;
        if (bestSpins > this.bestSpins) {
            share = true;
            this.bestSpins = bestSpins;

            this.setScore();
        }


        // update game save 
        this.saveState(share);

        // upgrades availability
        this._initUpgradeAvailability();

        // set UI
        controlls.spinsCounterUI.setSpinsCount(0, 0);
        controlls.hintHand.setSpinsRemain(SPIN_ATTEMPTS);
        controlls.hintHand.newBestVisible(false);
        controlls.upgradeUI.upgradesEnabled(true);

        //console.log("lobby ends");
    },
    addCoins: function (value) {
        this.coins += value;
        controlls.coinsUI.setCoins(this.coins);
    },
    _start: function (opt_FPS) {
        var lastTime = performance.now();

        var step = function () {
            var time = performance.now();
            var deltaTime = time - lastTime;
            lastTime = time;
            timeLoop.update(deltaTime);
            window.requestAnimationFrame(step);
        };

        window.requestAnimationFrame(step);
    }
};

function Lobby(speedUpgrades, inertiaUpgrades, level, bestSpins, endCb) {
    this.speedGain = (speedUpgrades + 6) * SPEED_MULT; // speed gain for perfect spin
    this.inertia = (inertiaUpgrades + 1) * INERTIA_MULT; // inertia of the spinner
    this.nextLevel = Math.pow(2, level) * LEVEL_SPINS_MULT; // how much do you need to reach next level
    this.level = level;
    this.spinAttempts = SPIN_ATTEMPTS;
    this.bestSpins = bestSpins;

    this.speed = 0;
    this.spins = 0;

    this.progressed = false; // indicates reaching new level
    this.endCb = endCb;

    this._registerStopSpinning();
    this._registerUpdate();
    this._startSound();
}

Lobby.prototype = {
    _startSound: function () {
        audio.start();
    },
    _registerUpdate: function () {
        timeLoop.registerListener(this);
    },
    _registerStopSpinning: function () {
        controlls.hintHand.bindStopButtonAction(() => { this.speed = 0 });
    },
    spinAttempt: function (deltaTime, distance) {

        var currentSpeedGain = (distance / deltaTime) * this.speedGain;


        if (this.spinAttempts < 1)
            return;

        this.spinAttempts--;
        controlls.hintHand.setSpinsRemain(this.spinAttempts);

        this.speed += currentSpeedGain;
        this.speed = Math.max(0, this.speed);
        this.speed = Math.min(this.speed, this.speedGain * MAX_SPEED_MUlT);
    },
    restart: function () {

        this.stop();

        this.speed = 0;
        this.spins = 0;
        this._updateUI();

    },


    stop: function () {

        audio.stop();

        timeLoop.removeListener(this);


    },
    end: function () {

        this.stop();

        this.spins = Math.floor(this.spins);
        this.bestSpins = Math.max(this.bestSpins, this.spins);

        var levelMult = Math.pow(2, this.level), levelup = false, coins = this.spins * levelMult;

        if (this.spins >= this.nextLevel) {
            levelup = true;
        }

        controlls.endScreen.runEndScreen(this.spins, this.bestSpins, levelMult, coins, () => { this.endCb(coins, this.bestSpins, levelup) });
    },
    update: function (delta) {
        delta = delta * 0.001;

        // recalculate speed
        this._updateSpeed(delta);

        // calculate spins
        this._updateSpins(delta);

        // 
        this._updateSound();

        // show end button ? 
        this._updateUI();

        // resolve game end
        this._resolveGameEnd();

    },
    _updateSpeed: function (delta) {
        this.speed -= (delta * SPEED_DECOY)//  + this.speed * (5 - Math.log(10 + this.inertia)) * delta * 0.03;
        if (Math.abs(this.speed) < 5 || this.speed < 0) {
            this.speed = 0;
        }
    },
    _updateSpins: function (delta) {
        this.spins += (delta * Math.abs(this.speed)) / 60;
    },
    _updateUI: function () {
        controlls.speedMeterUI.setSpeed(this.speed);

        var progress = this.spins > 0 ? this.spins / this.nextLevel * 100 : 0;
        controlls.spinsCounterUI.setSpinsCount(this.spins, progress);

        // set level up
        if (progress > 100 && !this.progressed) {
            this.progressed = true;
            controlls.spinsCounterUI.setLevelMultiplier(Math.pow(2, this.level + 1));
            controlls.spinsCounterUI.levelUp();
            this.level += 1;
        }

        if (this.bestSpins < this.spins) {
            controlls.hintHand.newBestVisible(true);
        }

        var deg = -(this.spins - Math.floor(this.spins)) * 360 * Math.sign(this.speed);
        spinner.render(deg, this.speed);
    },
    _resolveGameEnd: function () {
        if (this.speed === 0) {
            this.end();
        }
    },
    _updateSound: function () {
        audio.setRate(this.speed);
    }
};