// Spielsteuerung
document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('assignRoles').addEventListener('click', assignRoles);
document.getElementById('nextPhase').addEventListener('click', nextPhase);

let playerCount;
let players = [];

function startGame() {
    playerCount = parseInt(document.getElementById('playerCount').value);
    if (playerCount < 8 || playerCount > 15) {
        alert("Bitte gib eine Spieleranzahl zwischen 8 und 15 ein.");
        return;
    }
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
    setupPlayers();
}

function setupPlayers() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    for (let i = 1; i <= playerCount; i++) {
        const li = document.createElement('li');
        li.textContent = `Spieler ${i}`;
        playerList.appendChild(li);
        players.push({ name: `Spieler ${i}`, role: null });
    }
}

function assignRoles() {
    // Zufällige Rollenverteilung (Dummy-Funktion für Platzhalter)
    players.forEach(player => {
        player.role = "Dorfbewohner"; // Platzhalter-Rolle
    });
    alert("Rollen wurden zugewiesen.");
    document.getElementById('nextPhase').classList.remove('hidden');
}

function nextPhase() {
    alert("Nächste Phase startet!");
    // Hier kommen die Logik für Nacht- und Tagphasen sowie Events
}
// Initiale Variablen und Event Listener für die Steuerung
document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('assignRoles').addEventListener('click', assignRoles);
document.getElementById('nextPhase').addEventListener('click', nextPhase);

let playerCount;
let players = [];
let roles = ["Dorfbewohner", "Werwolf", "Geiler Priester", "Blutmagierin Beatrix"];
let currentPhase = "Nacht";
let eventsEnabled = true; // Einstellung für zufällige Events
let eventProbability = 0.2; // 20% Wahrscheinlichkeit

function startGame() {
    playerCount = parseInt(document.getElementById('playerCount').value);
    if (playerCount < 8 || playerCount > 15) {
        alert("Bitte gib eine Spieleranzahl zwischen 8 und 15 ein.");
        return;
    }
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
    setupPlayers();
}

function setupPlayers() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    for (let i = 1; i <= playerCount; i++) {
        const li = document.createElement('li');
        li.textContent = `Spieler ${i}`;
        playerList.appendChild(li);
        players.push({ name: `Spieler ${i}`, role: null, alive: true });
    }
}

function assignRoles() {
    players.forEach(player => {
        // Zuweisung zufälliger Rollen aus der Rollenliste
        player.role = roles[Math.floor(Math.random() * roles.length)];
    });
    alert("Rollen wurden zufällig zugewiesen.");
    document.getElementById('nextPhase').classList.remove('hidden');
    updatePlayerList();
}

function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name} - Rolle: ${player.role} (${player.alive ? "Lebendig" : "Ausgeschieden"})`;
        playerList.appendChild(li);
    });
}

function nextPhase() {
    if (currentPhase === "Nacht") {
        nightPhase();
        currentPhase = "Tag";
    } else {
        dayPhase();
        currentPhase = "Nacht";
    }
}

function nightPhase() {
    alert("Nachtphase beginnt!");
    // Nachtaktionen wie Angriff der Werwölfe
    let targetIndex = Math.floor(Math.random() * players.length);
    players[targetIndex].alive = false; // Einfaches Beispiel für Werwolf-Angriff
    updatePlayerList();
    checkForRandomEvent();
}

function dayPhase() {
    alert("Tagphase beginnt! Diskussion startet.");
    startDiscussionTimer();
    // Abstimmung simuliert - ein zufälliger Spieler wird eliminiert
    let voteTargetIndex = Math.floor(Math.random() * players.length);
    players[voteTargetIndex].alive = false;
    updatePlayerList();
}

function startDiscussionTimer() {
    let timer = 60; // Diskussionszeit in Sekunden
    const interval = setInterval(() => {
        if (timer > 0) {
            console.log(`Diskussionszeit: ${timer} Sekunden`);
            timer--;
        } else {
            clearInterval(interval);
            alert("Diskussionszeit ist abgelaufen.");
        }
    }, 1000);
}

function checkForRandomEvent() {
    if (eventsEnabled && Math.random() < eventProbability) {
        triggerRandomEvent();
    }
}

function triggerRandomEvent() {
    const event = Math.random() < 0.5 ? "Unwetter" : "Epidemie";
    if (event === "Unwetter") {
        alert("Unwetter! Die Diskussionszeit wird in der nächsten Tagphase verkürzt.");
        startDiscussionTimer(30); // Verkürzte Diskussionszeit
    } else {
        alert("Epidemie! Ein oder mehrere Spieler können sich nicht an der Diskussion beteiligen.");
        players.forEach(player => {
            if (Math.random() < 0.3) player.alive = false;
        });
        updatePlayerList();
    }
}
