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

let cursor = 0;

// die Farben der einzelnen SDG's
const colors = ['#ec1629', '#d4a124', '#229c46', '#c41930', '#f03e27', '#00b0da', '#fdb80b', '#901135', '#f36d20', '#e20c85', '#f99e21', '#d08e25', '#46783c', '#007ebd', '#3bb247', '#00548c', '#113368'];

function changeColor(color) {
    document.body.style.background = color;
}

function mischen(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function update_nav(){
    for (let i = cursor; i < cursor + 1 && cursor < 17; i++) {
        let kat = document.getElementById(i);
        let num = kat.getElementsByClassName('number')[0];
        if (beantwortet[i] === kategorien[i]){
            // num.innerHTML = '&#10003;';
            document.getElementById(++cursor).style.visibility = 'visible';
            changeColor(colors[cursor]);
        }else{
            // num.innerHTML = beantwortet[i] + '/' + kategorien[i];
        }
        
    }
}

// sucht nach der Frage mit der niedrigsten Kategorie ab Stelle l
function max_cat(stapel, l){
    let max = l;
    for (let i = l; i < stapel.length; i++) {
        if (stapel[i].kategorie > stapel[max].kategorie){
            max = i;
        }
    }
    return max;
}

function sortieren(stapel) {
    let min = 0;
    for (let i = 0; i < stapel.length; i++) {
        let tmp = stapel[i];
        min = max_cat(stapel, i);
        stapel[i] = stapel[min];
        stapel[min] = tmp;
    }
    return stapel;
}

function aufdecken(stapel) {
    // Wenn keine Fragen übrig sind, dann ist das Game over
    if (stapel.length === 0) {
        changeColor('#f8fff2');
        
        const auswertung = document.createElement('p');
        if (right == 7) {
            auswertung.textContent = "Right answers: " + right + " You are a sustainable homie";
        } else if (wrong == 7) {
            auswertung.textContent = "All your answers were wrong! You should read and learn more about the SDGs! ";
        } else {
            auswertung.textContent = "Right answers: " + right + "  Wrong Answers: " + wrong;
        }
       document.getElementById('karte').innerHTML = "";
       document.getElementById('karte').appendChild(auswertung);

        aktuelle_frage = {};
        return;
    }

    aktuelle_frage = stapel.pop();

    // Frage anzeigen
    let p = document.getElementById('frage');
    p.textContent = aktuelle_frage.frage;




     // Antworten mischen
    const richtig = aktuelle_frage.antworten[aktuelle_frage.richtig];
    const gemischt = mischen(aktuelle_frage.antworten);
        // Richtige Antwort finden
    aktuelle_frage.richtig = Object.keys(gemischt).find(key => gemischt[key] === richtig);
    aktuelle_frage.antworten = gemischt;
    // alert(aktuelle_frage.richtig);




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
    if (antwort == aktuelle_frage.richtig) {
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
    // Kategorien initialisieren (linke goals-leiste)
    for (let i = 0; i < stapel.length; i++) {
        kategorien[stapel[i].kategorie-1]++;
    }
    update_nav();
    changeColor(colors[0]);
    document.getElementById('frage').style.color = 'white';
    document.getElementById('a').style.color = 'white';
    document.getElementById('b').style.color = 'white';
    document.getElementById('c').style.color = 'white';
    document.getElementById('d').style.color = 'white';
    document.getElementById('rightwrong').style.color = 'white';
    // erstes SDG einblenden
    document.getElementById('0').style.visibility = 'visible';


    


    // SpielAblauf
    // 1. Kartenstapel sortieren
    sortieren(stapel);
    console.log(stapel);
    // 2. Nächste Frage stellen
    aufdecken(stapel);
}

start('fragen.json');
