// VARIABILI GLOBALI //
const btnElem = document.querySelector("form button"); // Elemento del bottone, per disabilitarlo mentre c'è il countdown
const simonSays = []; // Array che verrà generato dal computer
const userSays = []; // Array che sarà popolato dall'utente
let time = 30; // Timer
let timerId; // Id del setInterval che gestisce il timer

// FUNZIONI // 

// Funzione che genera i numeri
function generateNumbers() { 
    simonSays.length = 0; // Resettiamo a 0 la lunghezza dell'array dei valori generati, per resettarlo
    let number; // Variabile di supporto
    while (simonSays.length < 5) { // Finché l'array non è pieno
        number = Math.floor(Math.random() * 100) + 1; // Calcola un numero random
        if (!simonSays.includes(number)) { // Controlla che non sia già nell'array
            simonSays.push(number); // Se non lo è, pushalo
        }
    }
    for (let i = 0; i < simonSays.length; i++) { // Alla fine, scorri l'array dei numeri generati dal computer
        const currentValue = simonSays[i]; // Variabile di supporto
        const inputElem = document.querySelector(`#number-${i + 1}`); // Agganciati all'input field con id "number-1" "number-2" e così via
        inputElem.value = currentValue; // Popola il suo value dall'array
    }
    startTimer(); // Starta il timer
}

//Funzione timerHandler che viene data alla WEB API per essere inserita in queue ogni 1 secondo
function timerHandler() { 
    const timerElem = document.querySelector(".timer"); //Agganciamoci al <p> dove mostro il timer all'utente
    timerElem.innerText = --time; // Decrementiamo la variabile time e diamo il suo valore al tag <p>
    if (time === 0) { // Se il valore della variabile time è === 0
        timerElem.innerText = 0; // Settiamo il valore interno a 0
        clearInterval(timerId); // Cleariamo l'intervallo dalla WEB API
        clearFields(); // Chiamiao la funzione clearFields()
        btnElem.disabled = false; // Riabilitiamo il pulsante della form
    }
}

//Funzione che starta il timer
function startTimer() { 
    btnElem.disabled = true; // Disabilita il bottone della form
    timerId = setInterval(timerHandler, 1 * 1000); // Fai un bel setInterval dando la funzione timerHandler come callback da eseguire in un mondo perfetto, ogni 1 secondo.
}

//Funzione che pulisce le input fields
function clearFields() {
    for (let i = 0; i < simonSays.length; i++) { // Semplicemente, itera la lunghezza dell'array dei numeri generati, sapendo che ci sarà 1 input field per ogni numero generato
        const inputElem = document.querySelector(`#number-${i + 1}`); // Si prende quella input field
        inputElem.value = ""; // Ne setta il valore a ""
    }
}

//Funzione Handler per il submit della form
function formSubmitHandler(event) {
    event.preventDefault(); //Innanzitutto blocchiamo il comportamento default del submit
    userSays.length = 0; // Settiamo la lunghezza dell'array utente a 0
    for (let i = 0; i < simonSays.length; i++) { // Iteriamo la lunghezza dell'array del computer (sapendo che è la stessa quantità di input fields)
        const inputElem = document.querySelector(`#number-${i + 1}`); // Agganciamoci ad una input field alla volta
        const currentValue = inputElem.valueAsNumber; // Estraiamo il valore e salviamolo in currentValue
        // Mi fido direttamente di quello che sto prendendo, 
        // perché è un value che viene da un input di tipo number, 
        // quindi sicuramente è o un numero, o un NaN
        // Facciamo giusto il controllo per il NaN
        if (!isNaN(currentValue)) { // Se esso non è NaN
            userSays.push(Number(currentValue)); // Lo mettiamo nell'array userSays
        }
    }
    if (validateFields() === -1) { // A questo punto, delego la validazione ad un'altra funzione
        return; // Se la funzione mi ha restituito -1 che è il mio codice d'errore, esco dall'handler, interrompo l'esecuzione
    }
    checkNumbers(); // Se la validazione è andata, delego il continuo del programma alla funzione che guarderà quanti numeri ho azzeccato
}

// Funzione che valida i campi di input dopo che abbiamo premuto "Prova"
function validateFields() {
    let userError = false; // Flag che deciderà se andiamo avanti o meno col programma
    if (userSays.length !== simonSays.length) { //Innanzitutto, se l'array utente non ha la stessa lunghezza dell'array computer
        userError = checkEmpty(); // Chiamiamo la funzione checkEmpty() che andrà a controllare quali field l'utente non ha inserito e glielo segnalerà
        // Ci restituisce true o false
    }
    else { // Altrimenti
        userError = checkDuplicate(); // Controlliamo se ci siano duplicati al suo interno
    }
    if (userError) { // In ogni caso se c'è un errore dell'utente
        return -1; // Restituisci codice d'errore
    }
}

