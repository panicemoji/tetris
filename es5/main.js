"use strict";

var canvas = document.getElementById('tetris');
var ctx = canvas.getContext('2d');
ctx.scale(canvas.width / 10, canvas.width / 10);
ctx.fillStyle = '#d8d8d8';
ctx.fillRect(0, 0, canvas.width, canvas.height);
var playerScoreDisplay = document.getElementById('playerScore');

function arenaSweep() {
  var additionalScore = 0;

  outer: for (var y = arena.length - 1; y > 0; --y) {
    for (var x = 0; x < arena[y].length; ++x) {
      if (arena[y][x] === 0) {
        continue outer;
      }
    }

    var row = arena.splice(y, 1)[0].fill(0);
    arena.unshift(row);
    ++y;
    additionalScore += 100;

    if (additionalScore == 400) {
      additionalScore = 800;
    }
  }

  player.score += additionalScore;
  playerScoreDisplay.innerHTML = player.score;
}

function collides(arena, player) {
  var _ref = [player.piece, player.pos],
      m = _ref[0],
      o = _ref[1];

  for (var y = 0; y < m.length; ++y) {
    for (var x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }

  return false;
}

function createMatrix(w, h) {
  var matrix = [];

  while (h--) {
    matrix.push(new Array(w).fill(0));
  }

  return matrix;
}

function createPiece(type) {
  if (type == 't') {
    return [[0, 0, 0], [1, 1, 1], [0, 1, 0]];
  } else if (type == 'o') {
    return [[2, 2], [2, 2]];
  } else if (type == 'l') {
    return [[0, 3, 0], [0, 3, 0], [0, 3, 3]];
  } else if (type == 'j') {
    return [[0, 4, 0], [0, 4, 0], [4, 4, 0]];
  } else if (type == 'i') {
    return [[0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0], [0, 5, 0, 0]];
  } else if (type == 's') {
    return [[0, 6, 6], [6, 6, 0], [0, 0, 0]];
  } else if (type == 'z') {
    return [[7, 7, 0], [0, 7, 7], [0, 0, 0]];
  }
}

function draw() {
  ctx.fillStyle = '#d8d8d8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPiece(arena, {
    x: 0,
    y: 0
  });
  drawPiece(player.piece, player.pos);
}

function drawPiece(piece, offset) {
  piece.forEach(function (row, y) {
    row.forEach(function (value, x) {
      if (value != 0) {
        ctx.fillStyle = colourmap[value];
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
        ctx.strokeStyle = '#d8d8d8';
        ctx.lineWidth = 0.15;
        ctx.strokeRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

function merge(arena, player) {
  player.piece.forEach(function (row, y) {
    row.forEach(function (value, x) {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function playerDrop() {
  player.pos.y++;

  if (collides(arena, player) == true) {
    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
  }

  dropCounter = 0;
}

function playerMove(dir) {
  player.pos.x += dir;

  if (collides(arena, player)) {
    player.pos.x -= dir;
  }
}

function playerRotate(dir) {
  var pos = player.pos.x;
  var offset = 1;
  rotate(player.piece, dir);

  while (collides(arena, player)) {
    player.pos.x += offset;
    offset = -offset + (offset > 0 ? 1 : -1);

    if (offset > player.piece[0].length) {
      rotate(player.piece, -dir);
      player.pos.x = pos;
      return;
    }
  }
}

var pieces = ['i', 'l', 'j', 'o', 't', 's', 'z'];

function playerReset() {
  if (player.pieceType == null) {
    var newPieceType = pieces[pieces.length * Math.random() | 0];
    player.pieceType = newPieceType;
    player.piece = createPiece(newPieceType);
    player.pieceType = newPieceType;
  }

  console.log(pieces.indexOf(player.pieceType, 0));
  pieces.splice(pieces.indexOf(player.pieceType), 1);

  if (pieces.length == 0) {
    pieces = ['i', 'l', 'j', 'o', 't', 's', 'z'];
    pieces.splice(pieces.indexOf(newPieceType), 1);
  }

  newPieceType = pieces[pieces.length * Math.random() | 0];
  player.piece = createPiece(newPieceType);
  player.pieceType = newPieceType;
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.piece[0].length / 2 | 0);

  if (collides(arena, player)) {
    //arena.forEach(row => row.fill(0));
    dropInterval = 10000000000000000000000000000000000;
  }
}

function rotate(piece, dir) {
  for (var y = 0; y < piece.length; ++y) {
    for (var x = 0; x < y; ++x) {
      var _ref2 = [piece[y][x], piece[x][y]];
      piece[x][y] = _ref2[0];
      piece[y][x] = _ref2[1];
    }
  }

  if (dir > 0) {
    piece.forEach(function (row) {
      return row.reverse();
    });
  } else {
    piece.reverse();
  }
}

var dropCounter = 0;
var dropInterval = 600;
var lt = 0;

function update(time) {
  if (time === void 0) {
    time = 0;
  }

  var dt = time - lt;
  lt = time;
  dropCounter += dt;

  if (dropCounter > dropInterval) {
    playerDrop();
  }

  draw();
  requestAnimationFrame(update);
}

var arena = createMatrix(10, 20);
var colourmap = [null, '#d8273b', '#f79336', '#f7e335', '#3fc151', '#59c4cc', '#c4a9d8', '#723163'];
var player = {
  pos: {
    x: 0,
    y: 0
  },
  piece: null,
  pieceType: null,
  score: 0
};
document.addEventListener('keydown', function (event) {
  if (event.keyCode == 37) {
    playerMove(-1);
  } else if (event.keyCode == 39) {
    playerMove(1);
  } else if (event.keyCode == 40) {
    playerDrop();
  } else if (event.keyCode == 90) {
    playerRotate(-1);
  } else if (event.keyCode == 88) {
    playerRotate(1);
  }
});
playerReset();
update();