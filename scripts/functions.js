const simonSays = [];

function generateNumbers(){
    simonSays.length = 0;
    let number;
    while(simonSays.length() < 5){
        number = Math.floor(Math.Random * 100) + 1;
        simonSays.push(number);
    }
}