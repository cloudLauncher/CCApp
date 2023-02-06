// v10 - 09-01-2023

const origin = ""//"https://culturecrossover.eu";
let lang = "eng";
let appReady = false;

let gameNumber = 'game';
let player;

const pages = {
	//"": "index.html", // changed for testing
	"lang": "lang-page",
	"players": "player-page",
	"scores": "score-page",
	"rules": "rules-page",
	"404": "404-page",
	"fortune": "fortune-page",
	"dice": "dice-page",
	"trivia": "trivia-page",
	"culture": "culture-page"
}

const abrs = ['al', 'cv', 'che', 'ch', 'eg', 'fr', 'ge', 'gh', 'gr', 'ir', 'it', 'pl', 'pt', 'sy', 'uk']


const translate = {
	eng: {
		players: "Players",
		fortune: "Fortune",
		culture: "Culture",
		trivia: "Trivia",
		countries: ["Albania", "Cape verde", "Chechnya", "China", "Egypt", "France", "Germany", "Ghana", "Greece", "Ireland", "Italy", "Poland", "Portugal", "Syria", "Ukraine"],
		info: ["RULES", "REFRESH", "Restart all the scores. Attention, it’s not undoable", "INSTALL", "Install the App on your phone, computer or other device and play the game offline, anytime!", "This App was<br>brought to you by", "and developed by<br>Sugodesign with the<br>collaboration of Steve Mills"]
	},
	pol: {
		players: "Osoby grające",
		fortune: "Karta losu",
		culture: "Karty kultury",
		trivia: "Karty ciekawostek",
		countries: ["Albania", "Republika Zielonego Przylądka", "Czeczenia", "Chiny", "Egipt", "Francja", "Niemcy", "Ghana", "Grecja", "Irlandia", "Włochy", "Polska", "Portugalia", "Syria", "Ukraina"],
		info: ["POL-RULES", "POL-REFRESH", "Restart all the scores. Attention, it’s not undoable", "INSTALL", "Install the App on your phone, computer or other device and play the game offline, anytime!", "This App was<br>brought to you by", "and developed by<br>Sugodesign with the<br>collaboration of Steve Mills"]
	},
	ger: {
		players: "Spieler*innen",
		fortune: "Glück",
		culture: "Kultur",
		trivia: "Wissen",
		countries: ["Albanien", "Kap Verde", "Tschetschenien", "China", "Ägypten", "Frankreich", "Deutschland", "Ghana", "Griechenland", "Irland", "Italien", "Polen", "Portugal", "Syrien", "Ukraine"],
		info: ["RULES", "REFRESH", "Restart all the scores. Attention, it’s not undoable", "INSTALL", "Install the App on your phone, computer or other device and play the game offline, anytime!", "This App was<br>brought to you by", "and developed by<br>Sugodesign with the<br>collaboration of Steve Mills"]
	},
	ita: {
		players: "Giocatoris",
		fortune: "Fortuna",
		culture: "Cultura",
		trivia: "Curiosità",
		countries: ["Albania", "Cape verde", "Chechnya", "China", "Egypt", "France", "Germany", "Ghana", "Greece", "Ireland", "Italy", "Poland", "Portugal", "Syria", "Ukraine"],
		info: ["RULES", "REFRESH", "Restart all the scores. Attention, it’s not undoable", "INSTALL", "Install the App on your phone, computer or other device and play the game offline, anytime!", "This App was<br>brought to you by", "and developed by<br>Sugodesign with the<br>collaboration of Steve Mills"]
	},
	por: {
		players: "Jogadores",
		fortune: "Sorte",
		culture: "Cultura",
		trivia: "Curiosidades",
		countries: ["Albânia", "Cabo Verde", "Chechénia", "China", "Egipto", "França", "Alemanha", "Gana", "Grécia", "Irelanda", "Itália", "Polónia", "Portugal", "Síria", "Ucrânia"],
		info: ["RULES", "REFRESH", "Restart all the scores. Attention, it’s not undoable", "INSTALL", "Install the App on your phone, computer or other device and play the game offline, anytime!", "This App was<br>brought to you by", "and developed by<br>Sugodesign with the<br>collaboration of Steve Mills"]
	},
	gre: {
		players: "ΠΑΙΧΤΕΣ",
		fortune: "ΤΥΧΗΣ",
		culture: "ΠΟΛΙΤΙΣΜΟΥ",
		trivia: "Trivia",
		countries: ["Αλβανία", "Πράσινο Ακρωτήριο", "Τσετσενία", "Κίνα", "Αίγυπτος", "Γαλλία", "Γερμανία", "Γκάνα", "Ελλάδα", "Ιρλανδία", "Ιταλία", "Πολωνία", "Πορτογαλία", "Συρία", "Ουκρανία"],
		info: ["RULES", "REFRESH", "Restart all the scores. Attention, it’s not undoable", "INSTALL", "Install the App on your phone, computer or other device and play the game offline, anytime!", "This App was<br>brought to you by", "and developed by<br>Sugodesign with the<br>collaboration of Steve Mills"]
	},
	ukr: {
		players: "Граче",
		fortune: "Карта фортуни",
		culture: "Карти культури",
		trivia: "Цікавий факт",
		countries: ["Албанія", " Кабо-Верде", "Чечня", "Китай", "Єгипет", "Франція", "Німеччи", "Гана", "Греція", "Ірланді", "Італія", "Польща", "Португалія", "Сирія", "Україна"],
		info: ["RULES", "REFRESH", "Restart all the scores. Attention, it’s not undoable", "INSTALL", "Install the App on your phone, computer or other device and play the game offline, anytime!", "This App was<br>brought to you by", "and developed by<br>Sugodesign with the<br>collaboration of Steve Mills"]
	}

}



