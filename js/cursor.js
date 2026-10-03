// Custom Cursor
const cursor = document.querySelector('.custom-cursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Hover Effects
document.querySelectorAll('a, button, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2) rotate(180deg)';
        cursor.style.background = 'var(--primary-pink)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1) rotate(0deg)';
        cursor.style.background = 'var(--gradient)';
    });
});

// Click animation
document.addEventListener('click', (e) => {
    cursor.style.transform = 'scale(0)';
    setTimeout(() => {
        cursor.style.transform = 'scale(1)';
    }, 150);
});