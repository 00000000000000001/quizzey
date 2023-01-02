// Download

window.jsPDF = window.jspdf.jsPDF

function generatePDF(name) {
    var doc = new jsPDF();
    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    // Logo
    var img = new Image()
    img.src = './resources/canvas.png'
    doc.addImage(img, 'png', 0, 0, 210, 297)


    // Name der Zertifizierten Person
    doc.setFontSize(42)/*.setFont(undefined, 'bold')*/;
    doc.text(name, pageWidth / 2, 162, { align: 'center' });

    // Datum
    const date = new Date().toLocaleDateString()
    doc.setFontSize(16).setFont(undefined, 'normal');
    doc.text(date.toString(), 70, 227.4);

    doc.save("sdg_certificate.pdf");
}


function download() {
    const firstname = document.getElementById('firstname');
    const lastname = document.getElementById('lastname');

    if (/^\w+$/gm.test(firstname.value) && /^\w+$/gm.test(lastname.value)) {
        const name = firstname.value + " " + lastname.value;
        generatePDF(name);
        hideDownloadForm();
    } else {
        const info = document.getElementById('info');
        info.innerHTML = '';
        info.innerHTML = 'Please enter your first and last name to succeed'
    }
}

function showDownloadForm() {
    let labelFN = document.createElement('label');
    let labelLN = document.createElement('label');
    let textFN = document.createElement('input');
    let textLN = document.createElement('input');
    let button = document.createElement('button');
    let info = document.createElement('div');
    let container = document.createElement('div');
    let title = document.createElement('h1');

    labelFN.textContent = 'Firstname:';
    labelLN.textContent = 'Lastname:';
    textFN.type = 'text';
    textLN.type = 'text';
    button.textContent = 'download certificate'
    title.textContent = 'Congratulation!';

    textFN.id = 'firstname';
    textLN.id = 'lastname';
    button.id = 'download';
    info.id = 'info';
    container.id = 'container';

    container.style = "display: flex; flex-direction: column; width: 20vw;";

    button.addEventListener("click", download);

    container.appendChild(labelFN);
    container.appendChild(textFN);
    container.appendChild(labelLN);
    container.appendChild(textLN);
    container.appendChild(button);
    container.appendChild(info);

    document.getElementById('karte').appendChild(title);
    document.getElementById('karte').appendChild(container);

}

function hideDownloadForm() {
    const container = document.getElementById('container');
    container.remove();
}

// QUIZ

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
        auswertung.textContent += "You are a sustainable homie! Download the certificate.";
        showDownloadForm();
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

    // muss wieder ausgeblendet werden
    console.log('richtig: ' + buchstaben[aktuelle_frage.richtig]);
}

function showNextSDG() {
    // console.log('cursor: ' + cursor);
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
        if (cursor < 17) {
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
        document.getElementById('ergebnis').innerHTML = "Right answer!";
        ++right;
    }
    // Bei falscher Antwort:
    else {
        const richtig = aktuelle_frage.richtig;
        document.getElementById('ergebnis').innerHTML = (`Wrong! The right answer wouldve been ${buchstaben[richtig]} :  "${aktuelle_frage.antworten[richtig]}"`);
        ++wrong;
    }
    beantwortet[aktuelle_frage.kategorie - 1]++;
    updateSDG();
    aufdecken(stapel);
}

function fetch_json(filename) {
    return new Promise((resolve) => {
        fetch(filename).then(content => resolve(content.json()));
    });
}

async function loadQuestions(file) {
    let preStapel = [];
    // Fragen sammeln
    const a = await fetch_json(file);
    for (const [key, value] of Object.entries(a)) {
        let index = key - 1;
        preStapel.push(value);
        numberOfQuestions++;
    }
    return preStapel;
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


function loadCategories(preSt) {
    for (let i = 0; i < 17; ++i) {
        kategorien[i] = 0;
    }
    // Kategorien initialisieren (linke goals-leiste)
    for (let i = 0; i < preSt.length; i++) {
        kategorien[preSt[i].kategorie - 1]++;
    }
}


function loadStapel(preStapel) {
    sortieren(preStapel);
    loadCategories(preStapel);

    // einsortieren
    for (i = 0; i < preStapel.length; ++i) {
        switch (preStapel[i].kategorie) {
            case 1:
                cat1.push(preStapel[i]);
                break;
            case 2:
                cat2.push(preStapel[i]);
                break;
            case 3:
                cat3.push(preStapel[i]);
                break;
            case 4:
                cat4.push(preStapel[i]);
                break;
            case 5:
                cat5.push(preStapel[i]);
                break;
            case 6:
                cat6.push(preStapel[i]);
                break;
            case 7:
                cat7.push(preStapel[i]);
                break;
            case 8:
                cat8.push(preStapel[i]);
                break;
            case 9:
                cat9.push(preStapel[i]);
                break;
            case 10:
                cat10.push(preStapel[i]);
                break;
            case 11:
                cat11.push(preStapel[i]);
                break;
            case 12:
                cat12.push(preStapel[i]);
                break;
            case 13:
                cat13.push(preStapel[i]);
                break;
            case 14:
                cat14.push(preStapel[i]);
                break;
            case 15:
                cat15.push(preStapel[i]);
                break;
            case 16:
                cat16.push(preStapel[i]);
                break;
            case 17:
                cat17.push(preStapel[i]);
                break;
            default:
        }

    }

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

    numberOfQuestions = stapel.length;

    loadCategories(stapel);

    showNextSDG();
    changeColor(colors[0]);
    document.getElementById('frage').style.color = 'white';
    document.getElementById('a').style.color = 'white';
    document.getElementById('b').style.color = 'white';
    document.getElementById('c').style.color = 'white';
    document.getElementById('d').style.color = 'white';
    document.getElementById('ergebnis').style.color = 'white';
}

function start() {
    // loadQuestions lädt alle Fragen in den preStapel
    loadQuestions('fragen.json').then(preStapel => {
        // 1. Kartenstapel zusammenstellen
        loadStapel(preStapel);
        // 2. Nächste Frage stellen
        aufdecken(stapel);
    });
}

start();