Array.prototype.shuffle = function () {
	let input = this;
	for (let i = input.length - 1; i >= 0; i--) {
		let randomIndex = Math.floor(Math.random() * (i + 1));
		let itemAtIndex = input[randomIndex];
		input[randomIndex] = input[i];
		input[i] = itemAtIndex;
	}
	return input;
}


const error = res => {
	console.log(res)
	return console.log('error fetching')

}


const navigate = async () => {
	let path = window.location.pathname.split('/').pop()
	let page = pages[path] || pages[404];

	let newPage = document.implementation.createHTMLDocument();
	newPage.write(`<${page} class = 'page'>`);
	let current = document.querySelector('.page')
	current?.disconnect();
	let res = await fetch(`${path}.xml`)
	if (!res.ok) return error(res)
	let reader = res.body.getReader();
	let decoder = new TextDecoder();
	if (current) current.parentNode.replaceChild(newPage.body.firstChild, current)
	else document.querySelector('body').appendChild(newPage.body.firstChild)
	while (true) {
		const { done, value } = await reader.read();
		if (done) { reader.releaseLock(); break }
		newPage.write(decoder.decode(value, { stream: true }))
	}
	newPage.write(`</${page}>`)
	let slots = document.querySelectorAll(`[data-slot]`);
	console.log(slots)
	for (let i of slots) {
		console.log(i.dataset.slot)
		i.textContent = translate[lang][i.dataset.slot]
	}
};

const clickHandle = event => {
	event.preventDefault();
	let { currentTarget, target } = event;
	currentTarget[target.dataset.event]?.(event)
	if (target.dataset.page) {
		window.history.pushState({}, "", `${origin}${target.dataset.page}`);
		navigate();
	}
};



window.onpopstate = navigate;
window.onload = navigate;


class baseElement extends HTMLElement {
	constructor() { super() }

	handleCLicks = clickHandle;

	unselect() {
		let nodes = document.querySelectorAll('.selected')
		for (let el of nodes) { el.classList.remove('selected') }

	}

	async disconnect() { this.removeEventListener('click', this.handleCLicks) }

	connectedCallback() { this.addEventListener('click', clickHandle); }

	back() { history.back() }

}


class langPage extends baseElement {
	constructor() { super() }

