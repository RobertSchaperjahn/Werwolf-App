document.addEventListener("DOMContentLoaded", function() {
    console.log("Script geladen und bereit."); // Testausgabe
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
    console.log("Manuelles Spiel gestartet"); // Testausgabe
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
    console.log("Automatisches Spiel gestartet"); // Testausgabe
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

// Automatische Rollenvergabe
function assignRolesAutomatically() {
    const distribution = roleDistribution[playerCount];
    const totalVillagers = distribution.villagers;
    const totalWerewolves = distribution.werewolves;

    // Get all roles and prepare villagers and werewolves
    let availableRoles = getAllRoles().filter(role => role !== "Vollsuff-Valentin" && role !== "Wahrsager-Weberin Waltraud");
    
    // Separate villagers and werewolf roles
    const villagers = availableRoles.filter(role => !role.toLowerCase().includes("werwolf")).slice(0, totalVillagers);
    const werewolves = Array(totalWerewolves).fill("Werwolf"); // `Werwolf` can be a generic role
    
    // Reset players array
    players = [];

    // Assign werewolves to players
    for (let i = 0; i < totalWerewolves; i++) {
        const playerName = `Spieler ${i + 1}`;
        players.push({ name: playerName, role: werewolves[i], alive: true });
    }

    // Assign villagers to remaining players
    for (let i = totalWerewolves; i < playerCount; i++) {
        const playerName = `Spieler ${i + 1}`;
        const randomVillagerIndex = Math.floor(Math.random() * villagers.length);
        const assignedRole = villagers.splice(randomVillagerIndex, 1)[0];
        players.push({ name: playerName, role: assignedRole, alive: true });
    }

    updatePlayerList();
    document.getElementById('nextPhase').classList.remove('hidden');
}

// Aktualisierung der Spielerliste
function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';
    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name} - Rolle: ${player.role} (${player.alive ? "Lebendig" : "Ausgeschieden"})`;
        playerList.appendChild(li);
    });
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
