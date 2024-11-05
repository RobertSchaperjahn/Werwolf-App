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

    // Startet die erste Nachtphase automatisch nach der Rollenzuweisung
    nextPhase();
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
let currentPhase = "Nacht";
let phaseStep = 0;

// Liste der Ereignisse für die Nachtphase
const nightEvents = [
    einaeugigeDealerinEvent,
    // Hier können weitere Ereignisse hinzugefügt werden, z.B. werewolfAttackEvent
];

// Beispiel: Die einäugige Dealerin als Event
function einaeugigeDealerinEvent() {
    alert("Die einäugige Dealerin ist jetzt aktiv! Spieler (außer Werwölfe) können auf Wunsch eine neue Rolle erhalten.");

    players.forEach((player) => {
        if (player.role !== "Werwolf") {
            const wantsNewRole = confirm(`Soll ${player.name} eine neue Rolle erhalten?`);
            if (wantsNewRole) {
                const newRoleIndex = Math.floor(Math.random() * roles.length);
                player.role = roles[newRoleIndex];
                alert(`${player.name} hat jetzt die Rolle: ${player.role}`);
            }
        }
    });
    nextPhase();
}
// Funktion, um zum nächsten Ereignis überzugehen
function nextPhase() {
    if (currentPhase === "Nacht") {
        if (phaseStep < nightEvents.length) {
            nightEvents[phaseStep]();
            phaseStep++;
        } else {
            currentPhase = "Tag";
            phaseStep = 0;
            alert("Es ist Tag. Die Diskussion beginnt.");
            startDiscussionTimer();
        }
    } else {
        currentPhase = "Nacht";
        phaseStep = 0;
        alert("Die Nacht beginnt. Die Ereignisse werden ausgeführt.");
        nextPhase();
    }
}

// Funktion für die Tagphase-Diskussion mit Timer
function startDiscussionTimer(duration = 60) {  // Dauer in Sekunden
    let timer = duration;
    const interval = setInterval(() => {
        if (timer > 0) {
            console.log(`Diskussionszeit: ${timer} Sekunden`);
            timer--;
        } else {
            clearInterval(interval);
            alert("Diskussionszeit ist abgelaufen. Stimmen Sie ab, wer gelyncht werden soll.");
        }
    }, 1000);
}
