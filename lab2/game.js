
let BORDER = 20;

let BULLET_RADIUS = 5;
let MIN_ENEMY_RADIUS = 5;
let MAX_ENEMY_RADIUS = 100;

let REFRESHING_INTERVAL = 10;

let BULLET_DEFAULT_SPEED = 250 * REFRESHING_INTERVAL / 1000;
let PLAYER_DECCELERATION = 1 * REFRESHING_INTERVAL / 1000;
let PLAYER_ACCELERATION = 5 * REFRESHING_INTERVAL / 1000;
let MAX_VEL = 500 * REFRESHING_INTERVAL / 1000
let MIN_ENEMY_SPEED = 5 * REFRESHING_INTERVAL / 1000;
let MAX_ENEMY_SPEED = 50 * REFRESHING_INTERVAL / 1000;

let NUM_START_ENEMIES = 10;
let BASIC_PROB_OF_NEW_ENEMY = 0.3 / REFRESHING_INTERVAL 
let PROB_OF_NEW_ENEMY_COEFFICIENT = 0.1
let PROB_OF_NEW_ENEMY = BASIC_PROB_OF_NEW_ENEMY;

let START_TIME = Date.now();
let STOP_TIME = Date.now();
let POINTS = 0;

let BEGINNING_LIVES = 3;
let LIVES = 1;
let BEGINNING_HIT_PROBABILITY = 0.5;
let HIT_PROBABILITY = 0.9;

let SPACE_WIDTH = 40;
let SPACE_HIGHT = 40;

let ATTACK_PLAYER = 0.1;

class GameArea {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    this.canvas.height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }
  start() {
    this.interval = setInterval(updateGameArea, REFRESHING_INTERVAL);
  }
  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  putDefaultParameters() {
    START_TIME = Date.now();
    POINTS = 0;
    HIT_PROBABILITY = BEGINNING_HIT_PROBABILITY;
    LIVES = BEGINNING_LIVES;
  }
}

class Enemy {
  constructor(x, y, radius, color, velx, vely) {
    this.radius = radius;
    this.color = color;
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
    this.playerVelx = 0;
    this.playerVely = 0;
  }
  update(){
    var context = gameArea.context;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }
  makeMove(player) {
    var distance = Math.sqrt(Math.pow(this.x - player.x, 2) +
                             Math.pow(this.y - player.y, 2));
    this.playerVelx = (player.x - this.x) / distance
    this.playerVely = (player.y - this.y) / distance
    this.x += this.velx + this.playerVelx * ATTACK_PLAYER;
    this.y += this.vely + this.playerVely * ATTACK_PLAYER;
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.defaultX = x;
    this.y = y;
    this.defaultY = y;
    this.velx = 0;
    this.vely = 0;
    this.angle = Math.PI / 2;
  }
  restart() {
    this.x = this.defaultX;
    this.y = this.defaultY;
    this.velx = 0;
    this.vely = 0;
    this.angle = Math.PI / 2;
  }
  update() {
    drawSpaceShip(this.x, this.y, this.angle);
    // drawTriangle("black", this.x, this.y, this.angle);
  }
  makeMove() {
    if (this.velx >  MAX_VEL) this.velx =  MAX_VEL
    if (this.velx < -MAX_VEL) this.velx = -MAX_VEL
    if (this.vely >  MAX_VEL) this.vely =  MAX_VEL
    if (this.vely < -MAX_VEL) this.vely = -MAX_VEL
    this.x += this.velx;
    this.y += this.vely;
    if (this.x < BORDER) {
      this.x = BORDER;
      this.velx = -this.velx;
    } else if (this.x > gameArea.canvas.width - BORDER) {
      this.x = gameArea.canvas.width - BORDER;
      this.velx = -this.velx;
    } 
    if (this.y < BORDER) {
      this.y = BORDER;
      this.vely = -this.vely;
    } else if (this.y > gameArea.canvas.height - BORDER) {
      this.y = gameArea.canvas.height - BORDER;
      this.vely = -this.vely;
    }
    if (this.velx > 0) this.velx -= PLAYER_DECCELERATION;
    if (this.velx < 0) this.velx += PLAYER_DECCELERATION;
    if (this.vely > 0) this.vely -= PLAYER_DECCELERATION;
    if (this.vely < 0) this.vely += PLAYER_DECCELERATION;
  }
  pointPlayerToCursor() {
    if (LIVES <= 0) {
      return
    }
    var alpha = Math.atan2(cursor.y - player.y, player.x - cursor.x) + Math.PI / 2;
    player.angle = alpha;
    player.update();
  }
}

