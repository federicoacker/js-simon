const simonSays = [];
const userSays = [];
let time = 10;
let timerId;

function generateNumbers(){
    simonSays.length = 0;
    let number;
    while(simonSays.length < 5){
        number = Math.floor(Math.random() * 100) + 1;
        if(!simonSays.includes(number)){
            simonSays.push(number);
        }
    }
    for(let i = 0; i < simonSays.length; i++){
        const currentValue = simonSays[i];
        const inputElem = document.querySelector(`#number-${i+1}`);
        inputElem.value=currentValue;
    }
    startTimer();
}

function timerHandler(){
    const timerElem = document.querySelector(".timer");
    timerElem.innerText = --time;
    if(time === 0){
        timerElem.innerText = 0;
        clearInterval(timerId);
        clearFields();
    }
}

function startTimer(){
    timerId = setInterval(timerHandler, 1 * 1000);
}

function clearFields(){
    for(let i = 0; i < simonSays.length; i++){
        const inputElem = document.querySelector(`#number-${i+1}`);
        inputElem.value = "";
    }
}

function formSubmitHandler(event){
    event.preventDefault();
    for(let i = 0; i<simonSays.length; i++){ 
        const inputElem = document.querySelector(`#number-${i+1}`);
        const currentValue = inputElem.valueAsNumber; 
        // Mi fido direttamente di quello che sto prendendo, 
        // perché è un value che viene da un input di tipo number, 
        // quindi sicuramente è o un numero, o un NaN
        // Facciamo giusto il controllo per il NaN
        if(!isNaN(currentValue)){
            userSays.push(Number(currentValue));
        }
    }
    if(validateFields() === -1){
        return;
    }
    checkNumbers();
}
function validateFields(){
    let userError = false;
    if(userSays.length !== simonSays.length){
        for(let i = 0; i < simonSays.length; i++){
            const inputElem = document.querySelector(`#number-${i+1}`);
            const currentValue = inputElem.valueAsNumber;
            const inputErrorElem = document.querySelector(`#number-${i+1}-help`);
            if(isNaN(currentValue)){
                inputErrorElem.classList.contains("d-none") && inputErrorElem.classList.remove("d-none");
                inputErrorElem.innerText = "Non hai inserito un valore, anche se non lo ricordi, tanto vale tentare!";
                userError = true;
            }
            else{
                !inputErrorElem.classList.contains("d-none") && inputErrorElem.classList.remove("d-none");
                inputErrorElem.innerText = "";
            }
        }
    }
    else{
        
    }
    if(userError){
        return -1;
    }
}

function checkNumbers(){
    const userRight = [];
    for(let i = 0; i < userSays.length; i++){
        const currentValue = userSays[i];
        if(simonSays.includes(currentValue)){
            userRight.push(currentValue);
        }
    }
    const resultElem = document.querySelector(".result");
    resultElem.classList.remove("d-none");
    resultElem.children[0].innerText = `Hai indovinato ${userRight.length} numeri! (${userRight.join(", ")})`;
    resetField();
}

function resetField(){
    const timerElem = document.querySelector(".timer");
    time = 30;
    timerElem.value = time;
    generateNumbers();
}