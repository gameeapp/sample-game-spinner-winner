import { SPIN_ATTEMPTS } from "./../Game.js"

var GLOBAL_WRAPPER_ID = "game-wrapper";
var OVERLAY_ID = "game-overlay";
var OVERLAY_WRAPPER_ID = "overlay-wrapper";
var GLOBAL_WRAPPER_SIZE_Y = 1136;
var GLOBAL_WRAPPER_SIZE_X = 640;

var globalWrapperEl = document.getElementById(GLOBAL_WRAPPER_ID);
var overlayWrapperEl = document.getElementById(OVERLAY_WRAPPER_ID);
var overlayEl = document.getElementById(OVERLAY_ID);

export var resetAll = function () {
    overlayWrapperEl.style.display = "none";
    overlayEl.style.display = "none";
    //wrapperEl.style.display = "none";
}

// transform based on device given size
export var prepareScreen = function (currentLevelMult, currentCoins, currentLevel) {

    // current coins
    coinsUI.setCoins(currentCoins);
    spinsCounterUI.setLevelMultiplier(currentLevelMult);

    // current level


    // window size
    var scale = window.innerHeight / GLOBAL_WRAPPER_SIZE_Y;
    var shiftX = (window.innerWidth - scale * GLOBAL_WRAPPER_SIZE_X) * 0.5

    var transformWrappers = [overlayWrapperEl, globalWrapperEl];

    for (var i = 0; i < transformWrappers.length; i++) {
        transformWrappers[i].style.WebkitTransform = `scale(${scale})`;
        transformWrappers[i].style.msTransform = `scale(${scale})`;
        transformWrappers[i].style.transform = `scale(${scale})`;
        transformWrappers[i].style.transformOrigin = `left top`;
        transformWrappers[i].style.marginLeft = `${shiftX}px`;
    }

    setLevelBackground(currentLevel);

    globalWrapperEl.style.display = "block";
};

export var setLevelBackground = function (level) {
    var result = 0;
    result = Math.floor(Math.abs(level * 0.5)) % 5;
    document.body.style.backgroundImage = "url(assets/ui/bg_pattern_" + result + ".png)";
};

