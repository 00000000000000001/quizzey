function Karte ( frage, antworten, richtige_antwort) {
    this.frage = frage;
    this.antworten = antworten;
    this.richtige_antwort = richtige_antwort;
}

const k1 = new Karte('Wofür steht die Abkürzung SDG?', 
    [
        'Deine Oma', 
        'Koks im Walde', 
        'Sustainable Developement Goals', 
        'Ich bin ein Riesendinosaurier'
    ], 2);
const k2 = new Karte('Welcher Tag ist heute?', 
    [
        'Keine Ahnung', 
        'Weihnachten', 
        'der 9te', 
        'Lass mich, will Kaffee'
    ], 3);
const k3 = new Karte('Wie findest du Tests?', 
    [
        'Gut', 
        'Schlecht', 
        'Geht so', 
        'Geht wie?'
    ], 3);

let stapel = [k1, k2, k3];

let aktuelle_frage = {};

const buchstaben = ['A', 'B', 'C', 'D'];

function mischen( arr ) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function aufdecken( stapel ) {
    // Wenn keine Fragen übrig sind, dann ist das Game over
    if (stapel.length === 0) {
        let karte = document.getElementById('Karte');
        karte.textContent = 'Game leider over!';
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

function beantworten( antwort ) {
    // Bei richtiger Antwort:
    if (antwort === aktuelle_frage.richtige_antwort) {
		 document.getElementById('rightwrong').innerHTML = "Right answer!";
        // alert("Richtig");
    }
    // Bei falscher Antwort:
    else {
        const richtig = aktuelle_frage.richtige_antwort;
        document.getElementById('rightwrong').innerHTML = (`Wrong! The right answer wouldve been ${buchstaben[richtig]} :  "${aktuelle_frage.antworten[richtig]}"`);
    }
    aufdecken(stapel);
}

// Ablauf

// 1. Kartenstapel mischen
mischen(stapel);
// 2. Nächste Frage stellen
aufdecken(stapel);