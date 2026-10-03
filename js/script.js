// Custom Cursor Logic
const cursor = document.getElementById('custom-cursor');
if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .floating-audio').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// Page Loader and Progress Bar
// Page Loader and Progress Bar
document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('page-loader');
    const progressBar = document.querySelector('.progress-bar-fill');
    
    // Generate Lanterns for loading screen
    if (loader) {
        const lanternCount = 10;
        for (let i = 0; i < lanternCount; i++) {
            const lantern = document.createElement('div');
            lantern.classList.add('lantern');
            lantern.style.left = `${Math.random() * 90 + 5}vw`;
            lantern.style.animationDuration = `${Math.random() * 4 + 6}s`; // 6 to 10s
            lantern.style.animationDelay = `-${Math.random() * 10}s`; // Negative delay starts animation immediately from a random point
            const scale = Math.random() * 0.4 + 0.8;
            lantern.style.transform = `scale(${scale})`;
            loader.appendChild(lantern);
        }
    }
    
    if (loader && progressBar) {
        // Animate progress bar to 100% over 1.5 seconds
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20 + 10;
            if (progress >= 100) {
                progress = 100;
                progressBar.style.width = `${progress}%`;
                clearInterval(interval);
                
                const loadingText = document.getElementById('loading-text');
                if (loadingText) {
                    loadingText.innerText = 'Tap to Open ✨';
                    loadingText.style.cursor = 'pointer';
                    loadingText.style.fontWeight = '600';
                }
                
                const dismissLoader = () => {
                    if (window.musicPlayer && !window.musicPlayer.isPlaying) {
                        window.musicPlayer.play();
                    }
                    loader.style.opacity = '0';
                    setTimeout(() => {
                        loader.style.display = 'none';
                    }, 1000); // Wait for transition
                };

                loader.style.cursor = 'pointer';
                loader.addEventListener('click', dismissLoader);
                
            } else {
                progressBar.style.width = `${progress}%`;
            }
        }, 150);
    } else if (loader) {
        // Fallback if no progress bar
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 1000);
        }, 1000);
    }
});

// Generate Particles (Orbs and Balloons)
const particlesContainer = document.getElementById('particles-container');
if (particlesContainer) {
    const particleCount = 15;
    for (let i = 0; i < particleCount; i++) {
        const orb = document.createElement('div');
        orb.classList.add('orb');
        if (Math.random() > 0.5) {
            orb.classList.add('orb-rose');
        }
        
        // Random positioning and sizes for orbs
        const size = Math.random() * 100 + 50; // 50px to 150px
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        orb.style.left = `${Math.random() * 100}vw`;
        orb.style.animationDuration = `${Math.random() * 10 + 10}s`;
        orb.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(orb);
    }

    // Add Premium Balloons
    const balloonCount = 6;
    for (let i = 0; i < balloonCount; i++) {
        const balloon = document.createElement('div');
        balloon.classList.add('premium-balloon');
        if (Math.random() > 0.5) {
            balloon.classList.add('rose');
        }

        balloon.style.left = `${Math.random() * 90 + 5}vw`;
        balloon.style.animationDuration = `${Math.random() * 10 + 15}s`;
        balloon.style.animationDelay = `${Math.random() * 8}s`;
        const scale = Math.random() * 0.4 + 0.8;
        balloon.style.transform = `scale(${scale})`;
        
        particlesContainer.appendChild(balloon);
    }
}

// Reveal Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // Start observing reveal elements
    document.querySelectorAll('.reveal-up, .reveal').forEach(el => {
        observer.observe(el);
    });

    // Handle Envelope Sequence on Letter Page
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const envelope = document.getElementById('envelope');
    const letterContent = document.getElementById('letter-content');
    
    if (envelopeWrapper && envelope && letterContent) {
        // Wait 1.5s after load, then open envelope
        setTimeout(() => {
            envelope.classList.add('open');
            
            // Wait for envelope open animation to finish, then fade out envelope and show letter
            setTimeout(() => {
                envelopeWrapper.classList.add('envelope-vanish');
                
                setTimeout(() => {
                    letterContent.classList.add('show');
                }, 1000); // Wait for vanish
            }, 1500); // Wait for letter slide up
        }, 2000);
    }
});