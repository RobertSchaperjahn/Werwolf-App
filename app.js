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
let currentPhase = "Nacht";

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
    updatePlayerListWithRoleSwap();
    document.getElementById('assignRoles').classList.add('hidden');
}

function updatePlayerListWithRoleSwap() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    players.forEach((player, index) => {
        const li = document.createElement('li');
        li.textContent = `${player.name} - Rolle: ${player.role} (${player.alive ? "Lebendig" : "Ausgeschieden"})`;

        // Button für Rollentausch hinzufügen (nur für Nicht-Werwölfe)
        if (player.role !== "Werwolf") {
            const swapButton = document.createElement('button');
            swapButton.textContent = "Rolle tauschen";
            swapButton.addEventListener('click', () => swapRole(index));
            li.appendChild(swapButton);
        }

        playerList.appendChild(li);
    });

    // Button zur nächsten Phase
    const nextPhaseButton = document.createElement('button');
    nextPhaseButton.textContent = "Nächste Phase";
    nextPhaseButton.addEventListener('click', nextPhase);
    playerList.appendChild(nextPhaseButton);
}

// Rollentausch-Funktion
function swapRole(index) {
    const newRoleIndex = Math.floor(Math.random() * roles.length);
    players[index].role = roles[newRoleIndex];
    alert(`${players[index].name} hat jetzt die Rolle: ${players[index].role}`);
    updatePlayerListWithRoleSwap(); // Liste nach Rollentausch aktualisieren
}

function nextPhase() {
    alert("Die nächste Phase beginnt!");
    // Hier können wir zur nächsten Phase übergehen und den nächsten Satz von Ereignissen starten
}
function checkForConnectionRoles() {
    const valentin = players.find(player => player.role === "Vollsuff-Valentin");
    const waltraud = players.find(player => player.role === "Wahrsager-Weberin Waltraud");

    if (valentin) {
        connectPlayers(valentin, 3);
    }
    if (waltraud) {
        connectPlayers(waltraud, 2);
    }
}

function connectPlayers(player, numConnections) {
    alert(`${player.name} (Rolle: ${player.role}) soll ${numConnections} Spieler verbinden.`);

    const selectedPlayers = [];
    let connected = 0;

    while (connected < numConnections) {
        const playerName = prompt(`Wähle den Namen des Spielers, der verbunden werden soll (${connected + 1}/${numConnections}):`);
        const targetPlayer = players.find(p => p.name === playerName);

        if (!targetPlayer) {
            alert("Spieler nicht gefunden. Bitte einen gültigen Namen eingeben.");
            continue;
        }
        // Prüfen, ob es sich um Konny oder Der Priester handelt
        if ((targetPlayer.role === "Konversionstherapie Konny" || targetPlayer.role === "Der geile Priester") && player.role === "Vollsuff-Valentin") {
            alert("Verbindung zu diesem Spieler ist nicht möglich, aber es wird nicht angezeigt.");
            continue;
        }
        
        selectedPlayers.push(targetPlayer);
        connected++;
    }

    // Herzen hinzufügen, außer es handelt sich um verbotene Verbindungen
    selectedPlayers.forEach(selected => {
        if (selected.role !== "Konversionstherapie Konny" && selected.role !== "Der geile Priester") {
            selected.connected = true;  // Markiere die Verbindung
        }
    });
    updatePlayerListWithConnections();
}

function updatePlayerListWithConnections() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';

    players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name} - Rolle: ${player.role} (${player.alive ? "Lebendig" : "Ausgeschieden"})`;

        // Herzsymbol für verbundene Spieler anzeigen
        if (player.connected) {
            li.innerHTML += " ❤️";
        }

        playerList.appendChild(li);
    });
}
