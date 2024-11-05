document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('startGame').addEventListener('click', startGame);
    document.getElementById('assignRoles').addEventListener('click', assignRoles);
    document.getElementById('nextPhase').addEventListener('click', nextPhase);

    // Füge Event Listener zu den Spieleranzahl-Buttons hinzu
    document.querySelectorAll("#playerCountButtons button").forEach(button => {
        button.addEventListener("click", function() {
            const count = parseInt(button.getAttribute("data-count"));
            setPlayerCount(count);
        });
    });
});

let playerCount;
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

// Funktion zur Festlegung der Spieleranzahl über die Buttons
function setPlayerCount(count) {
    playerCount = count;
    alert(`Spieleranzahl auf ${playerCount} festgelegt.`);
}

// Füge Event Listener zu den Spieleranzahl-Buttons hinzu
document.querySelectorAll("#playerCountButtons button").forEach(button => {
    button.addEventListener("click", function() {
        setPlayerCount(parseInt(button.innerText));
    });
});

// Start des Spiels und Wahl zwischen manueller und automatischer Rollenvergabe
function startGame() {
    if (!playerCount) {
        alert("Bitte wähle die Anzahl der Spieler.");
        return;
    }

    const isManualAssignment = confirm("Möchtest du die Rollen manuell zuweisen? OK für Ja, Abbrechen für Nein (automatisch)");

    if (isManualAssignment) {
        setupPlayers();
    } else {
        assignRolesAutomatically();
    }

    document.getElementById('setup').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
}

// Setzt Spieler für manuelle Eingabe der Namen und Rollen
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

// Automatische Rollenvergabe basierend auf Verteilungstabelle
function assignRolesAutomatically() {
    const distribution = roleDistribution[playerCount];
    const totalVillagers = distribution.villagers;
    const totalWerewolves = distribution.werewolves;

    let availableRoles = getAllRoles().filter(role => role !== "Vollsuff-Valentin" && role !== "Wahrsager-Weberin Waltraud");

    for (let i = 1; i <= playerCount; i++) {
        const isWerewolf = i <= totalWerewolves;
        const roleType = isWerewolf ? "werewolves" : "villagers";

        const randomRoleIndex = Math.floor(Math.random() * availableRoles.length);
        const assignedRole = availableRoles.splice(randomRoleIndex, 1)[0];

        players.push({ name: `Spieler ${i}`, role: assignedRole, alive: true });
        roles[roleType].push(assignedRole);
    }

    updatePlayerList();
    document.getElementById('nextPhase').classList.remove('hidden');
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
