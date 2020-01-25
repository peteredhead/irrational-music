const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let oscillator;
let playing = false;

let position = 0;

// B, C♯, D, E, F♯, G, A, B, C♯, D
const notes = [
    246.9,
    277.2,
    293.7,
    329.6,
    370.0,
    392.0,
    440.0,
    493.9,
    554.4,
    587.3
]

const pi = '3.141592653589793238462643383279502884197169399375105820974944'
    +'5923078164062862089986280348253421170679821480865132823066470938446095'
    +'5058223172535940812848111745028410270193852110555964462294895493038196'
    +'4428810975665933446128475648233786783165271201909145648566923460348610'
    +'4543266482133936072602491412737245870066063155881748815209209628292540'
    +'9171536436789259036001133053054882046652138414695194151160943305727036'
    +'5759591953092186117381932611793105118548074462379962749567351885752724'
    +'8912279381830119491298336733624406566430860213949463952247371907021798'
    +'6094370277053921717629317675238467481846766940513200056812714526356082'
    +'7785771342757789609173637178721468440901224953430146549585371050792279'
    +'6892589235420199561121290219608640344181598136297747713099605187072113'
    +'4999999837297804995105973173281609631859502445945534690830264252230825'
    +'3344685035261931188171010003137838752886587533208381420617177669147303'
    +'5982534904287554687311595628638823537875937519577818577805321712268066'
    +'130019278766111959092164201989';

function setup() {
    const initial = pi.slice(0,3).split('');
    const display = document.getElementById('numbers');
    ['', '', ...initial].map(function(n) {
        const node = numberToNode(n);
        display.appendChild(node);
    })
}

function numberToNode(n) {
	const node = document.createElement("li");
    const textNode = document.createTextNode(n);
    node.appendChild(textNode);
    return node;
}

function addNextNumber(nextNumber) {
    const node = numberToNode(nextNumber);
    const display = document.getElementById('numbers');
    display.appendChild(node);
    const listItems = display.getElementsByTagName('li');
    listItems[0].style.width = 0;
    if (playing) {
        setTimeout(removeOldFirstNumber, 900);
    }
}

function removeOldFirstNumber() {
	const display = document.getElementById('numbers');
	const listItems = display.getElementsByTagName('li');
    listItems[0].innerHTML = ' ';
    display.removeChild(listItems[0]);
}

function play() {
    if (playing) {
        return;
    }
    playing = true;
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    nextNote();
}

function nextNote() {
    addNextNumber(pi.charAt(position+3));
    const number = parseInt(pi.charAt(position), 10);
    if (isNaN(number)) {
        position += 1;
        setTimeout(nextNote, 1000);
        return;
    }

    const note = notes[number];

    // stop last note, if playing
    if (oscillator) {
        oscillator.stop();
    }

    // create Oscillator node
    oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note, audioCtx.currentTime); // value in hertz
    oscillator.connect(audioCtx.destination);
    oscillator.start();

    position += 1;
    if (playing) {
        setTimeout(nextNote, 1000);
    }
}

function stop() {
    if (!playing) {
        return
    }
    oscillator.stop();
    playing = false;
}