export var endScreen = (function () {
    var collectCb = null;

    var wrapperEl = document.createElement("div");
    wrapperEl.className = "end-screen ui-text";

    // top screen content

    var spinsMajorEl = document.createElement("span");
    spinsMajorEl.className = "font-180 font-white line-160";

    var spinsBestEl = document.createElement("span");

    var topScreenEl = document.createElement("p");
    topScreenEl.className = "font-white";
    topScreenEl.innerText = "SPINS:"
    topScreenEl.appendChild(document.createElement("br"));
    topScreenEl.appendChild(spinsMajorEl);
    topScreenEl.appendChild(document.createElement("br"));
    var spanHelperEl = document.createElement("span");
    spanHelperEl.className = "font-purple";
    spanHelperEl.appendChild(document.createTextNode("BEST: "));
    spanHelperEl.appendChild(spinsBestEl);
    topScreenEl.appendChild(spanHelperEl);
    wrapperEl.appendChild(topScreenEl);

    var hrEl = document.createElement("div");
    hrEl.className = "hr-yellow"
    wrapperEl.appendChild(hrEl);

    // bottom screen content
    var spinsMinorEl = document.createElement("span");
    spinsMinorEl.className = "font-30 font-white spins-minor";

    var levelMultiplierEl = document.createElement("span");
    levelMultiplierEl.className = "font-white level-multiplier";

    var coinstToCollectEl = document.createElement("span");
    coinstToCollectEl.className = "font-70 coin-text";

    var collectButtonEl = document.createElement("button");
    collectButtonEl.className = "button-ok";

    var shareButtonEl = document.createElement("button");
    shareButtonEl.className = "button-share";

    var botScreenEl = document.createElement("p");
    botScreenEl.className = "font-white";
    botScreenEl.innerText = "REWARD:"
    botScreenEl.appendChild(document.createElement("br"));
    wrapperEl.appendChild(botScreenEl);

    botScreenEl = document.createElement("div");
    botScreenEl.className = "font-white";
    var coinIconEl = document.createElement("span");
    coinIconEl.className = "coin-icon";
    botScreenEl.appendChild(coinIconEl);
    botScreenEl.appendChild(coinstToCollectEl);
    wrapperEl.appendChild(botScreenEl);

    botScreenEl = document.createElement("div");
    botScreenEl.className = "font-white";
    botScreenEl.appendChild(spinsMinorEl);
    botScreenEl.appendChild(levelMultiplierEl);
    wrapperEl.appendChild(botScreenEl);


    botScreenEl = document.createElement("div");
    botScreenEl.className = "font-white";
    botScreenEl.className = "ls-wrapper";
   /* var coinIconEl = document.createElement("span");
    coinIconEl.className = "coin-icon";
    botScreenEl.appendChild(coinIconEl);
    botScreenEl.appendChild(coinstToCollectEl);*/
   // botScreenEl.appendChild(shareButtonEl);
    botScreenEl.appendChild(collectButtonEl);
    wrapperEl.appendChild(botScreenEl);


    return {
        runEndScreen: function (spins, bestSpins, levelMultiplier, total, collectCb) {
            overlayWrapperEl.innerHTML = "";
            overlayWrapperEl.appendChild(wrapperEl);

            overlayWrapperEl.style.display = "block";
            overlayEl.style.display = "block";
            wrapperEl.style.display = "block";
            spinsMajorEl.innerText = Math.floor(spins);
            spinsBestEl.innerText = Math.floor(bestSpins);

            spinsMinorEl.innerText = "spins";//Math.floor(spins);
            levelMultiplierEl.innerText = "x" + Math.floor(levelMultiplier);
            coinstToCollectEl.innerText = renderTriNumber(total);

            var newButton = collectButtonEl.cloneNode(true);
            collectButtonEl.parentNode.replaceChild(newButton, collectButtonEl);
            collectButtonEl = newButton;
            collectButtonEl.addEventListener("click", function () {
                overlayWrapperEl.style.display = "none";
                overlayEl.style.display = "none";
                wrapperEl.style.display = "none";
                collectCb();
            }, false);
            // collectButtonEl.parentNode.replaceChild(newButton, collectButtonEl);
        }
    };
})();


export var spinsCounterUI = (function () {
    var wrapperEl = document.createElement("div");
    wrapperEl.className = "spins-counter ui-text";

    var spinsCountWrapperEl = document.createElement("div");
    spinsCountWrapperEl.className = "spins-count";

    var spinsCounterOverlay = document.createElement("div");
    spinsCounterOverlay.className = "spins-counter-overlay";

    var fillBarEl = document.createElement("div");
    fillBarEl.className = "fill-bar";

    var fillBarProgressEl = document.createElement("div");
    fillBarProgressEl.className = "fill-bar-progress";

    var levelMultiplierEl = document.createElement("span");
    levelMultiplierEl.className = "level-mult";

    var levelMultiplierCircleEl = document.createElement("div");
    levelMultiplierCircleEl.className = "level-mult-circle";

    var descEl = document.createElement("span");
    descEl.innerText = "SPINS:";
    descEl.className = "spins-actual-desc";

    var spinsCountEl = document.createElement("span");
    spinsCountEl.className = "spins-actual";

    spinsCountWrapperEl.appendChild(descEl);
    spinsCountWrapperEl.appendChild(document.createElement("br"));
    spinsCountWrapperEl.appendChild(spinsCountEl);

    fillBarEl.appendChild(fillBarProgressEl);

    wrapperEl.appendChild(fillBarEl);
    wrapperEl.appendChild(spinsCountWrapperEl);
    levelMultiplierCircleEl.appendChild(levelMultiplierEl);
    wrapperEl.appendChild(levelMultiplierCircleEl);
    wrapperEl.appendChild(spinsCounterOverlay);
    globalWrapperEl.appendChild(wrapperEl);
    return {
        setSpinsCount: function (spins, barProgress) {
            spinsCountEl.innerText = Math.floor(spins);
            fillBarProgressEl.style.width = barProgress + "%";
        },
        setLevelMultiplier: function (mult) {
            levelMultiplierEl.innerHTML = '<span class="mult-special">x</span>' + mult;
        },
        levelUp: function () {
            levelMultiplierCircleEl.classList.add("level-up");
            setTimeout(function () {
                levelMultiplierCircleEl.classList.remove("level-up");
            }, 300);
        }
    };
})();

