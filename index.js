function Karte ( frage, antworten, richtige_antwort) {
    this.frage = frage;
    this.antworten = antworten;
    this.richtige_antwort = richtige_antwort;
}

const k1 = new Karte('What daily income is defined as extreme poverty?', 
    [
<<<<<<< HEAD
        'Hallo', 
        'Auto', 
        'Sustainable Developement Goals', 
        'Schuhe'
=======
        '$2.50', 
        '3.50€', 
        '$1.25', 
        '5.00€'
>>>>>>> css
    ], 2);
const k2 = new Karte('By which year does the UN want to remove extreme poverty and halve poverty overall? ', 
    [
        '2050', 
        '2025', 
        '2035', 
        '2030'
    ], 3);
const k3 = new Karte('By 2025, fulfill the internationally agreed targets on stunting and wasting in children under __ years of age.', 
    [
        '12', 
        '10', 
        '2', 
        '5'
    ], 3);
	
const k4 = new Karte('By 2020, maintain the genetic diversity of _, cultivated __ and farmed and domesticated ___ and their related wild species.', 
    [
        'animals, arts, cats', 
        'humans, fields, animals', 
        'crops, meat, vegetables', 
        'Seeds, plants, animals'
    ], 3);
	
	const k5 = new Karte('How many people in the world auffer from hunger?', 
    [
        '3 in 10 people', 
        '1 in 10 people', 
        '20 in 100 people', 
        '15 in 100 people'
    ], 1);
	
	const k6 = new Karte('How many people die prematurely in Europe, due to air pollution annually?', 
    [
        '100.000', 
        '400.000', 
        '10.000', 
        '50.000'
    ], 1);
	
	const k7 = new Karte('What does SDG stand for?', 
    [
        'Sweet Dog Game', 
        'Sustainable Development Gays', 
        'Sustainable Development Goals', 
        'Suspicous Dolphin Goals'
    ], 2);


let stapel = [k1, k2, k3, k4, k5, k6,k7];

let aktuelle_frage = {};

let right = 0;
let wrong = 0;

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
       // karte.textContent = "Thank you for playing :)"
	/*	
		if(right == 7){
			 karte.textContent = "Right answers: " +  right + " You are a sustainable homie" ;
		}
		
		else{
		let dings = document.getElementById('ergebniss');
        karte.textContent = "Right answers: " +  right + "  Wrong Answers: " + wrong ;}
		
		*/
		
		
		
		
		if (right == 7) {
		  karte.textContent = "Right answers: " +  right + " You are a sustainable homie" ;
		} else if (wrong == 7) {
		  karte.textContent = "All your answers were wrong! You should read and learn more about the SDGs! ";
		} else {
		   karte.textContent = "Right answers: " +  right + "  Wrong Answers: " + wrong ;
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

function beantworten( antwort ) {
    // Bei richtiger Antwort:
    if (antwort === aktuelle_frage.richtige_antwort) {
		 document.getElementById('rightwrong').innerHTML = "Right answer!";
        // alert("Richtig");
		 right = ++right;
    }
    // Bei falscher Antwort:
    else {
        const richtig = aktuelle_frage.richtige_antwort;
        document.getElementById('rightwrong').innerHTML = (`Wrong! The right answer wouldve been ${buchstaben[richtig]} :  "${aktuelle_frage.antworten[richtig]}"`);
		wrong = ++wrong;
    }
    aufdecken(stapel);
}

// Ablauf

// 1. Kartenstapel mischen
mischen(stapel);
// 2. Nächste Frage stellen
aufdecken(stapel);