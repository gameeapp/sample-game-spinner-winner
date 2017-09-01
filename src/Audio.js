import { slideAreaUI } from "./ui/controlls.js"


var SOUND_SOURCES = [
    "assets/audio/63532__florian-reinke__click2.mp3",
    "assets/audio/63532__florian-reinke__click2.ogg"
];

var Audio = function () {
    this.isPlaying = false;
    this._init();
};

Audio.prototype = {
    _init: function () {
        this.sound = new Howl({
            src: [SOUND_SOURCES[0], SOUND_SOURCES[1]],
            loop: true,
            preload: true,
            volume: 1,
            rate: 1,
            autoplay: false
        });
    },
    start: function (opt_rate) {
        opt_rate = opt_rate || 0;
        this.setRate(opt_rate);
        try {
            this.sound.stop();
        } catch (e) { }
        this.sound.play();
        this.isPlaying = true;
    },
    mute: function (mute) {
        this.sound.mute(mute);
    },
    pause: function (pause) {
        if (pause) {
            this.sound.pause();
        } else if (this.isPlaying) {
            this.sound.play();
        }
    },
    stop: function () {
        this.sound.stop();
        this.isPlaying = false;
    },
    setRate: function (rate) {
        
        rate = rate * 0.05; // 60/3


        rate *= this.sound.duration();

        rate = Math.min(7.1, rate);
        rate = Math.max(0.1, rate);

        this.sound.rate(rate);
    }
};

export var audio = new Audio();

// Unlock audio for mobile platforms

/*
(function () {

    var unlockAudioListener;

    unlockAudioListener = function () {

        var myContext = new AudioContext();

        // create empty buffer
        var buffer = myContext.createBuffer(1, 1, 22050);
        var source = myContext.createBufferSource();
        source.buffer = buffer;

        // connect to output (your speakers)
        source.connect(myContext.destination);

        // play the file
        if (!source.start)
            source.start = source.noteOn;
        source.start(0);

        try {
            window.removeEventListener('touchstart', unlockAudioListener);
            document.body.removeEventListener('touchstart', unlockAudioListener);
            slideAreaUI.slideAreaEl.removeEventListener('touchstart', unlockAudioListener);
        } catch (e) {

        }
    };

    window.addEventListener('touchstart', unlockAudioListener, true);
    document.body.addEventListener('touchstart', unlockAudioListener, true);
    slideAreaUI.slideAreaEl.addEventListener('touchstart', unlockAudioListener, true);
})();
*/
/*
(function () {
    var ctx = null, usingWebAudio = true;

    try {
        if (typeof AudioContext !== 'undefined') {
            ctx = new AudioContext();
        } else if (typeof webkitAudioContext !== 'undefined') {
            ctx = new webkitAudioContext();
        } else {
            usingWebAudio = false;
        }
    } catch (e) {
        usingWebAudio = false;
    }

    // context state at this time is `undefined` in iOS8 Safari
    if (usingWebAudio && ctx.state === 'suspended') {
        var resume = function () {
            ctx.resume();

            setTimeout(function () {
                if (ctx.state === 'running') {
                    document.body.removeEventListener('touchend', resume, false);
                }
            }, 0);
        };

        document.body.addEventListener('touchend', resume, false);
    }
})();

*/