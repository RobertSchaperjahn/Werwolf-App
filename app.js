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

let connectionPhaseDone = false; // Flag, um festzuhalten, ob die Verbindung erstellt wurde

// Startet die Nachtphase und überprüft die Verbindungsrollen
function startNightPhase() {
    if (!connectionPhaseDone) {
        console.log("Nachtphase gestartet und Verbindungsrollen überprüft.");
        alert("Nachtphase beginnt jetzt!");
        checkForConnectionRoles();
        connectionPhaseDone = true; // Markiere die Verbindungsphase als abgeschlossen

        // Button-Text zu "Nächster Spieler" ändern
        document.getElementById('startNightPhaseButton').textContent = "Nächster Spieler";
    } else {
        console.log("Zur nächsten Phase wechseln.");
        // Hier könnte die Logik für die Nachtphase fortgesetzt werden
    }
}

// Prüft auf Rollen, die Verbindungen herstellen können
function checkForConnectionRoles() {
    console.log("Überprüfung der Verbindungsrollen gestartet.");
    const valentin = players.find(player => player.role === "Vollsuff-Valentin");
    const waltraud = players.find(player => player.role === "Wahrsager-Weberin Waltraud");

    if (valentin) {
        alert(`${valentin.name} ist Vollsuff-Valentin und soll 3 Spieler verbinden.`);
        connectPlayers(valentin, 3);
    } else {
        console.log("Kein Vollsuff-Valentin im Spiel.");
    }
    if (waltraud) {
        alert(`${waltraud.name} ist Wahrsager-Weberin Waltraud und soll 2 Spieler verbinden.`);
        connectPlayers(waltraud, 2);
    } else {
        console.log("Keine Wahrsager-Weberin Waltraud im Spiel.");
    }
}

// Verbindet die angegebenen Spieler, ohne dass Konny oder der Priester ein Herz bekommen
function connectPlayers(player, numConnections) {
    const selectedPlayers = [];
    let connected = 0;

    while (connected < numConnections) {
        const playerName = prompt(`Wähle den Namen des Spielers, der verbunden werden soll (${connected + 1}/${numConnections}):`);
        const targetPlayer = players.find(p => p.name === playerName);

        if (!targetPlayer) {
            alert("Spieler nicht gefunden. Bitte einen gültigen Namen eingeben.");
            continue;
        }

        if (targetPlayer.role === "Konversionstherapie Konny" || targetPlayer.role === "Der geile Priester") {
            alert(`Verbindung mit ${targetPlayer.name} ist nicht möglich, wird aber zum Schein angezeigt.`);
            selectedPlayers.push(targetPlayer);
        } else {
            selectedPlayers.push(targetPlayer);
            targetPlayer.connected = true;
            alert(`${targetPlayer.name} wurde erfolgreich verbunden und hat ein Herz erhalten.`);
        }

        connected++;
    }

    updatePlayerListWithConnections();
}

// Aktualisiert die Anzeige der Spieler und fügt Herzen für verbundene Spieler hinzu
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

// Beispiel: Button-Event für Nachtphase hinzufügen
document.getElementById('startNightPhaseButton').addEventListener('click', startNightPhase);
