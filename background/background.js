// background.js - service worker
let timeToday = 0;
let lastDate = new Date().toDateString();

// Charger les stats
chrome.storage.local.get(["timeToday", "lastDate", "weekly"], (data) => {
  if (data.lastDate === new Date().toDateString()) {
    timeToday = data.timeToday || 0;
  } else {
    // Nouveau jour → on ajoute à la semaine
    let weekly = (data.weekly || 0) + (data.timeToday || 0);
    chrome.storage.local.set({ weekly, timeToday: 0, lastDate: new Date().toDateString() });
    timeToday = 0;
  }
});

// Compte toutes les 10 secondes quand Chrome est ouvert
setInterval(() => {
  timeToday += 10;
  chrome.storage.local.set({ timeToday });
  
  // Notification toutes les 20 min (règle 20-20-20)
  if (timeToday % (20*60) < 10) {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "/icons/icon48.png",
      title: "Night Owl",
      message: "Regarde à 20 mètres pendant 20 secondes",
      silent: true
    });
  }
}, 10000);

// Alarmes pour limite quotidienne
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyLimit") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "/icons/icon48.png",
      title: "Limite atteinte !",
      message: "Tu as dépassé ta limite d’écran aujourd’hui. Repose-toi",
      priority: 2
    });
  }
});