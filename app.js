document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('manualStart').addEventListener('click', startManualGame);
    document.getElementById('autoStart').addEventListener('click', startAutoGame);
    document.getElementById('assignRoles').addEventListener('click', assignRoles);
    document.getElementById('nextPhase').addEventListener('click', nextPhase);

    // Event Listener für die Spieleranzahl-Buttons
    document.querySelectorAll("#playerCountButtons button").forEach(button => {
        button.addEventListener("click", function() {
            const count = parseInt(button.getAttribute("data-count"));
            if (!isNaN(count)) {
                setPlayerCount(count, button);
            }
        });
    });
});

let playerCount = 0;
let players = [];

// Verteilungstabellen für Dorfbewohner und Werwölfe
const roleDistribution = {
    8: { villagers: 4, werewolves: 2 },
    9: { villagers: 6, werewolves: 2 },
    10: { villagers: 6, werewolves: 2 },
    11: { villagers: 8, werewolves: 2 },
    12: { villagers: 7, werewolves: 3 },
    13: { villagers: 9, werewolves: 3 },
    14: { villagers: 8, werewolves: 4 },
    15: { villagers: 10, werewolves: 4 }
};

// Rollenliste
const roles = {
    dorfbewohner_neutral: ["Dielenschleiferin", "Heimscheißerin", "Prokrastinations Paula", "Schutzschild-Sigrid"],
    dorfbewohner_besondere_faehigkeiten: ["Bordell Bärbel", "Mansplaining Martin", "Kräuterhexe Hilde", "Nekromant Norbert", "Boy-Butter Bäuerin", "Öko Sabine", "Bestatterin Brunhilde", "Nicht-binäre Türsteherperson Toni", "Wachmann Wenzel"],
    eigene_ziele: ["Wut Wiebke", "Suizid Susie", "Doppelmoral-Dörthe", "Konversionstherapie Konny", "Gloryhole Günni", "Blutmagierin Beatrix"],
    manipulation_verwirrung: ["Klatsch-Käthe", "Vollsuff-Valentin", "Wahrsager-Weberin Waltraud"],
    unberechenbar_gefaehrlich: ["Keta-Zieherin Claudia", "Iltussy", "Trip-Sitterin Tanja", "Giftmischerin Gertrud", "Travestiekünstler Tristan"],
    beziehungsdynamik: ["Der Twink", "Der geile Priester"]
};

// Funktion, um alle Rollen zu erhalten
function getAllRoles() {
    return Object.values(roles).flat();
}

// Spieleranzahl festlegen und Button aktivieren
function setPlayerCount(count, button) {
    playerCount = count;
    document.querySelectorAll("#playerCountButtons button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
}

// Start des Spiels mit manueller Rollenvergabe
function startManualGame() {
    if (!playerCount) {
        alert("Bitte wähle die Anzahl der Spieler.");
        return;
    }
    setupPlayers();
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
}

// Start des Spiels mit automatischer Rollenvergabe
function startAutoGame() {
    if (!playerCount) {
        alert("Bitte wähle die Anzahl der Spieler.");
        return;
    }
    assignRolesAutomatically();
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
}

// Manuelle Rollenvergabe vorbereiten
function setupPlayers() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    players = [];

    for (let i = 1; i <= playerCount; i++) {
        const li = document.createElement('li');

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = `Name Spieler ${i}`;
        nameInput.id = `playerName${i}`;

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
    document.getElementById('assignRoles').classList.remove('hidden');
}

// Automatische Rollenvergabe mit Namenseingabe
function assignRolesAutomatically() {
    const distribution = roleDistribution[playerCount];
    const totalVillagers = distribution.villagers;
    const totalWerewolves = distribution.werewolves;

    // Werwolf- und Dorfbewohner-Rollen festlegen
    const werewolves = Array(totalWerewolves).fill("Werwolf");
    const villagers = getAllRoles().filter(role => role !== "Vollsuff-Valentin" && role !== "Wahrsager-Weberin Waltraud").slice(0, totalVillagers);

    // Spielerliste zurücksetzen
    players = [];

    // Kombinieren und Mischen der Rollen
    const allRoles = [...werewolves, ...villagers];
    shuffleArray(allRoles);

    // Rollen den Spielern zuweisen
    for (let i = 0; i < playerCount; i++) {
        const assignedRole = allRoles[i];
        players.push({ name: `Spieler ${i + 1}`, role: assignedRole, alive: true });
    }

    // Namen der Spieler anpassen lassen
    setupPlayerNames();
}


// Funktion zum Anpassen der Spielernamen nach der Rollenzuweisung
function setupPlayerNames() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    players.forEach((player, index) => {
        const li = document.createElement('li');

        // Eingabefeld für den Namen des Spielers
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = `Name Spieler ${index + 1}`;
        nameInput.value = player.name;
        nameInput.addEventListener('input', (event) => {
            player.name = event.target.value;
        });

        li.appendChild(nameInput);
        li.append(` - Rolle: ${player.role} (${player.alive ? "Lebendig" : "Ausgeschieden"})`);
        playerList.appendChild(li);
    });

    document.getElementById('nextPhase').classList.remove('hidden');
}

// Hilfsfunktion zum Mischen eines Arrays
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function assignRoles() {
    players.forEach((player, index) => {
        const nameInput = document.getElementById(`playerName${index + 1}`);
        const roleSelect = document.getElementById(`playerRole${index + 1}`);
        
        player.name = nameInput.value || `Spieler ${index + 1}`;
        player.role = roleSelect.value;
    });
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
