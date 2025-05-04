let currentIndex = 0;
let screens = [];

fetch("screens.json")
  .then((res) => res.json())
  .then((data) => {
    screens = data;
    showScreen(currentIndex);
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
