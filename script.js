let config = {};

fetch('assets/config.json')
    .then(response => response.json())
    .then(data => {
        config = data;
        loadSkinTypes();  // Dynamisch die Auswahloptionen laden
    })
    .catch(error => {
        console.error("Fehler beim Laden der config.json:", error);
    });

function loadSkinTypes() {
    const skinTypeSelect = document.getElementById('skinType');
    config.skinTypes.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.name;
        skinTypeSelect.appendChild(optionElement);
    });
}

document.getElementById('loadSkinBtn').addEventListener('click', getSkin);

function getSkin() {
    const username = document.getElementById('username').value;
    const skinType = document.getElementById('skinType').value;
    const skinImage = document.getElementById('skinImage');
    const downloadBtn = document.getElementById('downloadBtn');
    
    if (!username) {
        alert("Bitte gib einen Minecraft Namen ein.");
        return;
    }
    
    const skinUrl = `https://api.mojang.com/users/profiles/minecraft/${username}`;
    
    fetch(skinUrl)
        .then(response => response.json())
        .then(data => {
            const skinUrl = `${config.skinUrlBase}${data.id}`;
            const overlayUrl = config.overlayPaths[skinType];

            // Skin nur mit dem Kopf extrahieren und Overlay anwenden
            extractHeadAndApplyOverlay(skinUrl, overlayUrl);
        })
        .catch(error => {
            alert("Fehler beim Abrufen des Skins.");
            console.error(error);
        });
}

function extractHeadAndApplyOverlay(skinUrl, overlayUrl) {
    const skinImage = document.getElementById('skinImage');
    const downloadBtn = document.getElementById('downloadBtn');
    
    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Extrahiere nur den Kopfbereich des Skins (16x16)
        const headWidth = config.headDimensions.width;
        const headHeight = config.headDimensions.height;
        
        canvas.width = headWidth;
        canvas.height = headHeight;

        // Zeichne den Kopf auf das Canvas
        ctx.drawImage(img, 8, 8, headWidth, headHeight, 0, 0, headWidth, headHeight);

        // Overlay hinzufügen
        const overlay = new Image();
        overlay.onload = function () {
            ctx.drawImage(overlay, 0, 0, headWidth, headHeight);
            
            // Das kombinierte Bild anzeigen
            skinImage.src = canvas.toDataURL();
            downloadBtn.style.display = 'inline-block';
        };
        overlay.src = overlayUrl;
    };
    img.src = skinUrl;
}

function downloadSkin() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = document.getElementById('skinImage');
    
    // Bild auf Canvas zeichnen
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    // Bild herunterladen
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'minecraft_head.png';
    link.click();
}