	async setLanguage(event) {
		lang = event.target.dataset.lang;
		navigator.serviceWorker.controller.postMessage({ type: 'LANGUAGE', msg: lang });

	}
	async refresh() {
		navigator.serviceWorker.controller.postMessage({ type: 'REFRESH', });
	}


}

class playerPage extends baseElement {
	constructor() { super() }

	plus() {
		let items = localStorage.getItem(gameNumber)
		let game = JSON.parse(items) || { players: [] }
		let inputs = document.querySelectorAll('input')
		for (let i = 0, len = inputs.length; i < len; i++) {
			if (inputs[i].value) game.players[i].name = inputs[i].value;
		}
		game.players.push({ name: undefined, badges: 0, visa: 0, ticket: 0 })
		localStorage.setItem(gameNumber, JSON.stringify(game))
		document.querySelector('[part = "temp-lit"]').diff();

	}

	minus({ target }) {
		player = undefined;
		let items = localStorage.getItem(gameNumber)
		let game = JSON.parse(items)
		let inputs = document.querySelectorAll('input')
		for (let i = 0, len = inputs.length; i < len; i++) {
			if (inputs[i].value) game.players[i].name = inputs[i].value;
		}
		game.players.splice(target.dataset.index, 1);
		localStorage.setItem(gameNumber, JSON.stringify(game))
		document.querySelector('[part = "temp-lit"]').diff()

	}

	start() {
		let items = localStorage.getItem(gameNumber)
		let game = JSON.parse(items)
		let inputs = document.querySelectorAll('input')
		for (let i = 0, len = inputs.length; i < len; i++) {
			if (inputs[i].value) game.players[i].name = inputs[i].value;
			else game.players[i].name = `P${i + 1}`

		}
		localStorage.setItem(gameNumber, JSON.stringify(game))
	}

}


class scorePage extends baseElement {
	constructor() { super() }
	select({ target }) {
		document.querySelectorAll('.selected').forEach(x => x.classList.remove('selected'))
		target.className = 'selected'
		player = target.dataset.prop;
	}
	plus(event) {

		let element;
		if (player == undefined) { element = document.querySelector(".selected"); if (!element) return; player = element.dataset.prop }
		else element = document.querySelector(`[data-prop = "${player}"]`)
		let value = parseInt(element.value) + 1;
		element.value = value;
		let items = localStorage.getItem(gameNumber)
		let game = JSON.parse(items)
		let [i, type] = player.split('-');
		game.players[i][type] = value;
		localStorage.setItem(gameNumber, JSON.stringify(game))
		let no = document.querySelector(".selected")
		no.textContent = value;

	}
	minus() {
		let element;
		if (player == undefined) { element = document.querySelector(".selected"); if (!element) return; player = element.dataset.prop }
		else element = document.querySelector(`[data-prop = "${player}"]`)
		let value = parseInt(element.value) - 1;
		if (value < 0) return
		element.value = value;
		let items = localStorage.getItem(gameNumber)
		let game = JSON.parse(items)
		let [i, type] = player.split('-');
		game.players[i][type] = value;
		localStorage.setItem(gameNumber, JSON.stringify(game))
		let no = document.querySelector(".selected")
		no.textContent = value;
	}

	// Dice - Keeping in separate window for now
	dice() { window.open("https://app.culturecrossover.eu/dice/"); }

}


class errorPage extends baseElement {
	constructor() { super() }


}

class triviaPage extends baseElement {
	constructor() { super() }

	lang({ target }) {
		let node = document.createElement('trivia-card')
		node.dataset.url = `https://app.culturecrossover.eu/wp-json/crossover/${lang}/trivia-cards/${target.dataset.country}`
		node.dataset.clang = `${target.dataset.country}`
		node.className = 'center'
		target.parentNode.replaceWith(node)
	}

	select({ target }) {
		if (target.dataset.val === "correct") {
			target.style.backgroundColor = "#59ba9d"
			target.style.color = "#fff"
		}
		else { target.style.backgroundColor = "#e94e15" }
	}
	connectedCallback() { super.connectedCallback() }
}

class fortunePage extends baseElement {
	constructor() { super() }

