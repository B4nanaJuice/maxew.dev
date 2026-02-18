function writeName(text, id = '.cycle-name', speed = 100) {
    let index = 0;
    let element = document.querySelector(id);

    element.style.background = '#0D6AD9';
    element.style.color = 'white';
    
    let timer = setInterval(function() {
        element.innerHTML = text.slice(0, index);

        if (index == 0) {
            element.style.background = 'none';
            element.style.color = '#333';
        }
        
        if (index++ === text.length) {
            clearInterval(timer);
        }
    }, speed);
}

function cycleName() {

    const availableNames = [
        "Maxime",
        "B4nanaJuice",
        "Développeur",
        "Etudiant",
        "Stagiaire en recherche",
        "Prof particulier"
    ]

    var index = 0;

    setInterval(() => {
        // index = (Math.floor(Math.random() * availableNames.length)) % availableNames.length;
        writeName(availableNames[++index % availableNames.length]);
    }, 5000);
}

cycleName();
