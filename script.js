// 1. Particle Background
if (typeof tsParticles !== 'undefined') {
    tsParticles.load("tsparticles", {
        particles: {
            number: { value: 50 },
            color: { value: "#d4af37" },
            move: { enable: true, speed: 0.5 },
            size: { value: 2 },
            opacity: { value: 0.3 }
        }
    });
}

// 2. ข้อมูลวันสำคัญ
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

// --- 3. ระบบจัดการเวลาเป้าหมาย (Auto Switch) ---
function getTargetDate() {
    let now = new Date();
    // ถ้าเป็นวันที่ 1 ม.ค. 2569 และยังไม่ถึง 06:00 น.
    if (now.getMonth() === 0 && now.getDate() === 1 && now.getHours() < 6) {
        return new Date(2026, 0, 1, 0, 0, 0).getTime();
    } else {
        // กรณีอื่นๆ ให้นับถอยหลังไปปี 2570
        return new Date(2027, 0, 1, 0, 0, 0).getTime();
    }
}

let targetDate = getTargetDate();
let isCelebrated = false;

function updateSystem() {
    const now = new Date();
    const h = now.getHours();
    const d = now.getDate();
    const m = now.getMonth();

    // แสดงวันที่และนาฬิกา
    document.getElementById('currentDate').innerText = now.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById('realTimeClock').innerText = now.toLocaleTimeString('en-GB');

    // --- LOGIC หน้าจอแสดงผล ---
    
    // 1. เที่ยงคืนเป๊ะ (00:00 - 00:59): เซอร์ไพรส์อลังการ
    if (m === 0 && d === 1 && h === 0) {
        if (!isCelebrated) triggerCelebration("HAPPY NEW YEAR 2569", "ขอให้ปีนี้เป็นปีที่ยอดเยี่ยมที่สุดของคุณ!");
        return;
    }

    // 2. ช่วงตี 1 - ตี 5 (01:00 - 05:59): โชว์ข้อความหมดเวลา
    if (m === 0 && d === 1 && h >= 1 && h < 6) {
        showStatusScreen("FINISH!", "หมดเวลาเค้าดาวน์แย้ววว... เจอกันใหม่ปีหน้านะ!");
        return;
    }

    // 3. ช่วงเวลาปกติ (รวมถึงหลัง 6 โมงเช้าวันที่ 1 ม.ค.): นับถอยหลังไปปีหน้า
    const diff = targetDate - now.getTime();
    
    if (diff > 0) {
        isCelebrated = false;
        document.getElementById('wait-screen').classList.remove('hidden');
        document.getElementById('celebration-screen').classList.add('hidden');
        renderCountdown(diff);
    } else {
        // ป้องกันเลขค้าง 00:00 โดยการรีเฟรชเป้าหมาย
        targetDate = getTargetDate();
    }

    updateLunarAndHolidays(now);
}

function renderCountdown(diff) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('mins').innerText = mins.toString().padStart(2, '0');
    document.getElementById('secs').innerText = secs.toString().padStart(2, '0');
}

function triggerCelebration(title, msg) {
    isCelebrated = true;
    showStatusScreen(title, msg);
    if (typeof confetti !== 'undefined') {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#d4af37', '#ffffff'] });
    }
}

function showStatusScreen(title, msg) {
    document.getElementById('wait-screen').classList.add('hidden');
    const celebScreen = document.getElementById('celebration-screen');
    celebScreen.classList.remove('hidden');
    
    celebScreen.querySelector('.grand-title').innerText = title;
    celebScreen.querySelector('.wish-text').innerText = msg;
}

function updateLunarAndHolidays(now) {
    const d = now.getDate();
    const m = now.getMonth();
    const ref = new Date(2024, 0, 11).getTime();
    const diffDays = (now.getTime() - ref) / 86400000;
    const cycle = diffDays % 29.53059;
    const dayLunar = Math.floor(cycle);
    const lunarStr = dayLunar < 15 ? `ขึ้น ${dayLunar + 1} ค่ำ` : `แรม ${dayLunar - 14} ค่ำ`;

    const todaySpecial = holidayData.find(h => h.d === d && h.m === m);
    const lunarEl = document.getElementById('lunarDate');
    if (lunarEl) {
        lunarEl.innerHTML = todaySpecial 
            ? `${lunarStr} | <span class="today-special">🌟 ${todaySpecial.n}</span>` 
            : lunarStr;
    }
    renderHolidayList(now);
}

function renderHolidayList(now) {
    const currentM = now.getMonth();
    const currentD = now.getDate();
    const listEl = document.getElementById('holidayList');
    if (!listEl) return;
    
    const upcoming = holidayData.filter(h => (h.m > currentM) || (h.m === currentM && h.d > currentD)).slice(0, 5);
    const mNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

    listEl.innerHTML = upcoming.map(h => `
        <div class="holiday-item"><span>${h.d} ${mNames[h.m]} 69</span><span>${h.n}</span></div>
    `).join('');
}

function applyTest() {
    const val = document.getElementById('testInput').value;
    if(val) {
        targetDate = new Date(val).getTime();
        isCelebrated = false;
        updateSystem();
    }
}

// รันระบบ
setInterval(updateSystem, 1000);
updateSystem();
