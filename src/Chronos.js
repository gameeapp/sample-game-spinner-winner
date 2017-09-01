export var Chronos = function () {
    this.listeners = [];
    this._init();
};

Chronos.prototype = {
    _init: function () {
        this.timeRunning = 0;
        this.timeMod = 1;
    },
    registerListener: function (listener) {
        this.listeners.push(listener);
    },
    prependListener: function (listener) {
        this.listeners.unshift(listener);
    },
    removeListener: function (listener) {
        var i;

        for (i = 0; i < this.listeners.length; i++) {
            if (listener === this.listeners[i]) {
                this.listeners.splice(i);
                continue;
            }
        }
    },
    update: function (deltaTime) {

       // window.stats.begin();
        var i;

        deltaTime = deltaTime * this.timeMod;
        this.timeRunning += deltaTime;

        for (i = 0; i < this.listeners.length; i++)
            this.listeners[i].update(deltaTime);

       // window.stats.end();
    },
    setUpdating: function (updating) {
        if (updating) {
            delete this.update;
        } else {
            this.update = function () {
                
            
            };
        }
    }
};

export var createChronos = function () {
    return new Chronos();
};