// 1. Particle Background
tsParticles.load("tsparticles", {
    particles: {
        number: { value: 50 },
        color: { value: "#d4af37" },
        move: { enable: true, speed: 0.5 },
        size: { value: 2 },
        opacity: { value: 0.3 }
    }
});

// 2. ข้อมูลวันสำคัญ (ตามที่คุณระบุ)
const holidayData = [
    { d: 1, m: 0, n: 'วันขึ้นปีใหม่ (หยุดยาว 1-5 ม.ค.)' },
    { d: 2, m: 0, n: 'วันหยุดพิเศษ (ชดเชยปีใหม่)' },
    { d: 10, m: 0, n: 'วันเด็กแห่งชาติ' },
    { d: 3, m: 2, n: 'วันมาฆบูชา' },
    { d: 13, m: 3, n: 'วันสงกรานต์' },
    { d: 28, m: 6, n: 'วันเฉลิมฯ ร.10' },
    { d: 12, m: 7, n: 'วันแม่แห่งชาติ' },
    { d: 5, m: 11, n: 'วันพ่อแห่งชาติ' },
    { d: 25, m: 11, n: 'วันคริสต์มาส' },
    { d: 31, m: 11, n: 'วันสิ้นปี' }
];

// --- ตัวแปรควบคุมเวลา ---
let testOffset = 0; // ตัวแปรเก็บค่าเวลาที่เรา Warp
let targetDate = new Date("Jan 1, 2027 00:00:00").getTime();
let isCelebrated = false;

function updateSystem() {
    // คำนวณเวลาปัจจุบัน + เวลาที่ Warp (ถ้ามี)
    const realNow = new Date();
    const virtualNow = new Date(realNow.getTime() + testOffset);
    
    const curH = virtualNow.getHours();
    const curM = virtualNow.getMonth();
    const curD = virtualNow.getDate();

    // แสดงวันที่และเวลา (Virtual Time)
    document.getElementById('currentDate').innerText = virtualNow.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('realTimeClock').innerText = virtualNow.toLocaleTimeString('en-GB');

    // --- Logic การแสดงผลหน้าจอ ---
    
    // 1. ช่วงเวลาเซอร์ไพรส์ (เที่ยงคืนเป๊ะ 1 ม.ค. 2026 หรือ 2027)
    if (curM === 0 && curD === 1 && curH === 0 && virtualNow.getMinutes() < 1) {
        if (!isCelebrated) triggerCelebration();
        return;
    }

    // 2. ช่วงเวลา "หมดเวลาเค้าดาวน์" (ตี 1 - ตี 5)
    if (curM === 0 && curD === 1 && curH >= 1 && curH < 6) {
        showTimeoutScreen();
        return;
    }

    // 3. การนับถอยหลังปกติ
    const diff = targetDate - virtualNow.getTime();
    
    if (diff > 0) {
        isCelebrated = false;
        document.getElementById('wait-screen').classList.remove('hidden');
        document.getElementById('celebration-screen').classList.add('hidden');
        renderCountdown(diff);
    } else {
        // ถ้าเวลาเกินปีใหม่ไปแล้ว ให้เลื่อนเป้าหมายไปปีถัดไป
        targetDate = new Date(`Jan 1, ${virtualNow.getFullYear() + 1} 00:00:00`).getTime();
    }
    
    renderHolidayList(virtualNow);
}

// ฟังก์ชันปุ่ม WARP (แก้ไขให้ปุ่มทำงาน)
function applyTest() {
    const val = document.getElementById('testInput').value;
    if(val) {
        const selectedTime = new Date(val).getTime();
        const nowTime = new Date().getTime();
        // คำนวณหา "ส่วนต่าง" เพื่อนำไปบวกกับเวลาจริง
        testOffset = selectedTime - nowTime;
        isCelebrated = false;
        alert("Warping to: " + new Date(selectedTime).toLocaleString());
        updateSystem(); // อัปเดตหน้าจอทันที
    } else {
        alert("กรุณาเลือกวันที่และเวลาก่อนกด Warp ครับ");
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

function triggerCelebration() {
    isCelebrated = true;
    document.getElementById('wait-screen').classList.add('hidden');
    document.getElementById('celebration-screen').classList.remove('hidden');
    
    // เอฟเฟกต์พลุ
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

function showTimeoutScreen() {
    document.getElementById('wait-screen').classList.add('hidden');
    document.getElementById('celebration-screen').classList.remove('hidden');
    document.querySelector('.grand-title').innerText = "FINISH!";
    document.querySelector('.wish-text').innerText = "หมดเวลาเค้าดาวน์แย้ววว... เจอกันใหม่ปีหน้า!";
}

function renderHolidayList(now) {
    const currentM = now.getMonth();
    const currentD = now.getDate();
    const listEl = document.getElementById('holidayList');
    const upcoming = holidayData.filter(h => (h.m > currentM) || (h.m === currentM && h.d > currentD)).slice(0, 5);
    const mNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    listEl.innerHTML = upcoming.map(h => `<div class="holiday-item"><span>${h.d} ${mNames[h.m]} 69</span><span>${h.n}</span></div>`).join('');
}

setInterval(updateSystem, 1000);
updateSystem();
