function Karte(frage, antworten, richtige_antwort) {
    this.frage = frage;
    this.antworten = antworten;
    this.richtige_antwort = richtige_antwort;
}

let stapel = [];

let numberOfQuestions = 0;

let aktuelle_frage = {};

let right = 0;
let wrong = 0;

const buchstaben = ['A', 'B', 'C', 'D'];

let kategorien = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let beantwortet = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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

function mixAnswers(card) {
    // Antworten mischen
    const richtig = card.antworten[card.richtig];
    const gemischt = mischen(card.antworten);
    // Richtige Antwort finden
    card.richtig = Object.keys(gemischt).find(key => gemischt[key] === richtig);
    card.antworten = gemischt;
}

// sucht nach der Frage mit der niedrigsten Kategorie ab Stelle l
function max_cat(stapel, l) {
    let max = l;
    for (let i = l; i < stapel.length; i++) {
        if (stapel[i].kategorie > stapel[max].kategorie) {
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

function gameover() {
    document.getElementById('karte').innerHTML = "";
    changeColor('#f8fff2');
    
    const percent = Math.round(100 / numberOfQuestions * right);

    const auswertung = document.createElement('p');
    auswertung.textContent = `You answered ${percent}% correctly (questions: ${numberOfQuestions}, right: ${right}, wrong: ${wrong}).`;

    if (percent >= 80) {
        auswertung.textContent += "You are a sustainable homie!";
    } else {
        auswertung.textContent += "You need min. 80% of the questions right to succeed. Try againg!";
    }

    document.getElementById('karte').appendChild(auswertung);

    aktuelle_frage = {};

    showAllSDG();

}

function showQuestion(detailed) {
    // Frage anzeigen
    let p = document.getElementById('frage');
    if (detailed) {
        p.textContent = aktuelle_frage.kategorie + ': ' + aktuelle_frage.frage;
    } else {
        p.textContent = aktuelle_frage.frage;
    }
}

function aufdecken(stapel) {
    // Wenn keine Fragen übrig sind, dann ist das Game over
    if (stapel.length === 0) {
        gameover();
        return;
    }

    aktuelle_frage = stapel.pop();

    showQuestion(false);

    mixAnswers(aktuelle_frage);

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

function showNextSDG() {
    console.log('cursor: ' + cursor);
    document.getElementById(cursor).style.visibility = 'visible';
    document.getElementById(cursor).style.opacity = "1.0";
    changeColor(colors[cursor]);
    if (cursor > 0) {
        // document.getElementById(cursor - 1).style.visibility = 'hidden';
        document.getElementById(cursor - 1).style.opacity = "0.0";
    }
}

function updateSDG() {
    // Wenn eine Kategorie beendet wurde
    if (kategorien[cursor] === beantwortet[cursor] && cursor < 17) {
        ++cursor;
        if(cursor < 17){
            showNextSDG();
        }
        
    }
}

function showAllSDG() {
    for (i = 0; i < 17; ++i) {
        document.getElementById(i).style.opacity = '1.0';
    }
}

function beantworten(antwort) {
    // Bei richtiger Antwort:
    if (antwort == aktuelle_frage.richtig) {
        document.getElementById('rightwrong').innerHTML = "Right answer!";
        ++right;
    }
    // Bei falscher Antwort:
    else {
        const richtig = aktuelle_frage.richtig;
        document.getElementById('rightwrong').innerHTML = (`Wrong! The right answer wouldve been ${buchstaben[richtig]} :  "${aktuelle_frage.antworten[richtig]}"`);
        ++wrong;
    }
    beantwortet[aktuelle_frage.kategorie - 1]++;
    updateSDG();
    // console.log('cursor: ' + cursor);
    console.log('answered: ' + beantwortet);
    aufdecken(stapel);
    // update_nav();

    console.log('categories' + kategorien);


}

function fetch_json(filename) {
    return new Promise((resolve) => {
        fetch(filename).then(content => resolve(content.json()));
    });
}

let preSTapel = [];

async function loadQuestions(file) {
    // Fragen sammeln
    const a = await fetch_json(file);
    for (const [key, value] of Object.entries(a)) {
        console.log(`key: ${key} value: ${value}`);
        let index = key - 1;
        preSTapel.push(value);
        console.log('catagory: ' + value.kategorie);
        numberOfQuestions++;
    }
    console.log('preSTapel: ' + preSTapel);

    // // Genau eine Frage pro Kategorie auf den stapel legen
    // for (i = 0; i < 17; ++i){
    //     // stapel.push(sorted[Math.random() * sorted[i].length]); 
    //     console.log(`cat: ${i + 1} size: ${preSTapel[i].length} ran: ${Math.random() * preSTapel}`);
    // }

    
}

let cat1 = [];
let cat2 = [];
let cat3 = [];
let cat4 = [];
let cat5 = [];
let cat6 = [];
let cat7 = [];
let cat8 = [];
let cat9 = [];
let cat10 = [];
let cat11 = [];
let cat12 = [];
let cat13 = [];
let cat14 = [];
let cat15 = [];
let cat16 = [];
let cat17 = [];


function loadCategories(arr){
    for (let i = 0; i < 17; ++i){
        kategorien[i] = 0;
    }
    // Kategorien initialisieren (linke goals-leiste)
    for (let i = 0; i < arr.length; i++) {
        kategorien[arr[i].kategorie - 1]++;
    }
}


function loadStapel(){
    sortieren(preSTapel);
    console.log('preStapel: ' + preSTapel);
    loadCategories(preSTapel);
    console.log('categories: ' + kategorien)

    // einsortieren
    for (i=0; i < preSTapel.length; ++i){
        switch (preSTapel[i].kategorie){
            case 1:
                cat1.push(preSTapel[i]);
                break;
            case 2:
                cat2.push(preSTapel[i]);
                break;
            case 3:
                cat3.push(preSTapel[i]);
                break;
            case 4:
                cat4.push(preSTapel[i]);
                break;
            case 5:
                cat5.push(preSTapel[i]);
                break;
            case 6:
                cat6.push(preSTapel[i]);
                break;
            case 7:
                cat7.push(preSTapel[i]);
                break;
            case 8:
                cat8.push(preSTapel[i]);
                break;
            case 9:
                cat9.push(preSTapel[i]);
                break;
            case 10:
                cat10.push(preSTapel[i]);
                break;
            case 11:
                cat11.push(preSTapel[i]);
                break;
            case 12:
                cat12.push(preSTapel[i]);
                break;
            case 13:
                cat13.push(preSTapel[i]);
                break;
            case 14:
                cat14.push(preSTapel[i]);
                break;
            case 15:
                cat15.push(preSTapel[i]);
                break;
            case 16:
                cat16.push(preSTapel[i]);
                break;
            case 17:
                cat17.push(preSTapel[i]);
                break;
            default:
        }


        console.log('cat1: ' + cat1.length)
        console.log('cat2: ' + cat2.length)
        console.log('cat3: ' + cat3.length)
        console.log('cat4: ' + cat4.length)
        console.log('cat5: ' + cat5.length)
        console.log('cat6: ' + cat6.length)
        console.log('cat7: ' + cat7.length)
        console.log('cat8: ' + cat8.length)
        console.log('cat9: ' + cat9.length)
        console.log('cat10: ' + cat10.length)
        console.log('cat11: ' + cat11.length)
        console.log('cat12: ' + cat12.length)
        console.log('cat13: ' + cat13.length)
        console.log('cat14: ' + cat14.length)
        console.log('cat15: ' + cat15.length)
        console.log('cat16: ' + cat16.length)
        console.log('cat17: ' + cat17.length)

    }

    console.log('stapel: ' + stapel)

    // aus jeder Kategorie eine Frage wäehlen
    stapel.push(cat17[Math.floor(Math.random() * cat17.length)]);
    stapel.push(cat16[Math.floor(Math.random() * cat16.length)]);
    stapel.push(cat15[Math.floor(Math.random() * cat15.length)]);
    stapel.push(cat14[Math.floor(Math.random() * cat14.length)]);
    stapel.push(cat13[Math.floor(Math.random() * cat13.length)]);
    stapel.push(cat12[Math.floor(Math.random() * cat12.length)]);
    stapel.push(cat11[Math.floor(Math.random() * cat11.length)]);
    stapel.push(cat10[Math.floor(Math.random() * cat10.length)]);
    stapel.push(cat9[Math.floor(Math.random() * cat9.length)]);
    stapel.push(cat8[Math.floor(Math.random() * cat8.length)]);
    stapel.push(cat7[Math.floor(Math.random() * cat7.length)]);
    stapel.push(cat6[Math.floor(Math.random() * cat6.length)]);
    stapel.push(cat5[Math.floor(Math.random() * cat5.length)]);
    stapel.push(cat4[Math.floor(Math.random() * cat4.length)]);
    stapel.push(cat3[Math.floor(Math.random() * cat3.length)]);
    stapel.push(cat2[Math.floor(Math.random() * cat2.length)]);
    stapel.push(cat1[Math.floor(Math.random() * cat1.length)]);
    console.log('ran: ' + stapel)

    numberOfQuestions = stapel.length;
    
    loadCategories(stapel);

    console.log('cat: ' + kategorien);

    showNextSDG();
    changeColor(colors[0]);
    document.getElementById('frage').style.color = 'white';
    document.getElementById('a').style.color = 'white';
    document.getElementById('b').style.color = 'white';
    document.getElementById('c').style.color = 'white';
    document.getElementById('d').style.color = 'white';
    document.getElementById('rightwrong').style.color = 'white';
}

function start(file) {
    loadQuestions('fragen.json').then(_ => {
        // SpielAblauf
        // 1. Kartenstapel sortieren
        
        // 2. Eine Frage aus jeder Kategorie auswählen
        loadStapel();
        // 3. Nächste Frage stellen
        aufdecken(stapel);
    });

}

start();
