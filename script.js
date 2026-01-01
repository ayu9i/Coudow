// 1. ตั้งค่าเป้าหมายปีใหม่
let now = new Date();
let currentYear = now.getFullYear(); // 2026
let targetDate;

// Logic การกำหนดเป้าหมาย
if (now.getMonth() === 0 && now.getDate() === 1 && now.getHours() < 6) {
    // ถ้าเป็นวันที่ 1 ม.ค. ก่อน 6 โมงเช้า ให้เป้าหมายเป็นปีนี้ (เพื่อเช็คเซอร์ไพรส์)
    targetDate = new Date(`Jan 1, ${currentYear} 00:00:00`).getTime();
} else {
    // ถ้าหลัง 6 โมงเช้า หรือวันอื่นๆ ให้เป้าหมายเป็นปีหน้า (2027)
    targetDate = new Date(`Jan 1, ${currentYear + 1} 00:00:00`).getTime();
}

let isCelebrated = false;

function updateSystem() {
    const currentTime = new Date();
    const curH = currentTime.getHours();
    const curM = currentTime.getMonth();
    const curD = currentTime.getDate();

    // แสดงวันที่และเวลาปกติ
    document.getElementById('currentDate').innerText = currentTime.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('realTimeClock').innerText = currentTime.toLocaleTimeString('en-GB');

    // --- ส่วนตัดสินใจการแสดงผล ---
    
    // 1. ช่วงเวลาเซอร์ไพรส์ (เที่ยงคืนเป๊ะ)
    if (curM === 0 && curD === 1 && curH === 0 && currentTime.getMinutes() < 1) {
        if (!isCelebrated) triggerCelebration();
        return;
    }

    // 2. ช่วงเวลา "หมดเวลาเค้าดาวน์แล้ว" (ตี 1 - ตี 5)
    if (curM === 0 && curD === 1 && curH >= 1 && curH < 6) {
        showTimeoutScreen();
        return;
    }

    // 3. ช่วงเวลานับถอยหลังปกติ (รวมถึงหลัง 6 โมงเช้าวันที่ 1 ม.ค. ที่จะนับไปปีหน้า)
    const diff = targetDate - currentTime.getTime();
    
    if (diff > 0) {
        isCelebrated = false;
        document.getElementById('wait-screen').classList.remove('hidden');
        document.getElementById('celebration-screen').classList.add('hidden');
        renderCountdown(diff);
    }
    
    updateLunarAndHolidays(currentTime);
}

// ฟังก์ชันนับถอยหลัง
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

// ฟังก์ชันโชว์เซอร์ไพรส์
function triggerCelebration() {
    isCelebrated = true;
    const waitScreen = document.getElementById('wait-screen');
    const celebScreen = document.getElementById('celebration-screen');
    
    waitScreen.classList.add('hidden');
    celebScreen.classList.remove('hidden');
    
    // คำอวยพรแบบสุ่ม
    const wishes = [
        "ขอให้ปี 2026 เป็นปีที่เต็มไปด้วยความสุขและรอยยิ้ม!",
        "เริ่มต้นศักราชใหม่อย่างรุ่งโรจน์ สุขภาพแข็งแรง ร่ำรวยเงินทอง",
        "Happy New Year! ขอให้ทุกความปรารถนาของคุณกลายเป็นจริง"
    ];
    document.querySelector('.wish-text').innerText = wishes[Math.floor(Math.random() * wishes.length)];

    // ยิงพลุอลังการ (เรียกใช้ Confetti)
    const end = Date.now() + 15 * 1000;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ffd700', '#ffffff'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ffd700', '#ffffff'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

// ฟังก์ชันหมดเวลาเค้าดาวน์
function showTimeoutScreen() {
    const waitScreen = document.getElementById('wait-screen');
    const celebScreen = document.getElementById('celebration-screen');
    
    waitScreen.classList.add('hidden');
    celebScreen.classList.remove('hidden');
    
    document.querySelector('.grand-title').innerText = "FINISH!";
    document.querySelector('.grand-year').innerText = "2569";
    document.querySelector('.wish-text').innerText = "หมดเวลาเค้าดาวน์แย้ววว... เจอกันใหม่ปีหน้านะ!";
}

// ... (คงฟังก์ชัน updateLunarAndHolidays และ renderHolidayList ไว้ตามเดิม) ...

setInterval(updateSystem, 1000);
updateSystem();