	select() {

	}

}

class culturePage extends baseElement {
	constructor() { super() }

	lang({ target }) {
		let node = document.createElement('culture-card')
		node.dataset.url = `https://app.culturecrossover.eu/wp-json/crossover/${lang}/culture-cards/${target.dataset.country}`
		node.dataset.clang = `${target.dataset.country}`
		node.className = 'center'
		target.parentNode.replaceWith(node)
	}

	select({ target }) {
		if (target.dataset.val === "correct") {
			target.style.backgroundColor = "#59ba9d"
			target.style.color = "#fff"
		}
		else { target.style.backgroundColor = "#e94e15" }
	}
	flip({ target }) {

		target.remove()
		let visible = document.querySelectorAll('.hide');
		visible.forEach(x => x.remove())
		let hidden = document.querySelectorAll('.hidden')
		hidden.forEach(x => x.classList.remove('hidden'))
	}
}

// Dice page
class dicePage extends baseElement {
	constructor() { super() }
	roll() {

		const dadoImg = document.getElementById("img_dado");
		const audio_fx_01 = document.getElementById("audio_fx_01");
		const audio_fx_02 = document.getElementById("audio_fx_02");
		const audio_fx_03 = document.getElementById("audio_fx_03");
		const audio_fx = [audio_fx_01, audio_fx_02, audio_fx_03];

		let dadoNum = Math.ceil(Math.random() * 6);
		let audioNum = Math.floor(Math.random() * 3);
		if (dadoNum === 1 || dadoNum === 6) {
			dadoNum = 1;
		}
		else if (dadoNum === 3 || dadoNum === 5) {
			dadoNum = 2;
		}
		else if (dadoNum === 2 || dadoNum === 4) {
			dadoNum = 3;
		}
		audio_fx[audioNum].play();
		dadoImg.classList.toggle("rola");
		setTimeout(() => {
			dadoImg.classList.toggle("rola");
		}, 1000);

		setTimeout(() => {
			dadoImg.src = `https://app.culturecrossover.eu/dice/dice-${dadoNum}.jpg`;
		}, 200);
	}
}


customElements.define('base-element', baseElement)
customElements.define('lang-page', langPage)
customElements.define('player-page', playerPage)
customElements.define('score-page', scorePage)
customElements.define('fortune-page', fortunePage)
customElements.define('trivia-page', triviaPage)
customElements.define('culture-page', culturePage)
//customElements.define('404-page', errorPage)


// Number of cards

class slotElement extends HTMLElement {
	constructor() { super() }
	connectedCallback() { if (this.diff) this.diff() }

	setCards() {
		localStorage.setItem('cards', JSON.stringify({
			fortune: {},
			trivia: {},
			culture: {},
		}))
	}
}


class playerBoard extends slotElement {
	constructor() { super() }

	diff() {
		let find = localStorage.getItem(gameNumber);
		let get = JSON.parse(find) || { players: [] }
		let players = get.players;
		let frag = document.createElement('template')
		let str = "";
		for (let i = 0, len = players.length; i < len; i++) {
			let p = players[i]
			str +=
				`<input type="text"  ${p.name ? `value = "${p.name}"` : `placeholder = "P${i + 1}"`}><svg data-event = "minus" class = 'svg-icon' class = 'svg-icon' data-index = ${i} fill="none" xmlns="http://www.w3.org/2000/svg" > <use href="#minus"/></svg>`
		};
		str += `<svg data-event="plus" class='svg-icon' class='svg-icon back' fill="none" xmlns="http://www.w3.org/2000/svg"><use href="#plus" /></svg>`
		str += `<svg data-event='start' data-page='scores' class="svg-icon" fill="none" xmlns="http://www.w3.org/2000/svg" transform="scale(1.5), translate(-70 50)"><use href="#play" /></svg>`
		frag.innerHTML = str;
		this.innerHTML = '';
		this.appendChild(frag.content)


	}
}

class scoreBoard extends slotElement {
	constructor() { super() }

