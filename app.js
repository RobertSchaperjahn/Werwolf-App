// Initiale Variablen und Event Listener für die Steuerung
document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('assignRoles').addEventListener('click', assignRoles);
document.getElementById('nextPhase').addEventListener('click', nextPhase);

let playerCount;
let players = [];

// Vollständige Rollenliste nach Kategorien
const roles = {
    dorfbewohner_neutral: [
        "Dielenschleiferin",
        "Heimscheißerin",
        "Prokrastinations Paula",
        "Schutzschild-Sigrid"
    ],
    dorfbewohner_besondere_faehigkeiten: [
        "Bordell Bärbel",
        "Mansplaining Martin",
        "Kräuterhexe Hilde",
        "Nekromant Norbert",
        "Boy-Butter Bäuerin",
        "Öko Sabine",
        "Bestatterin Brunhilde",
        "Nicht-binäre Türsteherperson Toni",
        "Wachmann Wenzel"
    ],
    eigene_ziele: [
        "Wut Wiebke",
        "Suizid Susie",
        "Doppelmoral-Dörthe",
        "Konversionstherapie Konny",
        "Gloryhole Günni",
        "Blutmagierin Beatrix"
    ],
    manipulation_verwirrung: [
        "Klatsch-Käthe",
        "Vollsuff-Valentin",
        "Wahrsager-Weberin Waltraud"
    ],
    unberechenbar_gefaehrlich: [
        "Keta-Zieherin Claudia",
        "Iltussy",
        "Trip-Sitterin Tanja",
        "Giftmischerin Gertrud",
        "Travestiekünstler Tristan"
    ],
    beziehungsdynamik: [
        "Der Twink",
        "Der geile Priester"
    ]
};

// Hilfsfunktion, um alle Rollen als flaches Array zu erhalten
function getAllRoles() {
    return Object.values(roles).flat();
}

let currentPhase = "Nacht";
let eventsEnabled = true; // Einstellung für zufällige Events
let eventProbability = 0.2; // 20% Wahrscheinlichkeit

function startGame() {
    playerCount = parseInt(document.getElementById('playerCount').value);
    if (isNaN(playerCount) || playerCount < 8 || playerCount > 15) {
        alert("Bitte gib eine gültige Spieleranzahl zwischen 8 und 15 ein.");
        return;
    }
    document.getElementById('setup').classList.add('hidden');  // Versteckt den Setup-Bereich
    document.getElementById('gameArea').classList.remove('hidden');  // Zeigt das Spielbereich
    setupPlayers();  // Spieler einrichten
}

function setupPlayers() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';  // Setzt die Spielerliste zurück
    players = [];  // Leert das Spieler-Array
    for (let i = 1; i <= playerCount; i++) {
        const li = document.createElement('li');
        
        // Eingabefeld für den Spielernamen
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = `Name Spieler ${i}`;
        nameInput.id = `playerName${i}`;
        
        // Dropdown zur Rollenauswahl mit vollständiger Rollenliste
        const roleSelect = document.createElement('select');
        roleSelect.id = `playerRole${i}`;
        getAllRoles().forEach(role => {
            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            roleSelect.appendChild(option);
        });
        
        li.appendChild(nameInput);
        li.appendChild(roleSelect);
        playerList.appendChild(li);
        
        players.push({ name: `Spieler ${i}`, role: null, alive: true });
    }
    document.getElementById('assignRoles').classList.remove('hidden');  // Zeigt die Rollen-Button
}

function assignRoles() {
    players.forEach((player, index) => {
        // Hole den Namen und die Rolle aus den Eingabefeldern
        const nameInput = document.getElementById(`playerName${index + 1}`);
        const roleSelect = document.getElementById(`playerRole${index + 1}`);
        
        // Weise den eingegebenen Namen und die gewählte Rolle zu
        player.name = nameInput.value || `Spieler ${index + 1}`;
        player.role = roleSelect.value;
    });
    alert("Rollen wurden manuell zugewiesen.");
    updatePlayerList();
    document.getElementById('assignRoles').classList.add('hidden');
    document.getElementById('nextPhase').classList.remove('hidden');
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
    // Beispielaktion in der Nachtphase – kann später durch Rollenfähigkeiten erweitert werden
    let targetIndex;
    do {
        targetIndex = Math.floor(Math.random() * players.length);
    } while (!players[targetIndex].alive);  // Wählt nur lebendige Spieler

    players[targetIndex].alive = false; // Beispiel: Werwölfe eliminieren Spieler
    updatePlayerList();
    checkForRandomEvent();
}

function dayPhase() {
    alert("Tagphase beginnt! Diskussion startet.");
    startDiscussionTimer();
    // Beispielaktion in der Tagphase – Abstimmung, um einen Spieler zu eliminieren
    let voteTargetIndex;
    do {
        voteTargetIndex = Math.floor(Math.random() * players.length);
    } while (!players[voteTargetIndex].alive);  // Wählt nur lebendige Spieler

    players[voteTargetIndex].alive = false;  // Beispiel: Abstimmung eliminiert einen Spieler
    updatePlayerList();
}

function startDiscussionTimer(duration = 60) {  // Dauer in Sekunden
    let timer = duration;
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
        alert("Epidemie! Einige Spieler können sich nicht an der Diskussion beteiligen.");
        players.forEach(player => {
            if (Math.random() < 0.3) player.alive = false; // Beispielhafte Erkrankung
        });
        updatePlayerList();
    }
}
