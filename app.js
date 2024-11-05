document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll("#playerCountButtons button").forEach(button => {
        button.addEventListener("click", function() {
            const count = parseInt(button.getAttribute("data-count"));
            if (!isNaN(count)) {
                setPlayerCount(count, button);
            }
        });
    });

    document.getElementById('manualStart').addEventListener('click', startManualGame);
    document.getElementById('assignRoles').addEventListener('click', assignRolesManually);
});

let playerCount = 0;
let players = [];

const roles = [
    "Werwolf", "Dielenschleiferin", "Heimscheißerin", "Prokrastinations Paula", "Schutzschild-Sigrid",
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

function assignRolesManually() {
    players.forEach((player, index) => {
        const nameInput = document.getElementById(`playerName${index + 1}`);
        const roleSelect = document.getElementById(`playerRole${index + 1}`);

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
