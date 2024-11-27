//selecting canvas
const canvas = document.getElementById("Game");
const context = canvas.getContext("2d");

//draw rectangle funct
function drawRect(x,y,w,h,color){
    context.fillStyle = color
    context.fillRect (x,y,w,h)
}
//making canvas
// drawRect(0,0,400,600); 
//computer paddle
const com = {
    x: canvas.width/2-50/2,
    y: 10,
    width: 50,
    height: 10,
    color: "white",
    score: 0
}
// drawRect(com.x,com.y,com.width,com.height,com.color);
//user paddle
const user = {
    x: canvas.width/2-50/2,
    y: canvas.height-10-10,
    width: 50,
    height: 10,
    color: "white",
    score: 0
}
// drawRect(user.x,user.y,user.width,user.height,user.color);

//center line
function centerLine(){
    context.beginPath()
    context.setLineDash([8]) //will make the line of length 8
    context.moveTo(0,canvas.height/2) // starting point 
    context.lineTo(canvas.width,canvas.height/2) //ending point
    context.strokeStyle = "White"
    context.stroke() 
}
// centerLine();
//for ball
function drawCircle(x,y,r,color){
    context.fillStyle = color
    context.beginPath()
    context.arc(x,y,r,0,Math.PI*2,false) // for drawing circle
    context.closePath()
    context.fill()
}
//creating ball
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    radius: 10,
    speed: 1,
    velocityX: 5,
    velocityY: 5,
    color: "white"
}
// drawCircle(ball.x,ball.y,ball.radius,ball.color);

//scores
function drawText(text,x,y,color){
    context.fillStyle = color
    context.font = "32px josefin sans"
    context.fillText(text,x,y)
}
// drawText(com.score,20,canvas.height/2-30)
// drawText(user.score,20,canvas.height/2+50)

//render the game
function render(){
    //making canvas
    drawRect(0,0,400,600,"Black");
    //cmp paddle
    drawRect(com.x,com.y,com.width,com.height,com.color);
    //user paddle
    drawRect(user.x,user.y,user.width,user.height,user.color);
    //center line
    centerLine();
    //for ball
    drawCircle(ball.x,ball.y,ball.radius,ball.color);
    //scores cmp and user 
    drawText(com.score,20,canvas.height/2-30)
    drawText(user.score,20,canvas.height/2+50)
}
// render();
//updating coordinates of ball
// control the user paddle
canvas.addEventListener("mousemove",movepaddle);
function movepaddle(e){
    let rect = canvas.getBoundingClientRect();
    user.x = e.clientX-rect.left-user.width/2;
}
//collision detection
function collision(b,p){
    //b = ball, p = player
    b.top = b.y-b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x-b.radius;
    b.right = b.x+b.radius;

    p.top = p.y;
    p.bottom = p.y+p.height;
    p.left = p.x;
    p.right = p.x+p.width;

    return p.right>b.left && p.left<b.right && b.bottom>p.top && b.top<p.bottom;
}
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;

    ball.speed = 1;
    ball.velocityY = -ball.velocityY;
}
//game over function
function ShowGameOver(){
    //hide canvas
    canvas.style.display = "none";
    const can = document.getElementById("can");
    can.style.display = "none";

    //container
    const result = document.getElementById("result");
    result.style.display = "block";
}
function update(){
    ball.x += ball.velocityX*ball.speed;
    ball.y += ball.velocityY*ball.speed;
    //for cmp paddle
    let computerLevel = 0.1;
    com.x += (ball.x - (com.x + com.width/2))+computerLevel;
    if(ball.speed>2){
        com.x += ball.x+100;
    }
    //for reflection from ball
    if(ball.x+ball.radius > canvas.width || ball.x-ball.radius<0){
        ball.velocityX = -ball.velocityX;
    }
    //in case of collision
    let player = (ball.y<canvas.height/2) ? com : user;
    if(collision(ball,player)){
        ball.velocityY = - ball.velocityY;
        ball.speed += 0.1;
    }

    //to update score
    if(ball.y-ball.radius<0){
        user.score++;
        resetBall();
    }
    else if(ball.y+ball.radius>canvas.height){
        com.score++;
        resetBall();
    }
    //game over
    if(user.score>4 || com.score>4){
        clearInterval(loop);
        ShowGameOver();
    }

}
//start the game
function start(){
    update();
    render();
}
//loop
const loop = setInterval(start,1000/40)