//Funzione che si occupa di gestire i div dove mostro errori
function notifyError(index, flag, error="") {
// Accetta l'indice (per sapere a quale div agganciarsi), 
// una flag (true o false) per sapere se mettere o togliere un errore 
// e il messaggio di errore, error che di default è ""
    const inputErrorElem = document.querySelector(`#number-${index + 1}-help`); //Agganciamoci al div da modificare
    if (flag) { // Se true, allora dobbiamo aggiugnere l'errore
        inputErrorElem.classList.contains("d-none") && inputErrorElem.classList.remove("d-none"); // Vediamo se la classList del div contiene d-none, e se lo contiene, lo togliamo
        inputErrorElem.innerText = error; // Settiamo l'innerText all'errore che ci è stato passato
    }
    else {// Altrimenti false, nascondiamo l'errore
        !inputErrorElem.classList.contains("d-none") && inputErrorElem.classList.add("d-none"); // Se la classList del div non contiene già "d-none" allora lo aggiungiamo
        inputErrorElem.innerText = ""; // Settiamo l'innerText a ""
    }
}

//Funzione che controlla quali field sono vuote
function checkEmpty(){
    let userError = false; // la flag true o false che verrà ritornata alla fine di questa funzione
    for (let i = 0; i < simonSays.length; i++) { // Scorriamo l'array, in realtà, sempre perché sappiamo che il numero di input è uguale al numero di valori generati
            const inputElem = document.querySelector(`#number-${i + 1}`); // Agganciamoci all'input i-esimo + 1 (perché gli indici negli id li ho fatti partire da 1)
            const currentValue = inputElem.valueAsNumber; // Prendiamoci il valore all'interno come Number

            if (isNaN(currentValue)) { // Se è NaN allora la field è stata lasciata vuota (ricordiamo che sono input di tipo number)
                notifyError(i, true, "Non hai inserito un valore, anche se non lo ricordi, tanto vale tentare!"); // Chiamiamo la funzione che gestisce gli errori
                userError = true; // Settiamo la flag a true
            }
            else { // Altrimenti non è NaN
                notifyError(i, false); // Resettiamo il messaggio di errore sotto la field a vuoto
            }
    }
    return userError; // Ritorniamo la flag che ci comunica che c'è uno user error
}

//Funzione che controlla se ci sono duplicati
function checkDuplicate() {
    let userError = false // la flag true o false che verrà ritornata alla fine di questa funzione
    for (let i = 0; i < userSays.length; i++) { // Scorriamo l'array degli input utente, ricordiamo, esso è stato popolato prima dalla funzione handler del submit
        let duplicateFound = false; // Flag che viene inizializzata per ogni valore dell'array, true o false per dirci se abbiamo trovato un duplicato
        const currentValue = userSays[i]; // Il valore corrente

        for (let j = 0; j < userSays.length && !duplicateFound; j++) { // Iteriamo di nuovo tutto l'array
            const checkingValue = userSays[j]; // Valore contro cui facciamo il controllo
            if (currentValue === checkingValue && i !== j) { // Se i due valori sono uguali ma non lo sono anche gli indici
                duplicateFound = true; // Allora abbiamo trovato un duplicato, cosa che ci fa uscire dal ciclo
                notifyError(i, true, "Hai inserito 2 o più volte lo stesso numero"); // Chiamiamo la funzione che gestisce il display degli errori
                userError = true; // Settiamo la flag per lo user error a true
            }
            else { // Altrimenti
                notifyError(i, false); // Resettiamo il display dell'errore sotto la input field corrente a vuota
            }
        }
    }
    return userError; // Ritorniamo la flag che ci comunica che c'è uno user error
}

//Funzione che controlla quanti numeri ho azzeccato
function checkNumbers() { 
    const userRight = []; // Creiamo un'array in cui inseriamo tutti i valori in comune tra quello generato dal computer e quello popolato da me
    for (let i = 0; i < userSays.length; i++) { // Scorriamo l'array popolato da me
        const currentValue = userSays[i]; // Salviamoci il valore corrente
        if (simonSays.includes(currentValue)) { // Se l'array dei numeri generati include il valore corrente
            userRight.push(currentValue); // allora metti il valore corrente nell'array dei valori "azzeccati"
        }
    }
    const resultElem = document.querySelector(".result"); // Agganciamoci all'elemento dove mostrerò il risultato
    resultElem.classList.remove("d-none"); // Togliamo il "d-none" dalla classList di quell'elemento per renderlo visibile
    resultElem.children[0].innerText = `Hai indovinato ${userRight.length} numeri! ${userRight.join(", ")}`; // Settiamo il suo innerText al risultato
    resetField(); // Chiamiamo resetField per restartare il gioco
}

//Funzione che restarta il gioco
function resetField() {
    const timerElem = document.querySelector(".timer"); // Si aggancia al div del timer
    time = 30; // Setta la variabile time di nuovo a 30
    timerElem.innerText = time; // Setta L'innerText del timer di nuovo a 30
    generateNumbers(); // Chiama la funzione che genera i numeri, cosa che restarta l'intero gioco.
}