class Bullet {
  constructor(x, y, velx, vely, angle) {
    this.x = x;
    this.y = y;
    this.velx = velx/2 + BULLET_DEFAULT_SPEED * Math.sin(angle - Math.PI);
    this.vely = vely/2 + BULLET_DEFAULT_SPEED * Math.cos(angle - Math.PI);
  }
  move() {
    this.x += this.velx;
    this.y += this.vely;
  }
  update() {
    var context = gameArea.context;
    context.fillStyle = "black";
    context.beginPath();
    context.arc(this.x, this.y, BULLET_RADIUS, 0, 2 * Math.PI);
    context.fill();
  }
}

class Cursor {
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  setNewPos(x, y) {
    this.x = x;
    this.y = y;
  }
}



function isInGameArea(enemy) {
    return enemy.x >= -enemy.radius && 
           enemy.x <= gameArea.canvas.width + enemy.radius &&
           enemy.y >= -enemy.radius &&
           enemy.y <= gameArea.canvas.height + enemy.radius;
  }

function isInGameAreaBullet(bullet) {
  return bullet.x > 0 && 
         bullet.x < gameArea.canvas.width &&
         bullet.y > 0 &&
         bullet.y < gameArea.canvas.height
}

function isHitByBullet(enemy, bullet) {
  var distance = Math.sqrt(Math.pow(enemy.x - bullet.x, 2) +
                           Math.pow(enemy.y - bullet.y, 2));
  return (distance < enemy.radius + BULLET_RADIUS)
}

function addPoints(enemy) {
  var time = (Date.now() - START_TIME) / 1000
  POINTS += Number((100 + time) / enemy.radius)
}

function isPlayerHit(enemy) {
  var distance = Math.sqrt(Math.pow(enemy.x - player.x, 2) +
                           Math.pow(enemy.y - player.y, 2));
  return (distance < enemy.radius + SPACE_WIDTH/2)
}

function removeLives() {
  if (Math.random() < HIT_PROBABILITY) {
    LIVES -= 1;
    POINTS -= 100;
    HIT_PROBABILITY -= 0.05;
  }
  else {
    HIT_PROBABILITY += 0.05;
  }
}

function createRandomEnemy() {
  var r = Math.floor(Math.random() * (MAX_ENEMY_RADIUS - MIN_ENEMY_RADIUS) + MIN_ENEMY_RADIUS);
  var x;
  var y;
  var side = Math.floor(Math.random() * 4);
  switch(side) {
    case 0:
      y = -r;
      x = Math.random() * (gameArea.canvas.width + 2 * r) - r;
      break;
    case 1:
      y = Math.floor(Math.random() * (gameArea.canvas.height + 2 * r) - r);
      x = gameArea.canvas.width + r;
      break;
    case 2:
      y = gameArea.canvas.height + r;
      x = Math.floor(Math.random() * (gameArea.canvas.width + 2 * r) - r);
      break;
    case 3:
      y = Math.floor(Math.random() * (gameArea.canvas.height + 2 * r) - r);
      x = -r;
      break;
  }
  var angle = Math.random() * 2 * Math.PI;
  var step = Math.random() * (MAX_ENEMY_SPEED - MIN_ENEMY_SPEED) + MIN_ENEMY_SPEED;
  var velx = step * Math.cos(angle);
  var vely = step * Math.sin(angle);

  return new Enemy(x, y, r, "red", velx, vely);
}

function startGame() {
  //initialize game
  gameArea = new GameArea();
  gameArea.putDefaultParameters();
  
  //initialize players
  player = new Player(gameArea.canvas.width / 2, gameArea.canvas.height / 2);
  
  //initialize enemies
  for (var i = 0; i < NUM_START_ENEMIES; i++) {
    enemies.push(createRandomEnemy());
  }

  //initialize frame refreshing
  gameArea.start();
}

function stopGame() {
  STOP_TIME = Date.now()
  gameArea.clear()
  document.getElementById("endGame").style.visibility = "visible"
}

function continueGame() {
  START_TIME += (Date.now()-STOP_TIME)
  document.getElementById("endGame").style.visibility = "hidden"
  LIVES = 1
  POINTS -= 1000
}

function restartGame() {
  enemies = [];
  bullets = [];
  gameArea.putDefaultParameters()
  player.restart()

  //initialize enemies
  for (var i = 0; i < NUM_START_ENEMIES; i++) {
    enemies.push(createRandomEnemy());
  }

  document.getElementById("endGame").style.visibility = "hidden"
}

