// --- 1. การตั้งค่าพื้นฐาน (Configuration) ---
let targetDate;
let isCelebrated = false;

// ฟังก์ชันหาเวลาเป้าหมาย (เที่ยงคืนของปีถัดไป)
function getNextNewYear() {
    const now = new Date();
    const currentYear = now.getFullYear();
    // ถ้าเวลาตอนนี้เกินตี 1 ของวันที่ 1 มกราไปแล้ว ให้เป้าหมายเป็นปีถัดไปเลย
    if (now.getMonth() === 0 && now.getDate() === 1 && now.getHours() >= 1) {
        return new Date(`Jan 1, ${currentYear + 1} 00:00:00`).getTime();
    }
    return new Date(`Jan 1, ${currentYear + 1} 00:00:00`).getTime();
}

targetDate = getNextNewYear();

// --- 2. ระบบนาฬิกาและนับถอยหลัง ---
function updateClock() {
    const now = new Date();
    const currentTime = now.getTime();

    // แสดงวันที่และเวลาปัจจุบัน (เรียบหรู)
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('currentDate').innerText = now.toLocaleDateString('th-TH', dateOptions);
    document.getElementById('realTimeClock').innerText = now.toLocaleTimeString('en-GB', { hour12: false });

    // คำนวณส่วนต่างเวลา
    const diff = targetDate - currentTime;

    // เงื่อนไขการแสดงผล
    if (diff <= 0 && !isCelebrated) {
        // เมื่อถึงเวลา 00:00:00
        triggerCelebration();
    } else if (isCelebrated) {
        // เช็คเงื่อนไขหลังตี 1 (01:00:00) เพื่อเริ่มนับใหม่ของปีหน้า
        if (now.getHours() >= 1 && now.getHours() < 5) {
            resetForNextYear();
        }
    } else {
        // การคำนวณตัวเลข Countdown
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = d.toString().padStart(2, '0');
        document.getElementById('hours').innerText = h.toString().padStart(2, '0');
        document.getElementById('mins').innerText = m.toString().padStart(2, '0');
        document.getElementById('secs').innerText = s.toString().padStart(2, '0');
    }
}

// --- 3. ระบบเซอร์ไพรส์ (The Grand Reveal) ---
function triggerCelebration() {
    isCelebrated = true;
    document.getElementById('wait-screen').classList.add('hidden');
    document.getElementById('celebration-screen').classList.remove('hidden');

    // พลุอลังการต่อเนื่อง 30 วินาที
    const duration = 30 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#bf953f', '#fcf6ba', '#b38728', '#ffffff'];

    (function frame() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return;

        confetti({
            particleCount: 8,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.6 },
            colors: colors
        });
        confetti({
            particleCount: 8,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.6 },
            colors: colors
        });

        requestAnimationFrame(frame);
    }());
}

// --- 4. ระบบรีเซ็ตและ Lab Mode ---
function resetForNextYear() {
    isCelebrated = false;
    targetDate = getNextNewYear();
    document.getElementById('wait-screen').classList.remove('hidden');
    document.getElementById('celebration-screen').classList.add('hidden');
}

function applyTest() {
    const testVal = document.getElementById('testInput').value;
    if (testVal) {
        // เมื่อใช้ Lab Mode ให้รีเซ็ตสถานะการฉลองก่อน
        isCelebrated = false;
        targetDate = new Date(testVal).getTime();
        document.getElementById('wait-screen').classList.remove('hidden');
        document.getElementById('celebration-screen').classList.add('hidden');
        alert("Warped to: " + new Date(testVal).toLocaleString());
    }
}

// เริ่มต้นทำงาน
setInterval(updateClock, 1000);
updateClock(); // รันทันที 1 ครั้งไม่ต้องรอ Interval
