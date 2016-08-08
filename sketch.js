// Infinite Rainbows
// This code is adapted from Infinite Rainbows,
// a generative animation by [Marius Watz](http://mariuswatz.com/).
// The original Actionscript version was commissioned by
// [POKE](http://pokelondon.com) as part of Good Things Should Never End,
// an online brand experience for Orange UK.

// Marius Watz and Poke have generously given permission
// for this p5.js port started by Daniel Shiffman for use
// on the YouTube channel "Coding Rainbow."

// This work is licensed under a Creative Commons
// Attribution-NonCommercial 4.0 International License
// http://creativecommons.org/licenses/by-nc/4.0/).

// Still in progress!

/*
// TODO - MW

- Initialize to full page
- Fix "isAvoiding" behavior or reinitialize off-screen rainbows
- Better demo behaviors (rainbows die / born, differentiated behaviors,
 GUI parameter manipulation?)
- Try drawing stored geometry instead of not clearing background

*/


var ColorPalette;
var rbcol = [];
var rainbows = [];
var rbCnt = 0;

function setup() {
    createCanvas(1200, 800);
    col = new ColorPalette();
    initLUT();
    initRainbows();
}

function initRainbows() {
    var n = random(3, 15);

    background(255);
    rainbows = [];
    while (rainbows.length < n) {
        var r = new Rainbow();
        r.init();
        r.start();
        r.initPath();
        rainbows.push(r);
    }
}

function draw() {

    if (frameCount < 5) background(255);
    // translate(width/2, height/2);
    for (var i = 0; i < rainbows.length; i++) {
        rainbows[i].update();
    }
}

function mousePressed() {
    initRainbows();
}

function initLUT() {
    if (!rbcol.length < 6) {
        rbcol = [];
        rbcol[0] = "#fd000b";
        rbcol[1] = "#ff6915";
        rbcol[2] = "#feed01";
        rbcol[3] = "#5fc42a";
        rbcol[4] = "#007ed3";
        rbcol[5] = "#530268";

    }
}

p5.Vector.prototype.setToTangent = function(v1, v2) {
    //function setToTangent(v1,v2) {
    this.x = -(v2.y - v1.y);
    this.y = v2.x - v1.x;
    var l = Math.sqrt(this.x * this.x + this.y * this.y);
    if (l != 0) {
        this.x /= l;
        this.y /= l;
    }
}
