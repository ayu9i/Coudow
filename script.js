// --- 1. การตั้งค่าเป้าหมาย (Lock เป้าหมายที่ปี 2027) ---
// ปี 2027 ค.ศ. = 2570 พ.ศ.
const TARGET_YEAR = 2027; 
let targetDate = new Date(`Jan 1, ${TARGET_YEAR} 00:00:00`).getTime();
let isCelebrated = false;

// --- 2. ระบบนาฬิกาและนับถอยหลัง Real-time ---
function updateClock() {
    const now = new Date();
    const currentTime = now.getTime();

    // แสดงวันที่ปัจจุบัน (รูปแบบภาษาไทย พ.ศ.)
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('currentDate').innerText = `-- ${now.toLocaleDateString('th-TH', dateOptions)} --`;
    
    // แสดงเวลาปัจจุบันแบบ 24 ชม. (นาฬิกาดิจิทัลเรียบหรู)
    document.getElementById('realTimeClock').innerText = now.toLocaleTimeString('en-GB', { hour12: false });

    // คำนวณส่วนต่างเวลา
    const diff = targetDate - currentTime;

    // เงื่อนไขการสลับหน้าจอ (The Logic)
    if (diff <= 0 && !isCelebrated) {
        // เมื่อถึงเวลา 00:00:00 ของปี 2027
        triggerCelebration();
    } else if (isCelebrated) {
        // เงื่อนไขพิเศษ: ถ้าเวลาปัจจุบัน "เลยตี 1" ของวันที่ 1 มกราไปแล้ว
        // ให้ระบบรีเซ็ตกลับไปหน้า Countdown เพื่อรอปีถัดไป (2028)
        if (now.getFullYear() === TARGET_YEAR && now.getHours() >= 1) {
            prepareNextYear();
        }
    } else {
        // การคำนวณตัวเลข Countdown แบบแม่นยำ
        renderCountdown(diff);
    }
}

function renderCountdown(diff) {
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = d.toString().padStart(2, '0');
    document.getElementById('hours').innerText = h.toString().padStart(2, '0');
    document.getElementById('mins').innerText = m.toString().padStart(2, '0');
    document.getElementById('secs').innerText = s.toString().padStart(2, '0');
}

// --- 3. ระบบเซอร์ไพรส์อลังการ (Grand Celebration) ---
function triggerCelebration() {
    isCelebrated = true;
    document.getElementById('wait-screen').classList.add('hidden');
    document.getElementById('celebration-screen').classList.remove('hidden');

    // เอฟเฟกต์พลุแบบจัดเต็มต่อเนื่อง (ใช้ Library canvas-confetti)
    const duration = 30 * 1000; // ยิงต่อเนื่อง 30 วินาที
    const animationEnd = Date.now() + duration;
    const colors = ['#d4af37', '#ffffff', '#fcf6ba', '#aa771c'];

    (function frame() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return;

        // ยิงจากฝั่งซ้าย
        confetti({
            particleCount: 10,
            angle: 60,
            spread: 70,
            origin: { x: 0, y: 0.6 },
            colors: colors,
            scalar: 1.2
        });
        // ยิงจากฝั่งขวา
        confetti({
            particleCount: 10,
            angle: 120,
            spread: 70,
            origin: { x: 1, y: 0.6 },
            colors: colors,
            scalar: 1.2
        });

        requestAnimationFrame(frame);
    }());
}

// --- 4. ระบบ Lab Mode และการเตรียมปีถัดไป ---
function prepareNextYear() {
    isCelebrated = false;
    // ตั้งเป้าหมายใหม่เป็นปี 2028
    targetDate = new Date(`Jan 1, ${TARGET_YEAR + 1} 00:00:00`).getTime();
    document.getElementById('wait-screen').classList.remove('hidden');
    document.getElementById('celebration-screen').classList.add('hidden');
}

function applyTest() {
    const testVal = document.getElementById('testInput').value;
    if (testVal) {
        isCelebrated = false;
        targetDate = new Date(testVal).getTime();
        document.getElementById('wait-screen').classList.remove('hidden');
        document.getElementById('celebration-screen').classList.add('hidden');
        console.log("Lab Mode: Warped to " + testVal);
    }
}

// เริ่มต้นการทำงานของระบบ
setInterval(updateClock, 1000);
updateClock();