	diff() {
		let find = localStorage.getItem(gameNumber);
		let get = JSON.parse(find) || { players: [] }
		let players = get.players;
		let frag = document.createElement('template')
		let str = "";
		for (let i = 0, len = players.length; i < len; i++) {
			let p = players[i];
			str +=
				`<score-row>
            <strong data-prop="0-name" >${p.name}</strong>
            <input readonly data-event='select' data-prop="${i}-badges" value = ${p.badges}></input>
            <input readonly data-event='select' data-prop="${i}-ticket" value = ${p.ticket}></input>
        </score-row>`
		};
		frag.innerHTML = str;
		this.innerHTML = '';
		this.appendChild(frag.content)
		let selected = document.querySelectorAll(`[data-prop = "${player}"]`).forEach(el => el.classList.add('selected'))
		let sel = document.querySelectorAll('.selected')
		if (sel.length == 0) {
			let inputs = document.querySelectorAll('input');
			if (inputs.length > 0) inputs[0].classList.add('selected');

		}

	}
}


class triviaCard extends slotElement {
	constructor() { super() }
	async diff() {
		let url = this.dataset.url
		let clang = this.dataset.clang;
		let get = localStorage.getItem('cards')
		if (get == undefined) { await super.setCards(); get = localStorage.getItem('cards') }
		let cards = JSON.parse(get);
		let find = await fetch(url)
		if (!find.ok) return alert('network connection error')
		let parsed = await find.json();
		if (!cards.trivia[clang] || cards.trivia[clang].deck.length !== parsed.length) cards.trivia[clang] = { deck: [...Array(parsed.length).keys()].shuffle(), iter: 0 }
		let iter = cards.trivia[clang].iter;
		let deck = cards.trivia[clang].deck;
		if (iter >= deck.length) { iter = 0; cards.trivia[clang].iter = 0; cards.trivia[clang].deck = [...Array(deck.length).keys()].shuffle(); }
		let trivia = parsed[deck[iter]]
		let frag = document.createElement('template')

		let str =
			`${trivia.question}
        <button data-event = "select" data-val = ${trivia.correct == "A" ? "correct" : "incorrect"}>${trivia.opt_a}</button
        <br>
        <button data-event = "select" data-val = ${trivia.correct == "B" ? "correct" : "incorrect"}>${trivia.opt_b}</button
        <br>
        <button data-event = "select" data-val = ${trivia.correct == "C" ? "correct" : "incorrect"}>${trivia.opt_c}</button`

		frag.innerHTML = str;
		this.innerHTML = '';
		this.appendChild(frag.content)
		let selected = document.querySelectorAll(`[data-prop = "${player}"]`).forEach(el => el.classList.add('selected'))
		cards.trivia[clang].iter++;
		localStorage.setItem('cards', JSON.stringify(cards))
	}

}

class fortuneCard extends slotElement {
	constructor() { super() }

	async diff() {
		let get = localStorage.getItem('cards')
		if (get == undefined) { await super.setCards(); get = localStorage.getItem('cards') }
		let cards = JSON.parse(get);
		let find = await fetch(`https://app.culturecrossover.eu/wp-json/crossover/${lang}/fortune-cards`)
		if (!find.ok) return alert('network connection error')
		let parsed = await find.json();
		if (!cards.fortune[lang] || cards.fortune[lang].deck.length !== parsed.length) cards.fortune[lang] = { deck: [...Array(parsed.length).keys()].shuffle(), iter: 0 }
		let iter = cards.fortune[lang].iter;
		let deck = cards.fortune[lang].deck;

		if (iter >= deck.length) { iter = 0; cards.fortune[lang].iter = 0; cards.fortune[lang].deck }
		let fortune = parsed[deck[iter]]

		let frag = document.createElement('template')
		let str = `${fortune.fortune}`
		frag.innerHTML = str;
		this.innerHTML = '';
		this.appendChild(frag.content)
		fortune.unlucky ? document.querySelector(".page").style.backgroundColor = "#e94e15" : document.querySelector(".page").style.backgroundColor = "#59ba9d"
		cards.fortune[lang].iter++
		localStorage.setItem('cards', JSON.stringify(cards))
	}
}

