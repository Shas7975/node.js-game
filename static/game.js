socket.on('message', function(data) {
  console.log(data);
});

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
function drawImageRot(img,x,y,width,height,angle){

  //Convert degrees to radian
  var rad = angle;

  //Set the origin to the center of the image
  context.translate(x + width / 2, y + height / 2);

  //Rotate the canvas around the origin
  context.rotate(rad);

  //draw the image
  context.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);

  //reset the canvas
  context.rotate(rad * ( -1 ) );
  context.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}

function drawObstacles(obstacles){
  for(var i = 0; i < obstacles.length; ++i){
    var img = document.getElementById('obstacle1');
    drawImageRot(img, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height, 0);
  }
}

function drawPowerups(powerups){
  for(var i = 0; i < powerups.length; ++i){
    var pUp = powerups[i];
    var img = document.getElementById(pUp.type);
    drawImageRot(img, pUp.x, pUp.y, pUp.width, pUp.height, 0);
  }
}

function drawPlayerHealth(player){
  var imgName = 'health';
  imgName += player.health; //append health number to load correct image

  var img = document.getElementById(imgName);
  drawImageRot(img, player.x, player.y - 20, player.width, 10, 0);
}

function appendScores(players){
  var tBody = document.createElement('tbody');

  for(var id in players) {
    var player = players[id];
    var row = document.createElement("tr");
    var playerName = document.createElement("td");
    var playerScore = document.createElement("td");
    playerName.classList.add("scoretd");
    playerScore.classList.add("scoretd");
    var name = document.createTextNode(player.name);
    var score = document.createTextNode(player.score);

    playerName.appendChild(name);
    playerScore.appendChild(score);
    row.appendChild(playerName);
    row.appendChild(playerScore);
    row.style.color = player.color;
    tBody.appendChild(row);
  }

  return tBody;
}

function displayScore(players){
  var scoreboard = document.getElementById("scoreboard");
  var oldTbody = scoreboard.getElementsByTagName('tbody')[0];
  var newTbody = document.createElement('tbody');
  newTbody.classList.add('score');
  newTbody = appendScores(players);
  scoreboard.replaceChild(newTbody, oldTbody);
}

var controls = {
  up: false,
  down: false,
  left: false,
  right: false,
  shoot: false
};

canvas.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      controls.left = true;
      break;
    case 87: // W
      controls.up = true;
      break;
    case 68: // D
      controls.right = true;
      break;
    case 83: // S
      controls.down = true;
      break;
    case 37: // left arrow
      controls.left = true;
      break;
    case 38: // up arrow
      controls.up = true;
      break;
    case 39: // right arrow
      controls.right = true;
      break;
    case 40: // down arrow
      controls.down = true;
      break;
    case 32: //spacebar
      controls.shoot = true;
      break;
  }
});
canvas.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      controls.left = false;
      break;
    case 87: // W
      controls.up = false;
      break;
    case 68: // D
      controls.right = false;
      break;
    case 83: // S
      controls.down = false;
      break;
    case 37: // left arrow
      controls.left = false;
      break;
    case 38: // up arrow
      controls.up = false;
      break;
    case 39: // right arrow
      controls.right = false;
      break;
    case 40: // down arrow
      controls.down = false;
      break;
    case 32: // Spacebar
      controls.shoot = false;
      break;

  }
});
socket.emit('new player');

setInterval(function() {
  socket.emit('controls', controls);
}, 1000 / 60);

socket.on('state', function(players, projectiles, obstacles, powerups, xMax, yMax) {
  canvas.width = xMax;
  canvas.height = yMax;
  context.fillStyle='#f4f4f4';
  context.fillRect(0, 0, xMax, yMax);
  drawObstacles(obstacles);
  drawPowerups(powerups);
  displayScore(players);
  for (var id in players) {
    var player = players[id];
    if(player.dead == 0) { //player is not dead
      var tank = document.getElementById(player.color);
      drawImageRot(tank, player.x, player.y, 40, 40, player.angle);
      drawPlayerHealth(player);
    }
    else{//player's tank was destroyed, display explosion
      var explosion;
      switch(true){ //gross but works
        case (player.dead >= 32):
          explosion = document.getElementById('explosion9');
          break;
        case (player.dead < 36 *8/9 && player.dead >= 36 * 7/9):
          explosion = document.getElementById('explosion8');
          break;
        case (player.dead < 36 *7/9 && player.dead >= 36 * 6/9):
          explosion = document.getElementById('explosion7');
          break;
        case (player.dead < 36 *6/9 && player.dead >= 36 * 5/9):
          explosion = document.getElementById('explosion6');
          break;
        case (player.dead < 36 *5/9 && player.dead >= 36 * 4/9):
          explosion = document.getElementById('explosion5');
          break;
        case (player.dead < 36 *4/9 && player.dead >= 36 * 3/9):
          explosion = document.getElementById('explosion4');
          break;
        case (player.dead < 36 *3/9 && player.dead >= 36 * 2/9):
          explosion = document.getElementById('explosion3');
          break;
        case (player.dead < 36 *2/9 && player.dead >= 36 * 1/9):
          explosion = document.getElementById('explosion2');
          break;
        case (player.dead < 36 *1/9 && player.dead > 0):
          explosion = document.getElementById('explosion1');
          break;
        default:
          explosion = explosion = document.getElementById('explosion1');
          break;
      }
      drawImageRot(explosion, player.x, player.y, 40, 40, player.angle);
    }
  }
  for(var i = 0; i < projectiles.length; ++i){
    var proj = projectiles[i];
    context.fillStyle=proj.color;
    context.fillRect(proj.x, proj.y, 5, 5);
  }
});