export var speedMeterUI = (function () {
    var wrapperEl = document.createElement("div");
    wrapperEl.className = "speed-meter ui-text";

    var speedEl = document.createElement("span");
    speedEl.innerText = "0";
    speedEl.className = "font-36";

    var speedIcoEl = document.createElement("img");
    speedIcoEl.className = "speed-ico";
    speedIcoEl.src = "assets/ui/rev_icon.png";

    wrapperEl.appendChild(speedEl);
    wrapperEl.appendChild(speedIcoEl);
    globalWrapperEl.appendChild(wrapperEl);
    return {
        setSpeed: function (speed) {
            speedEl.innerText = Math.round(speed);
        }
    };
})();

export var upgradeUI = (function () {

    // upgrade screen
    var wrapperEl = document.createElement("div");
    wrapperEl.className = "upgrade-screen ui-text";

    // close button
    var closeEl = document.createElement("div");
    closeEl.className = "close-button";
    closeEl.addEventListener("click", function () {
        overlayWrapperEl.style.display = "none";
        overlayEl.style.display = "none";
        wrapperEl.style.display = "none";

        var coinsEl = coinsUI.getWrapper();
        globalWrapperEl.appendChild(coinsEl);
    });
    wrapperEl.appendChild(closeEl);


    // upgrade text

    var upgradeTextEl = document.createElement("p");
    upgradeTextEl.className = "font-70 upgrade-header";
    upgradeTextEl.innerText = "UPGRADES";

    wrapperEl.appendChild(upgradeTextEl);


    // upgrade buttons
    var upgradeList = ["more speed", "longer spins", "time reward"];
    var iconList = ["rev_icon.png", "spins_icon.png", "time_icon.png"];

    var costList = [];
    var levelList = [];
    var costButtonsList = [];

    for (var i = 0; i < upgradeList.length; i++) {

        var coinstToCollectEl = document.createElement("span");
        coinstToCollectEl.className = "font-40 upgrade-text";
        coinstToCollectEl.innerText = upgradeList[i];


        var upgradeIcoEl = document.createElement("img");
        upgradeIcoEl.src = "assets/ui/" + iconList[i];

        var levelWrapperEl = document.createElement("span");
        levelWrapperEl.className = "upgrade-level-wrapper font-60";

        var levelEl = document.createElement("span");
        levelEl.className = "upgrade-level";
        levelList.push(levelEl);

        levelWrapperEl.appendChild(document.createTextNode(" "));
        levelWrapperEl.appendChild(levelEl);


        var upgradeButtonEl = document.createElement("button");
        upgradeButtonEl.className = "button-upgrade button-large";

        var coinIconEl = document.createElement("span");
        coinIconEl.className = "coin-icon";
       // upgradeButtonEl.appendChild(coinIconEl);

        var costValueEl = document.createTextNode("");
        upgradeButtonEl.appendChild(costValueEl);
        costList.push(costValueEl);

        costButtonsList.push(upgradeButtonEl);

        var botScreenEl = document.createElement("div");
        botScreenEl.className = "font-white";
        botScreenEl.className = "button-upgrade-wrapper";
        botScreenEl.appendChild(coinstToCollectEl);
        botScreenEl.appendChild(document.createElement("br"));
        botScreenEl.appendChild(upgradeIcoEl);
        botScreenEl.appendChild(levelWrapperEl);
        botScreenEl.appendChild(upgradeButtonEl);
        wrapperEl.appendChild(botScreenEl);
    }

    /*
    //change avatar button - TD
    var coinstToCollectEl = document.createElement("span");
    coinstToCollectEl.className = "font-40 upgrade-text";
    coinstToCollectEl.innerText = "use my profile picture";


    var upgradeButtonEl = document.createElement("button");
    upgradeButtonEl.className = "button-avatar button-large";

    var upgradeButtonLabel = document.createElement("span");
    upgradeButtonLabel.className = "free-label";
    upgradeButtonEl.appendChild(upgradeButtonLabel);

    costButtonsList.push(upgradeButtonEl);

    var botScreenEl = document.createElement("div");
    botScreenEl.className = "font-white";
    botScreenEl.className = "button-upgrade-wrapper";
    botScreenEl.appendChild(coinstToCollectEl);
    botScreenEl.appendChild(document.createElement("br"));
    botScreenEl.appendChild(upgradeButtonEl);
    wrapperEl.appendChild(botScreenEl);
    */




    // upgrade icon
    var upgradeIconClickCB = function (evt) {

        //evt.preventDefault(); default ui event fix

        overlayWrapperEl.innerHTML = "";
        var coinsEl = coinsUI.getWrapper();
        overlayWrapperEl.appendChild(coinsEl);

        overlayWrapperEl.appendChild(wrapperEl);
        overlayWrapperEl.style.display = "block";
        overlayEl.style.display = "block";
        wrapperEl.style.display = "block";
    }

    var upgradeIcoEl = document.createElement("div");
    upgradeIcoEl.className = "upgrade-ico";
    upgradeIcoEl.addEventListener("click", upgradeIconClickCB, false);

    globalWrapperEl.appendChild(upgradeIcoEl);

    return {
        updateCost: function (speed, intertia, timeReward) {
            costList[0].textContent = renderTriNumber(speed);
            costList[1].textContent = renderTriNumber(intertia);
            costList[2].textContent = renderTriNumber(timeReward);
        },
        updateAvailability: function (speed, intertia, timeReward) {
            speed === false ? costButtonsList[0].disabled = true : costButtonsList[0].disabled = false;
            intertia === false ? costButtonsList[1].disabled = true : costButtonsList[1].disabled = false;
            timeReward === false ? costButtonsList[2].disabled = true : costButtonsList[2].disabled = false;

        },
        bindUpgradeCallbacks: function (speed, intertia, timeReward) {
            costButtonsList[0].addEventListener("click", speed);
            costButtonsList[1].addEventListener("click", intertia);
            costButtonsList[2].addEventListener("click", timeReward);
        },
        updateLevel: function (speed, intertia, timeReward) {
            levelList[0].textContent = speed;
            levelList[1].textContent = intertia;
            levelList[2].textContent = timeReward;
        },
        upgradesEnabled: function (enabled) {
            upgradeIcoEl.removeEventListener("click", upgradeIconClickCB);
            upgradeIcoEl.classList.add("disabled");
            if (enabled) {
                upgradeIcoEl.addEventListener("click", upgradeIconClickCB, false);
                upgradeIcoEl.classList.remove("disabled");
            }
        }
    };
})();

