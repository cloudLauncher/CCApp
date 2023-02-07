let version = '1.0'
let cacheName = `static-${version}`;

let lang;
let cards = ["trivia-cards", "culture-cards"];
let countries = ["al", "cv", "che", "ch", "eg", "fr", "ge", "gh", "gr", "ir", "it", "pl", "pt", "sy", "uk"]
let staticFiles = ["cc.js", "manifest.json", "layouts.css", "culture.xml", "fortune.xml", "lang.xml", "players.xml", "scores.xml", "trivia.xml",
    "xadrez-chegada.svg", "btn-dice_roll.svg",
    //"https://app.culturecrossover.eu/dice/dado_fx_02.mp3","https://app.culturecrossover.eu/dice/dado_fx_01.mp3",
    //"https://app.culturecrossover.eu/dice/dado_fx_03.mp3","https://app.culturecrossover.eu/dice/dice-1.jpg"
]

const update = async function () {
    try {
        let keys = await caches.keys();
        await Promise.all(keys.map(key => { return caches.delete(key) }))
        let cache = await caches.open(cacheName);
        await cache.addAll(staticFiles)

    }
    catch (err) { clients[0].postMessage({ type: "ERROR", msg: "refresh fail", }) }
}

self.onmessage = async function (event) {
    if (event.data.type == 'UPDATE') await update();
    if (event.data.type == 'LANGUAGE') {
        if (lang == event.data.msg) return;
        else lang = event.data.msg;
    }
    try {
        let files = [];
        for (let x of cards) {
            for (let i of countries) {
                files.push(`https://app.culturecrossover.eu/wp-json/crossover/${lang}/${x}/${i}`)
            }
        }
        //files.push(`https://culturecrossover.eu/wp-content/uploads/2022/10/Rules_${lang}.pdf`)
        let cache = await caches.open(cacheName);
        await cache.addAll(files);
    }
    catch (err) {
        console.log(err)
        let clients = await self.clients.matchAll({ type: 'window' });
        if (clients && clients.length >= 1) clients[0].postMessage({ type: "ERROR", msg: "cache fail", });
    }
}

self.oninstall = function () { skipWaiting() };

self.onactivate = function (event) {
    event.waitUntil(async function () {
        let claim = await clients.claim();
        let keys = await caches.keys();
        await Promise.all(keys.map(key => { if (key !== cacheName) return caches.delete(key) }))
        let cache = await caches.open(cacheName);
        await cache.addAll(staticFiles);
    }()
    );
};

const handler = async function (request) {
    let res;
    if (request.mode == "navigate") res = await caches.match("index.html");
    else res = await caches.match(request)
    if (res) { console.log('return from cache'); return res; }
    else return fetch(request);
}


self.onfetch = async function (event) { event.respondWith(handler(event.request)) }


