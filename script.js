// 1. Particle Background Setup
tsParticles.load("tsparticles", {
    particles: {
        number: { value: 50 },
        color: { value: "#d4af37" },
        move: { enable: true, speed: 0.5 },
        size: { value: 2 },
        opacity: { value: 0.3 }
    }
});

// 2. ฐานข้อมูลวันสำคัญ (ระบุเดือนเป็น 0-11 ตามมาตรฐาน JS)
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
    { d: 1, m: 5, n: 'วันชดเชยวิสาขบูชา / วันดื่มนมโลก' },
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
    { d: 7, m: 11, n: 'วันหยุดชดเชยวันพ่อแห่งชาติ' },
    { d: 10, m: 11, n: 'วันรัฐธรรมนูญ' },
    { d: 25, m: 11, n: 'วันคริสต์มาส' },
    { d: 31, m: 11, n: 'วันสิ้นปี' }
];

let targetDate = new Date("Jan 1, 2027 00:00:00").getTime();
let isCelebrated = false;

// 3. ฟังก์ชันอัปเดตระบบแบบ Real-time
function updateSystem() {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth();

    // แสดงวันที่และนาฬิกา
    document.getElementById('currentDate').innerText = now.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('realTimeClock').innerText = now.toLocaleTimeString('en-GB');

    // คำนวณจันทรคติ (ขึ้น/แรม) และเช็ควันสำคัญวันนี้
    const lunarStr = calculateThaiLunar(now);
    const todaySpecial = holidayData.find(h => h.d === day && h.m === month);
    
    document.getElementById('lunarDate').innerHTML = todaySpecial 
        ? `${lunarStr} | <span class="today-special">🌟 ${todaySpecial.n}</span>` 
        : lunarStr;

    // Countdown Logic
    const diff = targetDate - now.getTime();
    if (diff <= 0 && !isCelebrated) {
        triggerCelebration();
    } else if (!isCelebrated) {
        renderCountdown(diff);
        renderUpcomingHolidays(now);
    }
}

// 4. ฟังก์ชันคำนวณจันทรคติไทย (โดยประมาณ)
function calculateThaiLunar(date) {
    const refNewMoon = new Date("2024-01-11").getTime(); 
    const diffDays = (date.getTime() - refNewMoon) / 86400000;
    const cycle = diffDays % 29.53059;
    const d = Math.floor(cycle);
    return d < 15 ? `ขึ้น ${d + 1} ค่ำ` : `แรม ${d - 14} ค่ำ`;
}

// 5. แสดงรายการวันสำคัญที่กำลังจะมาถึง
function renderUpcomingHolidays(now) {
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    const listEl = document.getElementById('holidayList');

    const upcoming = holidayData.filter(h => (h.m > currentMonth) || (h.m === currentMonth && h.d > currentDay)).slice(0, 6);
    const monthTh = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

    listEl.innerHTML = upcoming.map(h => `
        <div class="holiday-item">
            <span>${h.d} ${monthTh[h.m]} 69</span>
            <span>${h.n}</span>
        </div>
    `).join('');
}

function renderCountdown(diff) {
    document.getElementById('days').innerText = Math.floor(diff / 86400000).toString().padStart(2, '0');
    document.getElementById('hours').innerText = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
    document.getElementById('mins').innerText = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    document.getElementById('secs').innerText = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
}

function triggerCelebration() {
    isCelebrated = true;
    document.getElementById('wait-screen').classList.add('hidden');
    document.getElementById('celebration-screen').classList.remove('hidden');
    const end = Date.now() + 20000;
    (function frame() {
        confetti({ particleCount: 7, angle: 60, spread: 55, origin: { x: 0, y: 0.6 }, colors: ['#d4af37', '#ffffff'] });
        confetti({ particleCount: 7, angle: 120, spread: 55, origin: { x: 1, y: 0.6 }, colors: ['#d4af37', '#ffffff'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

function applyTest() {
    const val = document.getElementById('testInput').value;
    if(val) {
        targetDate = new Date(val).getTime();
        isCelebrated = false;
        document.getElementById('wait-screen').classList.remove('hidden');
        document.getElementById('celebration-screen').classList.add('hidden');
    }
}

setInterval(updateSystem, 1000);
updateSystem();