export var slideAreaUI = (function () {
    var slideAreaEl = document.createElement("div");
    slideAreaEl.className = "slide-area";

    document.body.appendChild(slideAreaEl);


    var obj = {
        registerSlide: function (cb) {
            swipe(slideAreaEl, cb);
        },
        slideAreaEl: slideAreaEl
    };

    return obj;
})();

export var coinsUI = (function () {
    var wrapperEl = document.createElement("div");
    wrapperEl.className = "coins-total ui-text";

    var coinsEl = document.createElement("span");
    coinsEl.innerText = "0";
    coinsEl.className = "font-36 font-yellow";

    var coinsIcoEl = document.createElement("img");
    coinsIcoEl.className = "coins-ico";
    coinsIcoEl.src = "assets/ui/coin.png";

    wrapperEl.appendChild(coinsIcoEl);
    wrapperEl.appendChild(coinsEl);
    globalWrapperEl.appendChild(wrapperEl);
    return {
        setCoins: function (coins) {
            coinsEl.innerText = renderTriNumber(coins);
        },
        getWrapper: function () {
            return wrapperEl;
        }
    };
})();


export var hintHand = (function () {
    var wrapperEl = document.createElement("div");
    wrapperEl.className = "hint-hand-wrapper";

    var handIcoEl = document.createElement("span");
    handIcoEl.className = "hint-hand-ico";

    var spinsRemainEl = document.createElement("span");
    spinsRemainEl.className = "hint-spins-remain ui-text";

    var newBestEl = document.createElement("span");
    newBestEl.className = "hint-new-best ui-text";
    newBestEl.innerText = "NEW BEST";

    var stopButtonEl = document.createElement("div");
    stopButtonEl.className = "hint-stop-button";

    wrapperEl.appendChild(newBestEl);
    wrapperEl.appendChild(handIcoEl);
    wrapperEl.appendChild(stopButtonEl);
    wrapperEl.appendChild(spinsRemainEl);
    globalWrapperEl.appendChild(wrapperEl);
    return {
        setSpinsRemain: function (spinsRemain) {
            var innerText = `/${SPIN_ATTEMPTS}`;
            spinsRemainEl.innerText = spinsRemain + innerText;
            if (spinsRemain === 0) {
                this.noMoreSpins();
                this.showStopButton(true);
            } else {
                this.showStopButton(false);
            }
        },
        noMoreSpins: function () {
            spinsRemainEl.innerText = "NO SWIPES LEFT";
        },
        newBestVisible: function (visible) {
            visible ? newBestEl.style.visibility = "visible" : newBestEl.style.visibility = "hidden";
        },
        showStopButton: function (visible) {
            if (visible) {
                stopButtonEl.style.display = "block";
                handIcoEl.style.display = "none";
                slideAreaUI.slideAreaEl.style.display = "none";
            } else {
                stopButtonEl.style.display = "none";
                handIcoEl.style.display = "block";
                slideAreaUI.slideAreaEl.style.display = "block";
            }
        },
        bindStopButtonAction: function (cb) {
            // make sure there is always just one callback
            var newButton = stopButtonEl.cloneNode(true);
            stopButtonEl.parentNode.replaceChild(newButton, stopButtonEl);
            stopButtonEl = newButton;

            stopButtonEl.addEventListener("click", cb, false);
        },
        freezeHand: function(){
        
            handIcoEl.className = "hint-hand-ico-static";
        }
    };
})();

