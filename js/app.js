
var score = 0;
var lifes = 10;
var stop = false;
var id = 'images/char-boy.png';
var pic= 'images/Gem Blue.png';

//tol for tolerance -> how easy it is to bump into a bug or collect a bonus.
var tolEn = 20;
var tolBon = 30;

// Enemies our player must avoid

var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    this.x = x;
    this.y = y;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks

Enemy.prototype.update = function(dt, x, y) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    //if the enemy runs off the page start left again
    if(this.x > 600){this.x = this.x - 900;}

    //give enemy random speed
    var speed = Math.random() * 500;
    dtx = this.x + (speed * dt);

    dty = this.y;
    this.x = dtx;
    this.y = dty;

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function(x, y) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x,y) {
    this.x = x;
    this.y = y;
};

//update the player. If player reaches water (y < 1): score
Player.prototype.update = function(dt) {
    if(this.y < 1) {
        document.getElementById('tada').play();
        this.x = 200;
        this.y = 400;
        score += 1;
        document.getElementById('score').innerHTML='Score: ' + score;
    }
};

//check if game is stopped, if so disable keys
//otherwise move player, but not beyond bounderies of playing field

Player.prototype.handleInput = function(allowedKeys, x, y) {
    if(stop === true){
        return;
    }
    switch(allowedKeys) {
        case 'left':
            if(this.x - 100 < 0) {
                break;
            }
            else {
                this.x -= 100;
                break;
            }
        case 'right':
            if(this.x + 100 >= 500) {
                break;
            }
            else {
                this.x += 100;
                break;
            }
        case 'up':
            this.x = this.x;
            this.y -= 82;
            break;
        case 'down':
            if(this.y + 82 >= 482) {
                break;
            }
            else {
                this.y += 82;
                break;
            }
    }
};


Player.prototype.render = function() {
    this.sprite = id;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

//Bonus class:

var Bonus = function(x,y,pic) {
    var bonPic = pic;
    x = bonusLocatorX();
    y = bonusLocatorY();
    this.x = x;
    this.y = y;    
    this.sprite = bonPic;
};

Bonus.prototype.update = function() {

};

Bonus.prototype.render = function() {
    this.sprite = pic;
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//select a random bonus pic
function bonusSelector() {
    var nameBonus = [ 'images/Gem Blue.png', 'images/Gem Green.png', 'images/Gem Orange.png', 'images/Heart.png', 'images/Key.png', 'images/Rock.png', 'images/Star.png'
];
    var chooseBonus;
    var picBonus;
    chooseBonus = Math.floor(Math.random() * 7);
    picBonus = nameBonus[chooseBonus];
    console.log(chooseBonus);
    return picBonus;
}

//set bonus.x
function bonusLocatorX() {
    var x;
    x = (Math.floor(Math.random() * 5) * 100 + 15);
    return x;
    }

//set bonus.y
function bonusLocatorY() {
    var locY;
    locY = [260, 178,96];
    y = locY[(Math.floor(Math.random() * 3))];
    return y;
}

var allEnemies = [new Enemy(-150,65), new Enemy(-590,143), new Enemy(-250,228), new Enemy(-865,65), new Enemy(-740,143), new Enemy(-450,228)];

var player = new Player(200,400);

var bonus = new Bonus(15,96);



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

function checkCollisions() {
    //if player comes into contact with bug(=enemy with a padding of tol)
    //then player back to start position and lifes - 1.

    for(i=0; i<allEnemies.length; i +=1){
        if((player.x > allEnemies[i].x - tolEn) && (player.x < allEnemies[i].x + tolEn) && (player.y > allEnemies[i].y - tolEn) && (player.y < allEnemies[i].y + tolEn)){
            document.getElementById('hit').play();
            player.x = 200;
            player.y = 400;
            lifes -= 1;
            checkLifes(lifes);
            document.getElementById('lifes').innerHTML='Lifes left: ' + lifes;
        }
    }

    //check if player collects bonus, if so: new bonus (change pic + location) + play sound + adjust score
    if((player.x > bonus.x - tolBon) && (player.x < bonus.x + tolBon) && (player.y > bonus.y - tolBon) && (player.y < bonus.y + tolBon)){
        bonus.x = bonusLocatorX();
        bonus.y = bonusLocatorY();
        pic = bonusSelector();
        document.getElementById('colSound').play();
        score += 1;
        document.getElementById('score').innerHTML='Score: ' + score;
        new Bonus(bonus.x, bonus.y, pic);
    }
};

//if lifes < 1: game over
function checkLifes(lifes) {
    if(lifes < 1){
        document.getElementById('gameOver').innerHTML='GAME OVER';
        document.getElementById('end').play();
        stop = true;
    }
};

//when start again button is clicked:
function restart() {
    location.reload();
}

//mute music, adjust value button
function mute() {
    if(document.getElementById('musicBtn').value === 'Turn music off'){
        document.getElementById('music').pause();
        document.getElementById('musicBtn').value='Turn music on';
    }
    else {
        document.getElementById("music").play();
        document.getElementById('musicBtn').value='Turn music off';
    }
}

//choose a player png (adjusted engine.js -> resources.load)
function choosePlayer(player){
    switch(player) {
        case 1:
            id = 'images/char-boy.png';
            break;
        case 2:
            id ='images/char-cat-girl.png';
            break;
        case 3:
            id = 'images/char-horn-girl.png';
            break;
        case 4:
            id ='images/char-pink-girl.png';
            break;
        case 5:
            id = 'images/char-princess-girl.png';
            break;
    }
}