function updateGameArea() {
  if (LIVES <= 0) {
    return
  }

  var timeFromBeginning = (Date.now() - START_TIME) / 1000;

  //change player velocity based on pressed keys
  if(map[65] || map[37]) player.velx -= PLAYER_ACCELERATION // A, left
  if(map[68] || map[39]) player.velx += PLAYER_ACCELERATION // D, right
  if(map[87] || map[38]) player.vely -= PLAYER_ACCELERATION // W, up
  if(map[83] || map[40]) player.vely += PLAYER_ACCELERATION // S, down

  //clear canvas
  gameArea.clear();

  //move everything
  player.makeMove();
  for(i = 0; i < enemies.length; i++) {
    enemies[i].makeMove(player);
  }
  for(i = 0; i < bullets.length; i++) {
    bullets[i].move();
  }

  //add new enemy with some probability
  if(Math.random() < PROB_OF_NEW_ENEMY) enemies.push(createRandomEnemy());
  
  //removing elements out of game area
  enemies = enemies.filter(isInGameArea);
  bullets = bullets.filter(isInGameAreaBullet)

  //check if enemy is hit by bullet
  var enemiesIndex = 0;
  while (enemiesIndex < enemies.length) {
    check: for(j = 0; j < bullets.length; j++) {
      if (isHitByBullet(enemies[enemiesIndex], bullets[j])) {
        addPoints(enemies[enemiesIndex])
        bullets.splice(j, 1)
        enemies.splice(enemiesIndex, 1)
        break check
      }
    }
    enemiesIndex += 1
  }

  //redrawing everything
  for(i = 0; i < enemies.length; i++) {  
    enemies[i].update();
  }
  for(i = 0; i < bullets.length; i++) {
    bullets[i].update();
  }
  player.pointPlayerToCursor();

  // update level
  // console.log(Math.log10(timeFromBeginning))
  PROB_OF_NEW_ENEMY = BASIC_PROB_OF_NEW_ENEMY +
  PROB_OF_NEW_ENEMY_COEFFICIENT * Math.log10(timeFromBeginning) / REFRESHING_INTERVAL

  enemiesIndex = 0;
  while (enemiesIndex < enemies.length) {
    if (isPlayerHit(enemies[enemiesIndex])) {
      enemies.splice(enemiesIndex, 1);
      removeLives();
    }
    else {
      enemiesIndex += 1
    }
  }

  document.getElementById("time").innerHTML = Number(timeFromBeginning).toFixed(1)
  document.getElementById("endPoints").innerHTML = Number(POINTS).toFixed(0)
  document.getElementById("result").innerHTML = Number(POINTS).toFixed(0)
  document.getElementById("armor").innerHTML = Number(100-HIT_PROBABILITY*100).toFixed(0)
  document.getElementById("lives").innerHTML = Number(LIVES).toFixed(0)

  if (LIVES <= 0) {
    stopGame()
  }
}

// @deprecated
function drawTriangle(color, x, y, angle) {
  var context = gameArea.context;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + 50 * Math.sin(angle + Math.PI / 10), y + 50 * Math.cos(angle + Math.PI / 10));
  context.lineTo(x + 50 * Math.sin(angle - Math.PI / 10), y + 50 * Math.cos(angle - Math.PI / 10));
  context.fill();
}

function drawSpaceShip(x, y, angle) {
  var ctx = gameArea.context; 
  ctx.save()
  ctx.setTransform(1, 0, 0, 1, x, y); // sets scales and origin
  ctx.rotate(-angle);
  ctx.drawImage(image, - SPACE_WIDTH/2, - SPACE_HIGHT/2, SPACE_WIDTH, SPACE_HIGHT);
  ctx.restore()
}

function updateCursor(e) {
  cursor.setNewPos(e.pageX, e.pageY);
  player.pointPlayerToCursor();
}

function shoot() {
  bullets.push(new Bullet(player.x, player.y, player.velx, player.vely, player.angle));
}

//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////

var gameArea;
var enemies = [];
var bullets = [];
var player;
var cursor = new Cursor();

var image=document.createElement("img");
image.src="image.png";

var map = {}; // pressed keys array
// get all keys if pressed
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
}

startGame();

gameArea.canvas.addEventListener("mousemove",  updateCursor);
gameArea.canvas.addEventListener("click", shoot);

document.getElementById("tryAgain").addEventListener("click", restartGame);
document.getElementById("continue").addEventListener("click", continueGame);

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    shoot();
  }
})