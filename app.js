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
