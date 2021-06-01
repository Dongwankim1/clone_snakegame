const io = require('socket.io')({
    cors:{
        origin:["http://localhost:5000","https://localhost:5000"],
        mathods:["GET","POST"], 

    }
});
const {initGame,gameLoop,getUpdatedVelocity} = require('./game');
const {makeid} = require('./utils')
const {FRAME_RATE} = require('./constants');

const state ={};
const clientRooms = {};


io.on('connection',client =>{
    // const state =createGameState();

    client.on('keydown',handleKeydown);
    client.on('newGame',handleNewGame);
    client.on('joinGame',handleJoinGame);
    function handleJoinGame(gameCode){
        const room = io.of("/").adapter.rooms.get(gameCode);

        let allUsers;
        if(room){
            allUsers = room;
        }

        let numClients = 0;
        if(allUsers){
            numClients = allUsers.size;

        }

        if(numClients ===0){
            client.emit('unknownGame');
            return;
        }else if(numClients>1){
            client.emit('tooManyPlayers');
            return;
        }

        clientRooms[client.id] = gameCode;

        client.join(gameCode);
        client.number =2;
        client.emit('init',2);
        startGameInterval(gameCode);
    }

    function handleNewGame(){
        let roomName = makeid(5);
        console.log('roomName ------',roomName)
        clientRooms[client.id] = roomName;
        client.emit('gameCode',roomName);

        state[roomName] = initGame();

        client.join(roomName);
        client.number = 1;
        client.emit('init',1);
    }

    function handleKeydown(keyCode){
        const roomName = clientRooms[client.id];

        if(!roomName){
            return;
        }

        try{
            keyCode = parseInt(keyCode);

        }catch(e){
            console.error(e);
            return;
        }

        const vel = getUpdatedVelocity(keyCode);
        if(vel){
            state[roomName].players[client.number-1].vel =vel;
        }
    }

   
});

function startGameInterval(roomName){
    
    const intervalId = setInterval(()=>{
        const winner = gameLoop(state[roomName]);
        console.log(winner);
        if(!winner){
            emitGameState(roomName,state[roomName]);
        }else{
            emitGameOver(roomName,winner);
            state[roomName] = null;
            clearInterval(intervalId);
        }

    },1000/FRAME_RATE);


}

function emitGameState(roomName,state){
  
    io.sockets.in(roomName).emit('gameState',JSON.stringify(state));

}

function emitGameOver(roomName,winner){
    console.log("asdqwd",clientRooms);
    io.sockets.in(roomName).emit('gameOver',JSON.stringify({winner}));

}



io.listen(3000);