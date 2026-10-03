function launchFireworks() {
    // Create multiple fireworks
    for (let i = 0; i < 50; i++) {
        setTimeout(() => createFirework(), i * 100);
    }
}

function createFirework() {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = Math.random() * 100 + 'vw';
    firework.style.top = '100vh';
    
    // Firework colors
    const colors = ['#ff9aa2', '#a8e6cf', '#ffd93d', '#ff6b6b', '#4ecdc4'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(firework);
    
    // Launch animation
    firework.animate([
        { transform: 'translateY(-100vh)', opacity: 1 },
        { transform: 'translateY(-50vh) scale(0)', opacity: 1 }
    ], {
        duration: 1500,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).onfinish = () => {
        createExplosion(firework, color);
    };
}

function createExplosion(firework, color) {
    firework.style.background = color;
    firework.style.width = '6px';
    firework.style.height = '6px';
    firework.style.borderRadius = '50%';
    
    // Explosion particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.background = color;
        particle.style.left = firework.style.left;
        particle.style.top = firework.style.top;
        
        const angle = (i / 20) * Math.PI * 2;
        const velocity = 200 + Math.random() * 200;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        document.body.appendChild(particle);
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { 
                transform: `translate(${vx}px, ${vy}px) scale(0)`, 
                opacity: 0 
            }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => particle.remove();
    }
    
    firework.remove();
}

function releaseBalloons() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const balloon = document.createElement('div');
            balloon.innerHTML = '🎈';
            balloon.style.position = 'fixed';
            balloon.style.left = Math.random() * 100 + 'vw';
            balloon.style.bottom = '-100px';
            balloon.style.fontSize = '30px';
            balloon.style.zIndex = '1001';
            balloon.style.pointerEvents = 'none';
            
            document.body.appendChild(balloon);
            
            balloon.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: 'translateY(-120vh) rotate(720deg)', opacity: 0 }
            ], {
                duration: 5000 + Math.random() * 2000
            }).onfinish = () => balloon.remove();
        }, i * 150);
    }
}

// Auto fireworks on surprise page
if (document.body.classList.contains('surprise-page')) {
    setInterval(() => {
        if (Math.random() > 0.7) {
            createFirework();
        }
    }, 2000);
}