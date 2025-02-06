let config = {};

async function loadConfig() {
    try {
        const response = await fetch('assets/config.json');
        if (!response.ok) throw new Error(`HTTP Fehler! Status: ${response.status}`);
        config = await response.json();
        console.log("Config geladen:", config); // Debug-Ausgabe
        loadSkinTypes();
    } catch (error) {
        console.error("Fehler beim Laden der config.json:", error);
        alert("Fehler beim Laden der Konfiguration. Überprüfe die Konsole.");
    }
}

function loadSkinTypes() {
    const skinTypeSelect = document.getElementById('skinType');
    if (!config.skinTypes || config.skinTypes.length === 0) {
        console.error("Keine Skin-Typen in der config.json gefunden.");
        return;
    }

    skinTypeSelect.innerHTML = ""; // Optionen zurücksetzen
    config.skinTypes.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.name;
        skinTypeSelect.appendChild(optionElement);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadConfig(); // Config laden
    document.getElementById('loadSkinBtn').addEventListener('click', getSkin);
});

async function getSkin() {
    const username = document.getElementById('username').value;
    const skinType = document.getElementById('skinType').value;

    if (!username) {
        alert("Bitte gib einen Minecraft Namen ein.");
        return;
    }

    try {
        const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
        if (!response.ok) throw new Error("Spieler nicht gefunden");
        const data = await response.json();
        const skinUrl = `${config.skinUrlBase}${data.id}`;
        const overlayUrl = config.overlayPaths[skinType];

        extractHeadAndApplyOverlay(skinUrl, overlayUrl);
    } catch (error) {
        alert("Fehler beim Abrufen des Skins.");
        console.error(error);
    }
}

function extractHeadAndApplyOverlay(skinUrl, overlayUrl) {
    const skinImage = document.getElementById('skinImage');
    const downloadBtn = document.getElementById('downloadBtn');

    const img = new Image();
    img.crossOrigin = "anonymous"; // Wichtig für externe Bilder!
    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const headWidth = config.headDimensions.width;
        const headHeight = config.headDimensions.height;

        canvas.width = headWidth;
        canvas.height = headHeight;

        // Nur den Kopf extrahieren (8,8 bis 24,24)
        ctx.drawImage(img, 8, 8, headWidth, headHeight, 0, 0, headWidth, headHeight);

        // Overlay hinzufügen
        const overlay = new Image();
        overlay.crossOrigin = "anonymous";
        overlay.onload = function () {
            ctx.drawImage(overlay, 0, 0, headWidth, headHeight);
            skinImage.src = canvas.toDataURL();
            downloadBtn.style.display = 'inline-block';
        };
        overlay.src = overlayUrl;
    };
    img.src = skinUrl;
}

function downloadSkin() {
    const img = document.getElementById('skinImage');
    if (!img.src) return;

    const link = document.createElement('a');
    link.href = img.src;
    link.download = 'minecraft_head.png';
    link.click();
}

