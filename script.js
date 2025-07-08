// 1. กำหนดค่าคงที่และตัวแปร
const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd,thb';

// Element references
const amountInput = document.getElementById('amount');
const fromSelect = document.getElementById('from-currency');
const toSelect = document.getElementById('to-currency');
const lastUpdatedElem = document.getElementById('last-updated');

// --- Summary Area Elements ---
const summaryTitle = document.getElementById('summary-title');
const summaryBaseCost = document.getElementById('summary-base-cost');
const summaryFee = document.getElementById('summary-fee');
const summaryTotalCost = document.getElementById('summary-total-cost');
const feeRow = document.getElementById('fee-row');

// --- Fee Settings Elements ---
const feeToggle = document.getElementById('fee-toggle');
const feeThbInput = document.getElementById('fee-amount-thb'); 

let rates = { LTC: 0, USD: 1, THB: 0 };

// 2. ฟังก์ชัน fetchRates (เหมือนเดิม)
async function fetchRates() {
    try {
        lastUpdatedElem.textContent = 'กำลังอัปเดต...';
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        rates.LTC = data.litecoin.usd;
        const usdToThbRate = data.litecoin.thb / data.litecoin.usd;
        rates.THB = 1 / usdToThbRate;
        lastUpdatedElem.textContent = `อัปเดตล่าสุด: ${new Date().toLocaleTimeString('th-TH')}`;
        calculate();
    } catch (error) {
        lastUpdatedElem.textContent = 'ไม่สามารถดึงข้อมูลได้';
        console.error('Fetch error:', error);
    }
}

// 3. ฟังก์ชันคำนวณหลัก (Logic ใหม่ทั้งหมด)
function calculate() {
    if (rates.LTC === 0) return;

    const amountToReceive = parseFloat(amountInput.value) || 0;
    const receiveCurrency = toSelect.value;
    const payWithCurrency = fromSelect.value;

    // --- คำนวณต้นทุนพื้นฐาน (Base Cost) ---
    // 1. แปลง "จำนวนที่ต้องการรับ" ไปเป็นสกุลเงินกลาง (USD)
    const amountToReceiveInUSD = amountToReceive * rates[receiveCurrency];
    // 2. แปลงจาก USD ไปเป็น "สกุลเงินที่ใช้จ่าย" เพื่อหาต้นทุน
    const baseCost = amountToReceiveInUSD / rates[payWithCurrency];

    // --- คำนวณค่าบริการ ---
    let feeInPayCurrency = 0;
    const feeInThb = feeToggle.checked ? (parseFloat(feeThbInput.value) || 0) : 0;
    
    if (feeInThb > 0) {
        // แปลงค่าบริการจาก THB ไปเป็น "สกุลเงินที่ใช้จ่าย"
        const feeInUSD = feeInThb * rates.THB;
        feeInPayCurrency = feeInUSD / rates[payWithCurrency];
    }
    
    // --- คำนวณยอดชำระทั้งหมด ---
    const totalCost = baseCost + feeInPayCurrency;

    updateResultUI(baseCost, feeInPayCurrency, totalCost, payWithCurrency);
}

// 4. ฟังก์ชันอัปเดต UI (เขียนใหม่ทั้งหมด)
function formatNumber(num, currency) {
    const options = {
        minimumFractionDigits: 2,
        maximumFractionDigits: currency === 'LTC' ? 6 : 2
    };
    return num.toLocaleString('en-US', options);
}

function updateResultUI(baseCost, fee, totalCost, currency) {
    summaryTitle.textContent = `สรุปยอดที่ต้องชำระ (${currency})`;
    
    summaryBaseCost.textContent = `${formatNumber(baseCost, currency)} ${currency}`;
    summaryTotalCost.textContent = `${formatNumber(totalCost, currency)} ${currency}`;

    if (fee > 0) {
        summaryFee.textContent = `+ ${formatNumber(fee, currency)} ${currency}`;
        feeRow.style.display = 'flex'; // แสดงแถวค่าบริการ
    } else {
        feeRow.style.display = 'none'; // ซ่อนแถวค่าบริการ
    }
}

// 5. เพิ่ม Event Listeners (เหมือนเดิม)
amountInput.addEventListener('input', calculate);
fromSelect.addEventListener('change', calculate);
toSelect.addEventListener('change', calculate);
feeToggle.addEventListener('change', calculate);
feeThbInput.addEventListener('input', calculate);

// 6. เริ่มต้นการทำงาน (เหมือนเดิม)
fetchRates();
setInterval(fetchRates, 60000);