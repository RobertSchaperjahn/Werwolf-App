let currentIndex = 0;
let screens = [];
let selectedRoles = [];

document.getElementById("start-game-btn").addEventListener("click", () => {
  // Gespeicherte Rollen einsammeln
  const checkboxes = document.querySelectorAll("input[name=role]:checked");
  selectedRoles = Array.from(checkboxes).map(cb => cb.value);

  // Umschalten der Ansicht
  document.getElementById("start-container").style.display = "none";
  document.getElementById("screen-container").style.display = "block";

  // Screens laden und filtern
  fetch("screens.json")
    .then(res => res.json())
    .then(data => {
      screens = data.filter(screen => {
        const cond = screen.condition.toLowerCase();
        // Wenn keine Rolle in Bedingung vorkommt → immer zeigen
        if (cond.includes("immer") || cond.includes("standard")) return true;

        // Check: kommt eine gewählte Rolle in der Bedingung vor?
        return selectedRoles.some(role =>
          cond.includes(role.toLowerCase())
        );
      });
      showScreen(currentIndex);
    });
});

function showScreen(index) {
  const screen = screens[index];
  document.getElementById("screen-title").innerText = `Screen ${screen.id}: ${screen.title}`;
  document.getElementById("screen-purpose").innerText = screen.purpose;
  document.getElementById("screen-meta").innerHTML =
    `<strong>Wann:</strong> ${screen.shown_when}<br><strong>Bedingung:</strong> ${screen.condition}`;
}

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentIndex < screens.length - 1) {
    currentIndex++;
    showScreen(currentIndex);
  } else {
    alert("Ende erreicht");
  }
});
