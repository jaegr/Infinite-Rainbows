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

// import com.bourre.log.*;
// import orange.lib.*;
//
// class orange.rb.Rainbow extends Sys {
// 	public var pt:Position;
// 	public var isRunning:Boolean;
// 	static var rbCnt:Number=0;
// 	var channel = "com.pokelondon.unlimited.views.Rainbow"
// 	// Path data
// 	var pp:Array;
// 	var pmc:Array;
// 	var pmcTop:MovieClip;
// 	var pmcIndex,drawn,pmcNum,pmcAlloc:Number;
//
// 	var minDist,offs,cnt:Number;
// 	var wMin,wMax:Number;
// 	var colOffs:Number;
//
// 	private var _id:Number;
//

function Rainbow(id) {
    rbCnt++;
    this.isRunning = false;
    this._id = id;
    this.pt = new Position(id);
    this.minDist = 0.1; //20
    this.setWidth(1, 15);
}

Rainbow.prototype.init = function() {
    this.drawn = 0;
    for (var i = 0; i < this.pmcNum; i++) this.pmc[i].clear();
    // pmcTop.clear();
    this.pmcIndex = 0;

    this.colOffs = floor(random(6));

    // this.pt.reinit(0, 0, 2, 4.5, 2);

    //original
    // this.dirD.setTo(0,2.5,-2.5,0.05,0.0025);
    // this.speedD.setTo(minSpeed,maxSpeed,minSpeed,0.02,0.002);

    var rndMod = random(1, 9) * 0.125;
    this.pt.reinit(0, 0,
        2 * rndMod, 4.5 * rndMod, // min/max speed
        0.1 * rndMod // max rotation
    );

    var vec = createVector(random(0.1, 0.4) * height * 0.5, 0);
    vec.rotate(random(TWO_PI));
    vec.add(width / 2, height / 2);

    // this.pt.p.set(width / 2, height/2);
    // this.pt.p.add(rndF(-200, 200), rndF(-100, 100));
    this.pt.p.set(vec.x, vec.y);
    if (this.pt.p.x > width / 2) this.pt.dir += 180;


    this.cnt = 0;
}

Rainbow.prototype.update = function() {
    if (this.isRunning) {

        this.pt.update();
        this.updatePath();
        if (this.pt.dead) this.isRunning = false;
    }
}

Rainbow.prototype.start = function() {
    println("start()");
    //Logger.LOG(this.mc + " start", LogLevel.DEBUG, channel);
    this.isRunning = true;
    this.cnt = 0;
}

Rainbow.prototype.stop = function() {
    //Logger.LOG(this.mc + " stop", LogLevel.DEBUG, channel);
    this.isRunning = false;
    this.hide();
}
Rainbow.prototype.setPosition = function(x, y) {
    this.pt.setPosition(x, y);
    //trace("a setPosition "+pt.p.x+","+pt.p.y+
    //	" "+mc._x+","+mc._y);
}

Rainbow.prototype.setSpeed = function(min, max) {
    this.pt.setSpeed(min, max);
}

Rainbow.prototype.setWidth = function(min, max) {
    this.pt.wMin = min;
    this.pt.wMax = max;
}

Rainbow.prototype.setCurvature = function(max) {
    this.pt.setCurvature(max);
}

Rainbow.prototype.setMinDistance = function(min) {
    this.minDist = min;
}

/////////////////////////////////////////
// PATH FUNCTIONS

Rainbow.prototype.updatePath = function() {
    var neww;

    //    if (frameCount < 100) println(this.cnt + " a u " + this.pt.p.x + "," + this.pt.p.y +
    //        " |" + this.pt.isAvoiding + " dist=" + nf(this.pt.distTravelled, 0, 2) + " > " +
    //        nf(this.pt.speed.val, 0, 2) + " " + nf(this.pt.dir, 0, 2) + " " + nf(this.pt.dirD.val, 0, 2));
    //		trace("a u "+pt.p.x+","+pt.p.y);

    // check to see if we should place new segment

    var curveMult = (1 / Math.abs(this.pt.dirD.val)) * 0.5;
    if (this.cnt < 2 || this.pt.distTravelled > curveMult * this.minDist) {
        this.pt.distTravelled = 0; // reset distance
        this.offs = -3 * this.pt.w;

        for (var i = 0; i < 7; i++) {
            this.offs = this.pt.w * (i - 3);
            this.pp[i].set(this.pp[i + 7]);
            this.pp[i + 7].set(this.pt.p.x + this.pt.tan.x * this.offs, this.pt.p.y + this.pt.tan.y * this.offs);
        }

        this.pt.updateOldPoint();

        if (this.cnt > 2) { // Distance has been covered, add new point
            for (var i = 0; i < 6; i++) {
                stroke(rbcol[(this.colOffs + i) % 6]);
                fill(rbcol[(this.colOffs + i) % 6]);
                push();
                beginShape();

                vertex(this.pp[i].x, this.pp[i].y);
                vertex(this.pp[i + 7].x, this.pp[i + 7].y);
                vertex(this.pp[i + 8].x, this.pp[i + 8].y);
                vertex(this.pp[i + 1].x, this.pp[i + 1].y);
                endShape();
                pop();
            }

            this.drawn++;
            //if (this.pmcNum - this.drawn == 80) this.pt.die();
        }
    }
    // if not new segment, draw temporary path
    else if (this.cnt > 2) {
        for (var i = 7; i < 13; i++) {
            this.offs = this.pt.w * ((i - 7) - 3);

            // stroke is used to cover aliasing white "gap" glitches when rendering polygons
            stroke(rbcol[(this.colOffs + (i - 7)) % 6]);

            fill(rbcol[(this.colOffs + (i - 7)) % 6]);

            push();
            beginShape();
            vertex(this.pp[i].x, this.pp[i].y);
            vertex(this.pt.p.x + this.pt.tan.x * this.offs, this.pt.p.y + this.pt.tan.y * this.offs);
            vertex(this.pt.p.x + this.pt.tan.x * (this.offs + this.pt.w), this.pt.p.y + this.pt.tan.y * (this.offs + this.pt.w));
            vertex(this.pp[i + 1].x, this.pp[i + 1].y);
            endShape();
            pop();
        }
    }
    this.cnt++;
}

Rainbow.prototype.initPath = function(_pmcNum) {
    this.pp = new Array();
    for (var i = 0; i < 14; i++) this.pp[i] = new createVector();
    this.drawn = 0;
}
