
let BORDER = 20;

let BULLET_RADIUS = 5;
let MIN_ENEMY_RADIUS = 5;
let MAX_ENEMY_RADIUS = 100;

let REFRESHING_INTERVAL = 10;

let BULLET_DEFAULT_SPEED = 250 * REFRESHING_INTERVAL / 1000;
let PLAYER_DECCELERATION = 2.5 * REFRESHING_INTERVAL / 1000;
let PLAYER_ACCELERATION = 25 * REFRESHING_INTERVAL / 1000;
let MIN_ENEMY_SPEED = 5 * REFRESHING_INTERVAL / 1000;
let MAX_ENEMY_SPEED = 50 * REFRESHING_INTERVAL / 1000;

let NUM_START_ENEMIES = 100;
let PROB_OF_NEW_ENEMY = 0.2;

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
}

class Enemy {
  constructor(x, y, radius, color, velx, vely) {
    this.radius = radius;
    this.color = color;
    this.x = x;
    this.y = y;
    this.velx = velx;
    this.vely = vely;
  }
  update(){
    var context = gameArea.context;
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
  }
  makeMove() {
    this.x += this.velx;
    this.y += this.vely;

  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.velx = 0;
    this.vely = 0;
    this.angle = Math.PI / 2;
  }
  update() {
    drawTriangle("black", this.x, this.y, this.angle);
  }
  makeMove() {
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
    var alpha = Math.atan2(cursor.y - player.y, player.x - cursor.x) + Math.PI / 2;
    player.angle = alpha;
    player.update();
  }
}

class Bullet {
  constructor(x, y, velx, vely, angle) {
    this.x = x;
    this.y = y;
    this.velx = velx + BULLET_DEFAULT_SPEED * Math.sin(angle - Math.PI);
    this.vely = vely + BULLET_DEFAULT_SPEED * Math.cos(angle - Math.PI);
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

  //initialize enemies
  for (var i = 0; i < NUM_START_ENEMIES; i++) {
    enemies.push(createRandomEnemy());
  }

  //initialize players
  player = new Player(gameArea.canvas.width / 2, gameArea.canvas.height / 2);
  
  //initialize frame refreshing
  gameArea.start();
}

function updateGameArea() {
  //clear canvas
  gameArea.clear();

  //move everything
  for(i = 0; i < enemies.length; i++) {
    enemies[i].makeMove();
  }
  player.makeMove();
  for(i = 0; i < bullets.length; i++) {
    bullets[i].move();
  }

  //add new enemy with some probability
  if(Math.random() < PROB_OF_NEW_ENEMY) enemies.push(createRandomEnemy());

  
  //removing elements out of game area, redrawing everything
  enemies = enemies.filter(isInGameArea);
  for(i = 0; i < enemies.length; i++) {
    enemies[i].update();
  }
  bullets = bullets.filter(isInGameAreaBullet)
  for(i = 0; i < bullets.length; i++) {
    bullets[i].update();
  }
  player.pointPlayerToCursor();

}


function drawTriangle(color, x, y, angle) {
  var context = gameArea.context;
  context.fillStyle = color;
  context.beginPath();
  context.moveTo(x, y);
  context.lineTo(x + 50 * Math.sin(angle + Math.PI / 10), y + 50 * Math.cos(angle + Math.PI / 10));
  context.lineTo(x + 50 * Math.sin(angle - Math.PI / 10), y + 50 * Math.cos(angle - Math.PI / 10));
  context.fill();
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

startGame();

gameArea.canvas.addEventListener("mousemove",  updateCursor);
gameArea.canvas.addEventListener("click", shoot);
document.addEventListener("keydown", (e) => {
  if      (e.code === "ArrowUp"    || e.code == "KeyW") player.vely -= PLAYER_ACCELERATION; 
  else if (e.code === "ArrowDown"  || e.code == "KeyS") player.vely += PLAYER_ACCELERATION;
  if      (e.code === "ArrowLeft"  || e.code == "KeyA") player.velx -= PLAYER_ACCELERATION; 
  else if (e.code === "ArrowRight" || e.code == "KeyD") player.velx += PLAYER_ACCELERATION;
})