function swipe(element, callback) {

    var clientWidth = element.clientWidth;
    var clientHeight = element.clientHeight;

    var context = {
        xDown: null,
        startTime: null,
        xLast: null,
        yDown: null,
        yLast: null
    };

    element.addEventListener('touchstart', handleTouchStart.bind(context), false);
    element.addEventListener('mousedown', handleMouseStart.bind(context), false);

    element.addEventListener('touchend', handleTouchEnd.bind(context), false);
    element.addEventListener('touchout', handleTouchEnd.bind(context), false);
    element.addEventListener('touchmove', handleTouchMove.bind(context), false);

    element.addEventListener('mouseup', handleMouseEnd.bind(context), false);
    element.addEventListener('mouseout', handleMouseEnd.bind(context), false);


    function handleTouchStart(evt) {

        //evt.preventDefault();         //default ui event fix

        this.xDown = evt.touches[0].clientX;
        this.yDown = evt.touches[0].clientY;
        this.startTime = performance.now();
    }

    function handleMouseStart(evt) {

        this.xDown = evt.clientX;
        this.yDown = evt.clientY;
        this.startTime = performance.now();
    }

    function handleTouchMove(evt) {

        //evt.preventDefault();             //default ui event fix

        this.xLast = evt.touches[0].clientX;
        this.yLast = evt.touches[0].clientY;
    }

    function handleTouchEnd(evt) {
        if (context.xDown !== null)
            resolveSlide.call(this, this.xLast, this.yLast);
    }

    function handleMouseEnd(evt) {
        if (context.xDown !== null)
            resolveSlide.call(this, evt.clientX, evt.clientY);
    }

    function resolveSlide(xEnd, yEnd) {

        var endTime = performance.now();

        var distX = Math.abs(xEnd - this.xDown) / clientWidth;
        var distY = Math.abs(yEnd - this.yDown) / clientHeight;

        var distance = Math.max(distX, distY);

        var time = endTime - this.startTime;
        if (distance / time > 0.001) {

            callback(endTime - this.startTime, distance);
        }

        this.xDown = null;
        this.startTime = null;
    }
}

function renderTriNumber(amount) {

    amount = Math.floor(amount);

    var i, units = ["", "k", "M", "B", "T"];
    for (i = 0; i < units.length; i++) {
        if (amount * 0.001 < 1)
            break;

        amount = amount * 0.001;
    }
    amount = parseInt(Math.floor(amount * 10)) / 10;
    return amount + units[i];
}