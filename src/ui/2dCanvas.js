var GLOBAL_WRAPPER_ID = "game-wrapper";
var MAX_OPACITY_MULT = 0.7;

var SPINNER_IMG = {
    stage0: "assets/spinners/spiner_stage0.png",
    stage1: "assets/spinners/spiner_stage1.png",
    stage2: "assets/spinners/spiner_stage2.png",
    stage3: "assets/spinners/spiner_stage3.png",
    middle: "assets/spinners/spiner_center.png"
};

var STAGE_REACH = {

};

var globalWrapperEl = document.getElementById(GLOBAL_WRAPPER_ID);
var ctx = null;
var canvas, imgs, img,
    hRatio, vRatio, ratio, centerShift_x, centerShift_y;


function loadImages() {

    var counter = 0,
        total = 0;

    imgs = {};
    for (var key in SPINNER_IMG) {
        total++;
        loadImage(SPINNER_IMG[key], key, function () {
            counter++;
            if (counter !== total)
                return;

            img = imgs.stage0;
            hRatio = canvas.width / img.width;
            vRatio = canvas.height / img.height;
            ratio = Math.min(hRatio, vRatio);
            centerShift_x = (canvas.width - img.width * ratio) / 2;
            centerShift_y = (canvas.height - img.height * ratio) / 2;

            render(0, 0);
        });
    }

}

function loadImage(path, name, cb) {
    var img = document.createElement("img");
    img.onload = function () {
        imgs[name] = img;
        cb();
    }
    img.src = path;
}

(function () {
    canvas = document.createElement("canvas");
    canvas.id = "spinner-ctx";
    canvas.width = 640;
    canvas.height = 640;
    ctx = canvas.getContext("2d");

    globalWrapperEl.appendChild(canvas);

    /*
    window.stats = new Stats();
    document.body.appendChild(stats.domElement);
    stats.domElement.style.position = "absolute";
    stats.domElement.style.top = "0px";
    */

    loadImages();
})();

export var render = function (degrees, speed) {


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var opacityMult = 0;

    // if (speed > 1200) {
    //     opacityMult = (speed - 1200) / 400;
    //     renderSpinner(degrees + 120, opacityMult * 0.5 + 0.5, imgs.stage3);
    //     renderSpinner(degrees, 1, imgs.stage2);
    // } else if (speed > 800) {
    //     opacityMult = (speed - 800) / 400;
    //     renderSpinner(degrees + 120, opacityMult * 0.5 + 0.5, imgs.stage2);
    //     renderSpinner(degrees, 1, imgs.stage1);
    // } else if (speed > 400) {
    //     opacityMult = (speed - 400) / 400;
    //     renderSpinner(degrees + 120, opacityMult, imgs.stage1);
    //     renderSpinner(degrees, 1, imgs.stage0);
    // } else {
    //     renderSpinner(degrees, 1, imgs.stage0);
    // }

    if (speed > 1200) {
        opacityMult = (speed - 1200) / 400;
        // renderSpinner(degrees + 120, opacityMult * 0.5 + 0.5, imgs.stage3);
        // renderSpinner(degrees + 120, Math.max(0, 1 - opacityMult), imgs.stage2);
        renderSpinner(degrees, 1, imgs.stage3);
    } else if (speed > 800) {
        opacityMult = (speed - 800) / 400;
        // renderSpinner(degrees + 120, opacityMult * 0.5 + 0.5, imgs.stage2);
        // renderSpinner(degrees + 120, Math.max(0, 1 - opacityMult), imgs.stage1);
        renderSpinner(degrees, 1, imgs.stage2);
    } else if (speed > 400) {
        opacityMult = (speed - 400) / 400;
        // renderSpinner(degrees + 120, opacityMult, imgs.stage1);
        renderSpinner(degrees, 1, imgs.stage1);
        renderSpinner(degrees, opacityMult * 0.5 + 0.5, imgs.stage2);
    } else {
        renderSpinner(degrees, 1, imgs.stage0);
    }

    renderSpinnerCenter(imgs.middle);

}

function renderSpinner(degrees, opacity, targetImage) {

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(degrees * Math.PI / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    ctx.globalAlpha = opacity;
    ctx.drawImage(targetImage, 0, 0, targetImage.width, targetImage.height,
        centerShift_x, centerShift_y, targetImage.width * ratio, targetImage.height * ratio);
    ctx.globalAlpha = 1;
    ctx.restore();
}

function renderSpinnerCenter(middle) {
    ctx.save();
    img = middle;
    ctx.drawImage(img, 0, 0, img.width, img.height,
        centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    ctx.restore();
}