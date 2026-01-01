// 1. ระบบพื้นหลังดวงดาว
tsParticles.load("tsparticles", {
    particles: {
        number: { value: 60 },
        color: { value: "#d4af37" },
        move: { enable: true, speed: 0.5 },
        size: { value: 2 },
        opacity: { value: 0.3 }
    }
});

// 2. ข้อมูลวันสำคัญและเป้าหมาย
const holidays = [
    { d: '1 ม.ค. 69', n: 'วันขึ้นปีใหม่' },
    { d: '13-15 เม.ย. 69', n: 'สงกรานต์' },
    { d: '28 ก.ค. 69', n: 'วันเฉลิมฯ ร.10' },
    { d: '12 ส.ค. 69', n: 'วันแม่แห่งชาติ' },
    { d: '5 ธ.ค. 69', n: 'วันพ่อแห่งชาติ' },
    { d: '31 ธ.ค. 69', n: 'วันสิ้นปี' }
];

let targetDate = new Date("Jan 1, 2027 00:00:00").getTime();
let isCelebrated = false;

// 3. ฟังก์ชันหลัก
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

function triggerSurprise() {
    isCelebrated = true;
    document.getElementById('wait-screen').classList.add('hidden');
    document.getElementById('celebration-screen').classList.remove('hidden');
    
    const end = Date.now() + 20000;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#d4af37', '#fff'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#d4af37', '#fff'] });
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

// Render รายชื่อวันหยุด
document.getElementById('holidayList').innerHTML = holidays.map(h => `
    <div class="holiday-item"><span>${h.d}</span><span>${h.n}</span></div>
`).join('');

setInterval(update, 1000);
update();
