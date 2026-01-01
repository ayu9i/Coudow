// 1. ระบบพื้นหลังละอองทอง
tsParticles.load("tsparticles", {
    particles: {
        number: { value: 60 },
        color: { value: "#d4af37" },
        move: { enable: true, speed: 0.6 },
        size: { value: 2 },
        opacity: { value: 0.4 }
    }
});

// 2. ข้อมูลวันสำคัญ (ไทย & สากล)
const holidays = [
    { d: '1 ม.ค. 69', n: 'วันขึ้นปีใหม่' },
    { d: '14 ก.พ. 69', n: 'Valentine\'s Day' },
    { d: '3 มี.ค. 69', n: 'วันมาฆบูชา' },
    { d: '6 เม.ย. 69', n: 'วันจักรี' },
    { d: '13-15 เม.ย. 69', n: 'เทศกาลสงกรานต์' },
    { d: '1 พ.ค. 69', n: 'วันแรงงานแห่งชาติ' },
    { d: '4 พ.ค. 69', n: 'วันฉัตรมงคล' },
    { d: '31 พ.ค. 69', n: 'วันวิสาขบูชา' },
    { d: '28 ก.ค. 69', n: 'วันเฉลิมฯ ร.10' },
    { d: '12 ส.ค. 69', n: 'วันแม่แห่งชาติ' },
    { d: '13 ต.ค. 69', n: 'วันนวมินทรมหาราช' },
    { d: '31 ต.ค. 69', n: 'Halloween' },
    { d: '5 ธ.ค. 69', n: 'วันพ่อแห่งชาติ' },
    { d: '25 ธ.ค. 69', n: 'Christmas Day' },
    { d: '31 ธ.ค. 69', n: 'วันสิ้นปี' }
];

let targetDate = new Date("Jan 1, 2027 00:00:00").getTime();
let isCelebrated = false;

// 3. ฟังก์ชันอัปเดตเวลาจริง
function update() {
    const now = new Date();
    document.getElementById('currentDate').innerText = now.toLocaleDateString('th-TH', {day:'numeric', month:'long', year:'numeric'});
    document.getElementById('realTimeClock').innerText = now.toLocaleTimeString('en-GB');

    const diff = targetDate - now.getTime();

    if (diff <= 0 && !isCelebrated) {
        triggerSurprise();
    } else if (!isCelebrated) {
        document.getElementById('days').innerText = Math.floor(diff / 86400000).toString().padStart(2, '0');
        document.getElementById('hours').innerText = Math.floor((diff % 86400000) / 3600000).toString().padStart(2, '0');
        document.getElementById('mins').innerText = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        document.getElementById('secs').innerText = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    }
}

// 4. ฟังก์ชันฉลองอลังการ
function triggerSurprise() {
    isCelebrated = true;
    document.getElementById('wait-screen').classList.add('hidden');
    document.getElementById('celebration-screen').classList.remove('hidden');
    
    const end = Date.now() + 25000;
    (function frame() {
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0, y:0.6 }, colors: ['#d4af37', '#fff'] });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1, y:0.6 }, colors: ['#d4af37', '#fff'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

// 5. ระบบทดสอบ (Warp)
function applyTest() {
    const val = document.getElementById('testInput').value;
    if(val) {
        targetDate = new Date(val).getTime();
        isCelebrated = false;
        document.getElementById('wait-screen').classList.remove('hidden');
        document.getElementById('celebration-screen').classList.add('hidden');
    }
}

// Render รายชื่อวันสำคัญ
document.getElementById('holidayList').innerHTML = holidays.map(h => `
    <div class="holiday-item"><span>${h.d}</span><span>${h.n}</span></div>
`).join('');

setInterval(update, 1000);
update();
