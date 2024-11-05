document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('manualStart').addEventListener('click', startManualGame);
    document.getElementById('autoStart').addEventListener('click', startAutoGame);

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

const roles = [
    "Dielenschleiferin", "Heimscheißerin", "Prokrastinations Paula", "Schutzschild-Sigrid",
    "Bordell Bärbel", "Mansplaining Martin", "Kräuterhexe Hilde", "Nekromant Norbert", 
    "Boy-Butter Bäuerin", "Öko Sabine", "Bestatterin Brunhilde", "Nicht-binäre Türsteherperson Toni", 
    "Wachmann Wenzel", "Wut Wiebke", "Suizid Susie", "Doppelmoral-Dörthe", "Konversionstherapie Konny", 
    "Gloryhole Günni", "Blutmagierin Beatrix", "Klatsch-Käthe", "Vollsuff-Valentin", 
    "Wahrsager-Weberin Waltraud", "Keta-Zieherin Claudia", "Iltussy", "Trip-Sitterin Tanja", 
    "Giftmischerin Gertrud", "Travestiekünstler Tristan", "Der Twink", "Der geile Priester"
];

function setPlayerCount(count, button) {
    playerCount = count;
    document.querySelectorAll("#playerCountButtons button").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    console.log(`Spieleranzahl auf ${playerCount} festgelegt.`);
}

function startManualGame() {
    if (!playerCount) {
        alert("Bitte wähle die Anzahl der Spieler.");
        return;
    }
    setupPlayers();
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
}

function startAutoGame() {
    if (!playerCount) {
        alert("Bitte wähle die Anzahl der Spieler.");
        return;
    }
    assignRolesAutomatically();
    document.getElementById('setup').classList.add('hidden');
    document.getElementById('gameArea').classList.remove('hidden');
}

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
        roles.forEach(role => {
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
    console.log("Manuelles Setup abgeschlossen:", players);
}

function assignRolesAutomatically() {
    // Verteilung der Rollen gemäß Spieleranzahl abrufen
    const distribution = roleDistribution[playerCount];
    if (!distribution) {
        console.error(`Keine Rollenverteilung für ${playerCount} Spieler gefunden.`);
        return;
    }

    const { villagers: totalVillagers, werewolves: totalWerewolves } = distribution;

    // Sicherstellen, dass die Gesamtanzahl der Rollen mit der Spieleranzahl übereinstimmt
    if (totalVillagers + totalWerewolves !== playerCount) {
        console.error(`Fehler: Die Rollenanzahl (${totalVillagers + totalWerewolves}) stimmt nicht mit der Spieleranzahl (${playerCount}) überein.`);
        return;
    }

    // Rollen für die Spieler erstellen
    const rolesForGame = [
        ...Array(totalWerewolves).fill("Werwolf"),
        ...roles.slice(0, totalVillagers) // Dorfbewohner-Rollen basierend auf Anzahl
    ];

    // Rollen mischen
    shuffleArray(rolesForGame);

    // Spieler-Array erstellen und Rollen zuweisen
    players = rolesForGame.map((role, index) => ({
        name: `Spieler ${index + 1}`,
        role,
        alive: true
    }));

    console.log("Automatische Rollenverteilung abgeschlossen:", players);
    setupPlayerNames();
}

function setupPlayerNames() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    players.forEach((player, index) => {
        const li = document.createElement('li');

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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function setupPlayerNames() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    players.forEach((player, index) => {
        const li = document.createElement('li');

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

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
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
