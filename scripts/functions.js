const simonSays = [];
const userSays = [];

function generateNumbers(){
    simonSays.length = 0;
    let number;
    while(simonSays.length < 5){
        number = Math.floor(Math.random() * 100) + 1;
        simonSays.push(number);
    }
    for(let i = 0; i < simonSays.length; i++){
        const currentValue = simonSays[i];
        const inputElem = document.querySelector(`#number-${i+1}`);
        inputElem.value=currentValue;
    }
}

function formSubmitHandler(event){
    event.preventDefault();
    for(let i = 0; i<simonSays.length; i++){ 
        const inputElem = document.querySelector(`#number-${i+1}`);
        const currentValue = inputElem.value; 
        // Mi fido direttamente di quello che sto prendendo, 
        // perché è un value che viene da un input di tipo number, 
        // quindi sicuramente è una stringa contenente un numero
        userSays.push(Number(currentValue));
    }
}