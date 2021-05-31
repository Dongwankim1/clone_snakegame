const BG_COLOR = '#231f20';
const SNAKE_COLOR = "#c2c2c2";
const FOOD_COLOR = "#e66916";


const gameScreen = document.getElementById('gameScreen');

let canvas,ctx;

const gameState ={
    player:{
        pos:{
            x:3,
            y:10
        },
        vel:{
            x:1,
            y:0,
        },
        snake:[
            {x:1,y:10},
            {x:2,y:10},
            {x:3,y:10},
        ],
    },
    food:{
        x:7,
        y:7,
    },
    gridsize:20,
}

function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 600;

    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    document.addEventListener('keydown',keydown);
}

function keydown(e){
    console.log(e.keyCode);

}

init();