class cultureCard extends slotElement {
	constructor() { super() }
	async diff() {
		let url = this.dataset.url
		let clang = this.dataset.clang;
		let get = localStorage.getItem('cards')
		if (get == undefined) { await super.setCards(); get = localStorage.getItem('cards') }
		let cards = JSON.parse(get);
		let find = await fetch(url)
		if (!find.ok) return alert('network connection error')
		let parsed = await find.json();
		if (!cards.culture[clang] || cards.culture[clang].deck.length !== parsed.length) cards.culture[clang] = { deck: [...Array(parsed.length).keys()].shuffle(), iter: 0 }

		let iter = cards.culture[clang].iter;
		let deck = cards.culture[clang].deck;
		if (iter >= deck.length) { iter = 0; cards.culture[clang].iter = 0; cards.culture[clang].deck = [...Array(deck.length).keys()].shuffle(); }

		let culture = parsed[deck[iter]]

		let frag = document.createElement('template')

		let str =
			`<div class='hide culture-question'>${culture.question}</div>

            ${culture.opt_a ?
				`<div class = 'hide'>
                <div class="culture-option">A</div><button data-event = "select" data-val = ${culture.correct == "A" ? "correct" : "incorrect"}>${culture.opt_a}</button>
                <div class="culture-option">B</div><button data-event = "select" data-val = ${culture.correct == "B" ? "correct" : "incorrect"}>${culture.opt_b}</button>
                <div class="culture-option">C</div><button data-event = "select" data-val = ${culture.correct == "C" ? "correct" : "incorrect"}>${culture.opt_c}</button>
            </div>
                `
				: ``}

			${culture.truth ?
				`<div class = 'hide'>
                <button data-event = "select" data-val = ${culture.truth == "true" ? "correct" : "incorrect"}>TRUE</button>
				<button data-event = "select" data-val = ${culture.truth == "false" ? "correct" : "incorrect"}>FALSE</button>
			</div>`
				: ``} 

            ${culture.explain ?
				`<div class="culture-answer hidden">
				${culture.explain}
			</div>`
				: ``} 

            <svg class = 'center hide turn' data-event="flip" xmlns="http://www.w3.org/2000/svg" width="17.6mm" height="17.5mm" viewBox="0 0 50 49.7">
					<defs>
						<style>
						.cls-1 { fill: none; stroke: #59ba9d; stroke-miterlimit: 10; stroke-width: 5.51px;}
						.cls-2 { fill: #59ba9d; }
						</style>
					</defs>
					<g id="Layer_1" data-name="Layer 1">
						<g>
						<path class="cls-1" d="M19.9,43.4a18.3,18.3,0,0,1-4.8-2.5,16.8,16.8,0,1,1,20.1-27l.9.8"/>
						<polygon class="cls-2" points="43.3 7.8 27 19.6 41.1 21.8 43.3 7.8"/>
						</g>
					</g>
            </svg>`

		frag.innerHTML = str;
		this.innerHTML = '';
		this.appendChild(frag.content)
		let selected = document.querySelectorAll(`[data-prop = "${player}"]`).forEach(el => el.classList.add('selected'))
		cards.culture[clang].iter++;
		localStorage.setItem('cards', JSON.stringify(cards))
	}

}

class countryBox extends slotElement {
	constructor() { super() }

	diff() {
		console.log('diffing')
		let frag = document.createElement('template')
		let str = "";
		for (let i = 0, len = abrs.length; i < len; i++) {

			str += `<button data-event='lang' data-country='${abrs[i]}'>${translate[lang].countries[i]}</button>
			`
		}
		frag.innerHTML = str;
		this.innerHTML = '';
		this.appendChild(frag.content)

	}
}

customElements.define("player-board", playerBoard)
customElements.define("score-board", scoreBoard)
customElements.define("country-box", countryBox)
customElements.define("trivia-card", triviaCard)
customElements.define("fortune-card", fortuneCard)
customElements.define("culture-card", cultureCard)

