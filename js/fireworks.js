// Fireworks Simulation on Canvas

// Web Audio API Synthesizer for realistic firework sounds
class FireworkAudio {
    static init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    static playLaunch() {
        try {
            const isMusicPlaying = !window.musicPlayer || window.musicPlayer.isPlaying;
            if (!isMusicPlaying) return;
            this.init();
            
            const ctx = this.ctx;
            const now = ctx.currentTime;
            
            // Gain node for volume control
            const masterGain = ctx.createGain();
            masterGain.gain.setValueAtTime(0.03, now); // Faint rise sound
            masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            
            // Low-pass filtered noise for the whoosh sound
            const bufferSize = ctx.sampleRate * 0.5;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(250, now);
            filter.frequency.exponentialRampToValueAtTime(800, now + 0.4);
            
            noise.connect(filter);
            filter.connect(masterGain);
            masterGain.connect(ctx.destination);
            
            noise.start(now);
            noise.stop(now + 0.5);
        } catch (e) {
            console.warn("Audio error:", e);
        }
    }

    static playExplosion() {
        try {
            const isMusicPlaying = !window.musicPlayer || window.musicPlayer.isPlaying;
            if (!isMusicPlaying) return;
            this.init();
            
            const ctx = this.ctx;
            const now = ctx.currentTime;
            
            // 1. Low frequency thump (Boom)
            const osc = ctx.createOscillator();
            const gainOsc = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(140 + Math.random() * 40, now);
            osc.frequency.exponentialRampToValueAtTime(15, now + 0.4);
            
            gainOsc.gain.setValueAtTime(0.25, now); // Volume adjusted to fit with music
            gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            
            osc.connect(gainOsc);
            gainOsc.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
            
            // 2. High-pass crackle (Sparks)
            const bufferSize = ctx.sampleRate * 0.6;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            
            const filter = ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.setValueAtTime(800 + Math.random() * 400, now);
            
            const gainNoise = ctx.createGain();
            // Create crackly envelope using ValueCurve
            const curveLength = 40;
            const curveValues = new Float32Array(curveLength);
            for (let i = 0; i < curveLength; i++) {
                const t = i / (curveLength - 1);
                const decay = Math.pow(1 - t, 2);
                // Introduce random drops to create crackling effect
                const crackle = Math.random() > 0.45 ? 1 : 0.05;
                curveValues[i] = 0.12 * decay * crackle;
            }
            curveValues[0] = 0.12;
            curveValues[curveLength - 1] = 0;
            
            gainNoise.gain.setValueCurveAtTime(curveValues, now, 0.6);
            
            noise.connect(filter);
            filter.connect(gainNoise);
            gainNoise.connect(ctx.destination);
            
            noise.start(now);
            noise.stop(now + 0.6);
            
            // 3. High pitch shimmer (Optional extra sparkle)
            if (Math.random() > 0.35) {
                const shimmer = ctx.createOscillator();
                const shimmerGain = ctx.createGain();
                shimmer.type = 'sine';
                shimmer.frequency.setValueAtTime(2500 + Math.random() * 1500, now);
                shimmerGain.gain.setValueAtTime(0.015, now);
                shimmerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                shimmer.connect(shimmerGain);
                shimmerGain.connect(ctx.destination);
                shimmer.start(now);
                shimmer.stop(now + 0.5);
            }
        } catch (e) {
            console.warn("Audio error:", e);
        }
    }
}

class Firework {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetX = Math.random() * canvas.width;
        this.targetY = Math.random() * (canvas.height / 2);
        this.speed = 4 + Math.random() * 3;
        this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.distanceToTarget = this.calculateDistance(this.x, this.y, this.targetX, this.targetY);
        this.distanceTraveled = 0;
        this.coordinates = [];
        this.coordinateCount = 3;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.hue = Math.random() * 360;
    }

    calculateDistance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    update(index, fireworks, particles) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);

        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.distanceTraveled = this.calculateDistance(this.x, this.y, this.x + this.vx, this.y + this.vy) + this.distanceTraveled;

        if (this.distanceTraveled >= this.distanceToTarget) {
            this.createParticles(this.targetX, this.targetY, particles);
            fireworks.splice(index, 1);
            FireworkAudio.playExplosion();
        } else {
            this.x += this.vx;
            this.y += this.vy;
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        this.ctx.lineTo(this.x, this.y);
        this.ctx.strokeStyle = `hsl(${this.hue}, 100%, 50%)`;
        this.ctx.stroke();
    }

    createParticles(x, y, particles) {
        let particleCount = 60; // Increased for better effect
        while (particleCount--) {
            particles.push(new Particle(x, y, this.hue, this.ctx));
        }
    }
}

class Particle {
    constructor(x, y, hue, ctx) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.coordinates = [];
        this.coordinateCount = 5;
        while (this.coordinateCount--) {
            this.coordinates.push([this.x, this.y]);
        }
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 8 + 2; // Explosive speed
        this.friction = 0.95;
        this.gravity = 1;
        this.hue = hue + (Math.random() * 40 - 20); // Variety in color
        this.brightness = Math.random() * 50 + 50;
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.015;
    }

    update(index, particles) {
        this.coordinates.pop();
        this.coordinates.unshift([this.x, this.y]);
        this.speed *= this.friction;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + this.gravity;
        this.alpha -= this.decay;

        if (this.alpha <= this.decay) {
            particles.splice(index, 1);
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
        this.ctx.lineTo(this.x, this.y);
        this.ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
        this.ctx.stroke();
    }
}

// Global initialization of fireworks
function initFireworks() {
    const canvas = document.createElement('canvas');
    canvas.id = 'fireworksCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0'; // Behind everything else
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    let fireworks = [];
    let particles = [];
    let hue = 120;
    
    // Launch timer
    let timerTotal = 60; // frequent launches
    let timerTick = 0;

    function loop() {
        requestAnimationFrame(loop);
        
        hue += 0.5;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, width, height);
        ctx.globalCompositeOperation = 'lighter';

        let i = fireworks.length;
        while (i--) {
            fireworks[i].draw();
            fireworks[i].update(i, fireworks, particles);
        }

        let j = particles.length;
        while (j--) {
            particles[j].draw();
            particles[j].update(j, particles);
        }

        if (timerTick >= timerTotal) {
            fireworks.push(new Firework(canvas, ctx));
            FireworkAudio.playLaunch();
            fireworks.push(new Firework(canvas, ctx)); // Double fireworks
            timerTick = 0;
            // Randomize frequency slightly
            timerTotal = Math.random() * 40 + 30;
        } else {
            timerTick++;
        }
    }

    loop();
}

// Only launch fireworks if the user specifically requests or when fully loaded
// We'll auto-start them for a festive mood
document.addEventListener('DOMContentLoaded', () => {
    // Check if it's already running to avoid duplicates
    if (!document.getElementById('fireworksCanvas')) {
        initFireworks();
    }
});
