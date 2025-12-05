// content.js
let currentMode = "none";

// Applique un mode
function applyMode(mode) {
  // On enlève les anciens
  document.body.classList.remove("nightowl-absolute-dark", "nightowl-reader", "nightowl-deuteranopia", "owl-protanopia", "owl-tritanopia");
  
  if (mode === "absolute") {
    document.body.classList.add("nightowl-absolute-dark");
  } else if (mode === "reader") {
    document.body.classList.add("nightowl-reader");
  } else if (mode.startsWith("colorblind-")) {
    document.body.classList.add("owl-" + mode.split("-")[1]);
  }
  
  currentMode = mode;
}

// Écoute les messages du popup ou du background
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "setMode") {
    applyMode(msg.mode);
  }
});

// Au chargement, on récupère le mode sauvegardé
chrome.storage.sync.get(["mode"], (res) => {
  if (res.mode) applyMode(res.mode);
});