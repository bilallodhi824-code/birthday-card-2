document.addEventListener('DOMContentLoaded', () => {
    const petalsContainer = document.getElementById('petals-container');
    if (!petalsContainer) return;

    const petalCount = 25;
    const glowCount = 15;

    // Create Petals
    for (let i = 0; i < petalCount; i++) {
        createPetal(petalsContainer);
    }

    // Create Glow Particles
    for (let i = 0; i < glowCount; i++) {
        createGlow(petalsContainer);
    }
});

function createPetal(container) {
    const petal = document.createElement('div');
    petal.classList.add('petal');
    
    // Randomize properties
    const left = Math.random() * 100; // 0 to 100%
    const animDuration = Math.random() * 4 + 6; // 6s to 10s
    const animDelay = Math.random() * 5; // 0s to 5s
    const size = Math.random() * 10 + 15; // 15px to 25px
    const rotateZ = Math.random() * 360; // Initial rotation

    petal.style.left = `${left}%`;
    petal.style.width = `${size}px`;
    petal.style.height = `${size * 1.2}px`;
    petal.style.animationDuration = `${animDuration}s, ${animDuration}s`;
    petal.style.animationDelay = `${animDelay}s, ${animDelay}s`;
    
    // Add realistic 3D rotation variable
    petal.style.setProperty('--rot-x', `${Math.random() * 360}deg`);
    petal.style.setProperty('--rot-y', `${Math.random() * 360}deg`);
    petal.style.setProperty('--rot-z', `${rotateZ}deg`);

    container.appendChild(petal);
    
    // Recycle petal when animation ends
    petal.addEventListener('animationend', (e) => {
        if(e.animationName === 'fallPetal') {
            petal.remove();
            createPetal(container);
        }
    });
}

function createGlow(container) {
    const glow = document.createElement('div');
    glow.classList.add('petal-glow');

    const left = Math.random() * 100;
    const animDuration = Math.random() * 3 + 5;
    const animDelay = Math.random() * 5;
    const size = Math.random() * 4 + 2;

    glow.style.left = `${left}%`;
    glow.style.width = `${size}px`;
    glow.style.height = `${size}px`;
    glow.style.animationDuration = `${animDuration}s`;
    glow.style.animationDelay = `${animDelay}s`;

    container.appendChild(glow);

    glow.addEventListener('animationend', () => {
        glow.remove();
        createGlow(container);
    });
}
