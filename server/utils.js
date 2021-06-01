module.exports ={
    makeid,
}

function makeid(length){
    var result ='';
    var characters = 'abcdefghijklnmopqrstuvwxyz';
    var charactersLength = characters.length;
    for(let i=0;i<length;i++){
        result += characters.charAt(Math.floor(Math.random()*charactersLength));
    }
    return result;
}