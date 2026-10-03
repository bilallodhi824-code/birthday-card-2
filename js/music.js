class MusicPlayer {
    constructor() {
        // Use local reliable audio file
        this.audio = new Audio('music/birthday-bg.mp3');
        this.audio.loop = true;
        this.audio.volume = 0.5; // Increased volume slightly
        this.isPlaying = false;
        
        // Wait for DOM
        document.addEventListener('DOMContentLoaded', () => this.init());
    }

    init() {
        this.toggleBtn = document.getElementById('musicToggle');
        this.iconPath = document.querySelector('#musicIcon path');
        
        // Attempt forced autoplay immediately
        if (localStorage.getItem('musicPlaying') !== 'false') {
            this.play();
        }

        if (!this.toggleBtn) return;

        // Click on the floating button
        this.toggleBtn.addEventListener('click', () => {
            this.toggle();
        });

        // Add auto-play attempt on any interaction if it was blocked
        ['click', 'touchstart', 'keydown', 'scroll', 'pointerdown'].forEach(evt => {
            window.addEventListener(evt, () => {
                if (localStorage.getItem('musicPlaying') !== 'false' && !this.isPlaying) {
                    this.play();
                }
            }, { once: true });
        });
    }

    play() {
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateUI();
            localStorage.setItem('musicPlaying', 'true');
        }).catch(e => {
            console.log('Autoplay prevented by browser, waiting for user interaction.');
            this.isPlaying = false;
            this.updateUI();
        });
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
        localStorage.setItem('musicPlaying', 'false');
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    updateUI() {
        if (!this.iconPath || !this.toggleBtn) return;
        
        if (this.isPlaying) {
            // Pause icon
            this.iconPath.setAttribute('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
            this.toggleBtn.style.borderColor = 'var(--accent-rose)';
            this.toggleBtn.style.boxShadow = '0 0 15px rgba(230, 168, 215, 0.4)';
        } else {
            // Play icon
            this.iconPath.setAttribute('d', 'M8 5v14l11-7z');
            this.toggleBtn.style.borderColor = 'var(--glass-border)';
            this.toggleBtn.style.boxShadow = 'none';
        }
    }
}

// Initialize music player as global instance
window.musicPlayer = new MusicPlayer();