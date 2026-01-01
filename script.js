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

// 2. ข้อมูลวันสำคัญ (ตามที่คุณระบุมา)
const holidayData = [
    { d: 1, m: 0, n: 'วันขึ้นปีใหม่ (หยุดยาว 1-5 ม.ค.)' },
    { d: 2, m: 0, n: 'วันหยุดพิเศษ (ชดเชยปีใหม่)' },
    { d: 4, m: 0, n: 'วันอักษรเบรลล์โลก' },
    { d: 10, m: 0, n: 'วันเด็กแห่งชาติ' },
    { d: 21, m: 0, n: 'วันกอดสากล' },
    { d: 3, m: 2, n: 'วันมาฆบูชา' },
    { d: 6, m: 3, n: 'วันจักรี' },
    { d: 13, m: 3, n: 'วันสงกรานต์' },
    { d: 14, m: 3, n: 'วันสงกรานต์' },
    { d: 15, m: 3, n: 'วันสงกรานต์' },
    { d: 1, m: 4, n: 'วันแรงงานสากล' },
    { d: 4, m: 4, n: 'วันฉัตรมงคล' },
    { d: 11, m: 4, n: 'วันพืชมงคล' },
    { d: 31, m: 4, n: 'วันวิสาขบูชา' },
    { d: 1, m: 5, n: 'ชดเชยวิสาขบูชา / วันดื่มนมโลก' },
    { d: 3, m: 5, n: 'วันเฉลิมฯ พระราชินี' },
    { d: 5, m: 5, n: 'วันสิ่งแวดล้อมโลก' },
    { d: 21, m: 5, n: 'วันโยคะสากล' },
    { d: 28, m: 6, n: 'วันเฉลิมฯ ร.10' },
    { d: 29, m: 6, n: 'วันอาสาฬหบูชา' },
    { d: 30, m: 6, n: 'วันเข้าพรรษา' },
    { d: 12, m: 7, n: 'วันแม่แห่งชาติ' },
    { d: 13, m: 9, n: 'วันนวมินทรมหาราช' },
    { d: 23, m: 9, n: 'วันปิยมหาราช' },
    { d: 20, m: 10, n: 'วันเด็กสากล' },
    { d: 24, m: 10, n: 'วันลอยกระทง' },
    { d: 5, m: 11, n: 'วันพ่อแห่งชาติ' },
    { d: 7, m: 11, n: 'วันชดเชยวันพ่อแห่งชาติ' },
    { d: 10, m: 11, n: 'วันรัฐธรรมนูญ' },
    { d: 25, m: 11, n: 'วันคริสต์มาส' },
    { d: 31, m: 11, n: 'วันสิ้นปี' }
];

// ล็อคเป้าหมายเป็นปี 2027 (พ.ศ. 2570)
let targetYear = 2027;
let targetDate = new Date(`Jan 1, ${targetYear} 00:00:00`).getTime();
let isCelebrated = false;

function updateSystem() {
    const now = new Date();
    const currentTime = now.getTime();
    
    // แสดงวันที่และนาฬิกาบนหน้าจอ
    document.getElementById('currentDate').innerText = now.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('realTimeClock').innerText = now.toLocaleTimeString('en-GB');

    // คำนวณส่วนต่างเวลา
    const diff = targetDate - currentTime;

    // ระบบเช็คเงื่อนไข
    if (diff <= 0 && !isCelebrated) {
        // ถึงปีใหม่แล้ว
        triggerCelebration();
    } else if (diff > 0) {
        // ยังไม่ถึงปีใหม่ ให้รัน Countdown
        isCelebrated = false;
        document.getElementById('wait-screen').classList.remove('hidden');
        document.getElementById('celebration-screen').classList.add('hidden');
        renderCountdown(diff);
    }

    // อัปเดตข้อมูลจันทรคติและวันสำคัญ
    updateLunarAndHolidays(now);
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

function updateLunarAndHolidays(now) {
    const d = now.getDate();
    const m = now.getMonth();
    
    // คำนวณจันทรคติ
    const ref = new Date("2024-01-11").getTime();
    const diffDays = (now.getTime() - ref) / 86400000;
    const cycle = diffDays % 29.53059;
    const dayLunar = Math.floor(cycle);
    const lunarStr = dayLunar < 15 ? `ขึ้น ${dayLunar + 1} ค่ำ` : `แรม ${dayLunar - 14} ค่ำ`;

    const todaySpecial = holidayData.find(h => h.d === d && h.m === m);
    document.getElementById('lunarDate').innerHTML = todaySpecial 
        ? `${lunarStr} | <span class="today-special">🌟 ${todaySpecial.n}</span>` 
        : lunarStr;

    // แสดงรายการวันสำคัญถัดไป
    renderHolidayList(now);
}

function renderHolidayList(now) {
    const currentM = now.getMonth();
    const currentD = now.getDate();
    const listEl = document.getElementById('holidayList');
    
    const upcoming = holidayData.filter(h => (h.m > currentM) || (h.m === currentM && h.d > currentD)).slice(0, 5);
    const mNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

    listEl.innerHTML = upcoming.map(h => `
        <div class="holiday-item"><span>${h.d} ${mNames[h.m]} 69</span><span>${h.n}</span></div>
    `).join('');
}

function triggerCelebration() {
    isCelebrated = true;
    document.getElementById('wait-screen').classList.add('hidden');
    document.getElementById('celebration-screen').classList.remove('hidden');
    
    // พลุ
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#d4af37', '#ffffff'] });
}

function applyTest() {
    const val = document.getElementById('testInput').value;
    if(val) {
        targetDate = new Date(val).getTime();
        isCelebrated = false;
        updateSystem();
    }
}

setInterval(updateSystem, 1000);
updateSystem();
