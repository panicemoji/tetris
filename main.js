var canvas = document.getElementById('tetris');
var ctx = canvas.getContext('2d');
ctx.scale(canvas.width/10,canvas.width/10);
ctx.fillStyle = '#d8d8d8';
ctx.fillRect(0,0,canvas.width,canvas.height);

var matrix = [
    [0,0,0],
    [1,1,1],
    [0,1,0],

]

function draw(){
    ctx.fillStyle = '#d8d8d8';
ctx.fillRect(0,0,canvas.width,canvas.height);
    drawPiece(player.piece,player.pos);
}


function drawPiece(piece,offset){
    piece.forEach((row, y)=>{
        row.forEach((value,x)=>{
            if (value!=0){
                ctx.fillStyle = 'blue';
                ctx.fillRect(x + offset.x ,y + offset.y,1,1);
            }
        })
    })
}

function playerDrop(){
    player.pos.y++;
    dropCounter=0;
}

var dropCounter = 0;
var dropInterval = 1000;
var lt = 0;
function update(time=0){
    var dt = time - lt;
    lt = time;
    dropCounter += dt;
    if(dropCounter>dropInterval){
        playerDrop()
    }
    draw()
    requestAnimationFrame(update);
}

var player = {
    pos : {x:7,y:-1},
    piece : matrix
}

document.addEventListener('keydown',event =>{
    if(event.keyCode == 37){
        player.pos.x--;
    }
    else if(event.keyCode == 39){
        player.pos.x++;
    }
    else if(event.keyCode == 40){
        playerDrop()
    }
});

update();