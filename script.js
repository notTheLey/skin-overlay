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
            const skinUrl = `https://crafatar.com/skins/${data.id}`;
            const overlayUrl = skinType === 'player' ? 'assets/player-skin.png' : 'assets/team-skin.png';
            
            // Skin mit Overlay kombinieren
            combineSkins(skinUrl, overlayUrl);
        })
        .catch(error => {
            alert("Fehler beim Abrufen des Skins.");
            console.error(error);
        });
}

function combineSkins(skinUrl, overlayUrl) {
    const skinImage = document.getElementById('skinImage');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Hier solltest du eine Möglichkeit finden, das Bild mit Overlay zu kombinieren
    // Das kannst du mit einem Canvas-Element und JavaScript machen
    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Die Größe des Canvas setzen
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        // Overlay hinzufügen
        const overlay = new Image();
        overlay.onload = function () {
            ctx.drawImage(overlay, 0, 0);
            
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
    link.download = 'minecraft_skin.png';
    link.click();
}
