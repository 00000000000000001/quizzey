function Karte(frage, antworten, richtige_antwort) {
    this.frage = frage;
    this.antworten = antworten;
    this.richtige_antwort = richtige_antwort;
}

let stapel = [];

let aktuelle_frage = {};

let right = 0;
let wrong = 0;

const buchstaben = ['A', 'B', 'C', 'D'];

let kategorien = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
let beantwortet = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

// function mischen(arr) {
//     for (let i = arr.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [arr[i], arr[j]] = [arr[j], arr[i]];
//     }
//     return arr;
// }

function update_nav(){
    for (let i = 0; i < kategorien.length; i++) {
        let kat = document.getElementById('cat' + i);
        let num = kat.getElementsByClassName('number')[0];
        if (beantwortet[i] === kategorien[i]){
            num.innerHTML = 'OK';
        }else{
            num.innerHTML = beantwortet[i] + '/' + kategorien[i];
        }
        
    }
}

function init_nav(arr){
    // setup array
    for (let i = 0; i < arr.length; i++) {
        kategorien[arr[i].kategorie-1]++;
    }
    // Anzahl der Fragen pro Kategorie anzeigen
    update_nav();
}

// sucht nach der Frage mit der niedrigsten Kategorie ab Stelle l
function maxs(arr, l){
    let max = l;
    for (let i = l; i < arr.length; i++) {
        // console.log(arr[i].kategorie);
        // console.log(arr[min].kategorie);

        if (arr[i].kategorie > arr[max].kategorie){
            max = i;
        }
    }
    return max;
}

function sortieren(arr) {
    let min = 0;
    for (let i = 0; i < arr.length; i++) {
        let tmp = arr[i];
        min = maxs(arr, i);
        arr[i] = arr[min];
        arr[min] = tmp;
    }
    return arr;
}

function aufdecken(stapel) {
    // Wenn keine Fragen übrig sind, dann ist das Game over
    if (stapel.length === 0) {

        let karte = document.getElementById('Karte');
        if (right == 7) {
            karte.textContent = "Right answers: " + right + " You are a sustainable homie";
        } else if (wrong == 7) {
            karte.textContent = "All your answers were wrong! You should read and learn more about the SDGs! ";
        } else {
            karte.textContent = "Right answers: " + right + "  Wrong Answers: " + wrong;
        }

        aktuelle_frage = {};
        return;
    }

    aktuelle_frage = stapel.pop();

    // Frage anzeigen
    let p = document.getElementById('Frage');
    p.textContent = aktuelle_frage.frage;

    // Antworten anzeigen
    let a = document.getElementById('a');
    a.textContent = buchstaben[0] + ': ' + aktuelle_frage.antworten[0];

    let b = document.getElementById('b');
    b.textContent = buchstaben[1] + ': ' + aktuelle_frage.antworten[1];

    let c = document.getElementById('c');
    c.textContent = buchstaben[2] + ': ' + aktuelle_frage.antworten[2];

    let d = document.getElementById('d');
    d.textContent = buchstaben[3] + ': ' + aktuelle_frage.antworten[3];

}

function beantworten(antwort) {
    // Bei richtiger Antwort:
    if (antwort === aktuelle_frage.richtig) {
        document.getElementById('rightwrong').innerHTML = "Right answer!";
        right = ++right;
    }
    // Bei falscher Antwort:
    else {
        const richtig = aktuelle_frage.richtig;
        document.getElementById('rightwrong').innerHTML = (`Wrong! The right answer wouldve been ${buchstaben[richtig]} :  "${aktuelle_frage.antworten[richtig]}"`);
        wrong = ++wrong;
    }
    beantwortet[aktuelle_frage.kategorie-1]++;
    update_nav();
    aufdecken(stapel);
}

function fetch_json(filename) {
    return new Promise((resolve) => {
        fetch(filename).then(content => resolve(content.json()));
    });
}

async function start(file) {
    // Fragen sammeln
    const a = await fetch_json(file);
    for (const [key, value] of Object.entries(a)) {
        stapel.push(value);
        
    }
    
    // SpielAblauf
    // 1. Kartenstapel mischen
    sortieren(stapel);
    // 2. Kategorien initialisieren (linke goals-leiste)
    init_nav(stapel);
    // 3. Nächste Frage stellen
    aufdecken(stapel);
}

start('fragen.json');
