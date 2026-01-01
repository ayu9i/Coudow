// ตั้งค่าพื้นหลังละอองทอง (Gold Dust)
tsParticles.load("tsparticles", {
    particles: {
        number: { value: 100 },
        color: { value: "#d4af37" },
        move: { enable: true, speed: 0.6 },
        size: { value: 2 },
        opacity: { value: 0.4 }
    }
});

// กำหนดวันปีใหม่ (ปรับเปลี่ยนได้ที่นี่)
let targetYear = 2026;
let targetDate = new Date(`Jan 1, ${targetYear} 00:00:00`).getTime();

function updateSystem() {
    const now = new Date();
    
    // อัปเดตเวลาจริงปัจจุบัน
    document.getElementById('currentDate').innerText = `-- ${now.toLocaleDateString('th-TH', {day:'numeric', month:'LONG', year:'numeric'})} --`;
    document.getElementById('realTimeClock').innerText = now.toLocaleTimeString('en-GB');

    const diff = targetDate - now.getTime();

    // เมื่อถึงเวลา (Countdown จบ)
    if (diff <= 0) {
        showCelebration();
    } else {
        document.getElementById('days').innerText = Math.floor(diff / 86400000).toString().padStart(2, '0');
        document.getElementById('hours').innerText = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
        document.getElementById('mins').innerText = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        document.getElementById('secs').innerText = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    }
}

function showCelebration() {
    document.getElementById('wait-screen').classList.add('hidden');
    document.getElementById('celebration-screen').classList.remove('hidden');
    
    // เริ่มยิงพลุอลังการ
    launchFirework();
}

function launchFirework() {
    const duration = 15 * 1000; // ยิงนาน 15 วินาที
    const animationEnd = Date.now() + duration;

    (function frame() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return;

        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#ffd700', '#ffffff', '#ffdf00']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#ffd700', '#ffffff', '#ffdf00']
        });

        requestAnimationFrame(frame);
    }());
}

// ปุ่มทดลองเวลา (WARP TIME)
function applyTest() {
    const val = document.getElementById('testInput').value;
    if(val) {
        targetDate = new Date(val).getTime();
        document.getElementById('wait-screen').classList.remove('hidden');
        document.getElementById('celebration-screen').classList.add('hidden');
    }
}

setInterval(updateSystem, 1000);
