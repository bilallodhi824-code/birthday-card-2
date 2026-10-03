// Countdown Timer
class CountdownTimer {
    constructor(targetDate, elements) {
        this.targetDate = new Date(targetDate).getTime();
        this.elements = elements;
        this.updateCountdown();
        setInterval(() => this.updateCountdown(), 1000);
    }

    updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = this.targetDate - now;

        if (timeLeft > 0) {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            this.elements.days.textContent = days.toString().padStart(2, '0');
            this.elements.hours.textContent = hours.toString().padStart(2, '0');
            this.elements.minutes.textContent = minutes.toString().padStart(2, '0');
            this.elements.seconds.textContent = seconds.toString().padStart(2, '0');
        } else {
            // Birthday has arrived!
            document.getElementById('countdown').innerHTML = `
                <div class="birthday-arrived">
                    <h3>🎉 HAPPY BIRTHDAY! 🎉</h3>
                    <div class="celebration-text">It's Your Special Day!</div>
                </div>
            `;
        }
    }
}

// Initialize countdown (set your friend's birthday date here)
const birthdayDate = '2024-12-25T00:00:00'; // Change this date
const countdownElements = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};

if (countdownElements.days) {
    new CountdownTimer(birthdayDate, countdownElements);
}