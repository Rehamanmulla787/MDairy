// --- Start of Corrected scripts.js ---

document.addEventListener("DOMContentLoaded", function () {
    const farmerList = document.getElementById("farmerList");
    const farmerInput = document.getElementById("farmerName");

    const farmers = ["Dashrath Salunke", "Anand Nandgavn", "Parasa Alas"];

    function loadFarmers() {
        farmerList.innerHTML = "";
        farmers.forEach(farmer => {
            const option = document.createElement("option");
            option.value = farmer;
            farmerList.appendChild(option);
        });
    }

    loadFarmers();

    farmerInput.addEventListener("input", function () {
        const inputValue = this.value.toLowerCase();
        farmerList.innerHTML = "";

        farmers.forEach(farmer => {
            if (farmer.toLowerCase().includes(inputValue)) {
                const option = document.createElement("option");
                option.value = farmer;
                farmerList.appendChild(option);
            }
        });
    });
});

document.getElementById("billDate").addEventListener("change", generatePreviousDates);

function generatePreviousDates() {
    const selectedDate = new Date(document.getElementById("billDate").value);
    const morningTableBody = document.getElementById("morningTableBody");
    const eveningTableBody = document.getElementById("eveningTableBody");

    morningTableBody.innerHTML = "";
    eveningTableBody.innerHTML = "";

    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() - 6);

    const formattedOptions = { month: '2-digit', day: '2-digit' };

    for (let i = 0; i < 7; i++) {
        const formattedDate = currentDate.toLocaleDateString('en-GB', formattedOptions);

        morningTableBody.innerHTML += `
            <tr>
                <td>${formattedDate}</td>
                <td><input type="number" class="input litres-morning" onchange="calculateAmount('morning', this)"></td>
                <td><input type="number" class="input fat-morning" onchange="calculateAmount('morning', this)"></td>
                <td><input type="number" class="input snf-morning" onchange="calculateAmount('morning', this)"></td>
                <td class="total-amount-morning">0.00</td>
            </tr>`;

        eveningTableBody.innerHTML += `
            <tr>
                <td>${formattedDate}</td>
                <td><input type="number" class="input litres-evening" onchange="calculateAmount('evening', this)"></td>
                <td><input type="number" class="input fat-evening" onchange="calculateAmount('evening', this)"></td>
                <td><input type="number" class="input snf-evening" onchange="calculateAmount('evening', this)"></td>
                <td class="total-amount-evening">0.00</td>
            </tr>`;

        currentDate.setDate(currentDate.getDate() + 1);
    }
}

// ================= RATE CHART =================

const cowmilkRateChart = {
    "3.0": {
        "7.0": 21.0,
        "7.1": 22.0,
        "7.2": 23.0,
        "7.3": 24.0,
        "7.4": 25.0,
        "7.5": 26.0,
        "7.6": 27.0,
        "7.7": 28.0,
        "7.8": 29.0,
        "7.9": 30.0,
        "8.0": 31.0,
        "8.1": 31.5,
        "8.2": 32.0,
        "8.3": 32.5,
        "8.4": 33.0,
        "8.5": 33.5
    },
    "3.1": {
        "7.0": 21.3,
        "7.1": 22.3,
        "7.2": 23.3,
        "7.3": 24.3,
        "7.4": 25.3,
        "7.5": 26.3,
        "7.6": 27.3,
        "7.7": 28.3,
        "7.8": 29.3,
        "7.9": 30.3,
        "8.0": 31.3,
        "8.1": 31.8,
        "8.2": 32.3,
        "8.3": 33.8,
        "8.4": 33.3,
        "8.5": 33.8
    },
    "3.2": {
        "7.0": 21.6,
        "7.1": 22.6,
        "7.2": 23.6,
        "7.3": 24.6,
        "7.4": 25.6,
        "7.5": 26.6,
        "7.6": 27.6,
        "7.7": 28.6,
        "7.8": 29.6,
        "7.9": 30.6,
        "8.0": 31.6,
        "8.1": 32.1,
        "8.2": 32.6,
        "8.3": 33.1,
        "8.4": 33.6,
        "8.5": 34.1
    },
    "3.3": {
        "7.0": 21.9,
        "7.1": 22.9,
        "7.2": 23.9,
        "7.3": 24.9,
        "7.4": 25.9,
        "7.5": 26.9,
        "7.6": 27.9,
        "7.7": 28.9,
        "7.8": 29.9,
        "7.9": 30.9,
        "8.0": 31.9,
        "8.1": 32.4,
        "8.2": 32.9,
        "8.3": 33.4,
        "8.4": 33.9,
        "8.5": 34.4
    },
    "3.4": {
        "7.0": 22.2,
        "7.1": 23.2,
        "7.2": 24.2,
        "7.3": 25.2,
        "7.4": 26.2,
        "7.5": 27.2,
        "7.6": 28.2,
        "7.7": 29.2,
        "7.8": 30.2,
        "7.9": 31.2,
        "8.0": 32.2,
        "8.1": 32.7,
        "8.2": 33.2,
        "8.3": 33.7,
        "8.4": 34.2,
        "8.5": 34.7
    },
    "3.5": {
        "7.0": 22.5,
        "7.1": 23.5,
        "7.2": 24.5,
        "7.3": 25.5,
        "7.4": 26.5,
        "7.5": 27.5,
        "7.6": 28.5,
        "7.7": 29.5,
        "7.8": 30.5,
        "7.9": 31.5,
        "8.0": 32.5,
        "8.1": 33.0,
        "8.2": 33.5,
        "8.3": 34.0,
        "8.4": 34.5,
        "8.5": 35.0
    },
    "3.6": {
        "7.0": 22.7,
        "7.1": 23.7,
        "7.2": 24.7,
        "7.3": 25.7,
        "7.4": 26.7,
        "7.5": 27.7,
        "7.6": 28.7,
        "7.7": 29.7,
        "7.8": 30.7,
        "7.9": 31.7,
        "8.0": 32.7,
        "8.1": 33.2,
        "8.2": 33.7,
        "8.3": 34.2,
        "8.4": 34.7,
        "8.5": 35.2
    },
    "3.7": {
        "7.0": 22.9,
        "7.1": 23.9,
        "7.2": 24.9,
        "7.3": 25.9,
        "7.4": 26.9,
        "7.5": 27.9,
        "7.6": 28.9,
        "7.7": 29.9,
        "7.8": 30.9,
        "7.9": 31.9,
        "8.0": 32.9,
        "8.1": 33.4,
        "8.2": 33.9,
        "8.3": 34.4,
        "8.4": 34.9,
        "8.5": 35.4
    },
    "3.8": {
        "7.0": 23.1,
        "7.1": 24.1,
        "7.2": 25.1,
        "7.3": 26.1,
        "7.4": 27.1,
        "7.5": 28.1,
        "7.6": 29.1,
        "7.7": 30.1,
        "7.8": 31.1,
        "7.9": 32.1,
        "8.0": 33.1,
        "8.1": 33.6,
        "8.2": 34.1,
        "8.3": 34.6,
        "8.4": 35.1,
        "8.5": 35.6
    },
    "3.9": {
        "7.0": 23.3,
        "7.1": 24.3,
        "7.2": 25.3,
        "7.3": 26.3,
        "7.4": 27.3,
        "7.5": 28.3,
        "7.6": 29.3,
        "7.7": 30.3,
        "7.8": 31.3,
        "7.9": 32.3,
        "8.0": 33.3,
        "8.1": 33.8,
        "8.2": 34.3,
        "8.3": 34.8,
        "8.4": 35.3,
        "8.5": 35.8
    },
    "4.0": {
        "7.0": 23.5,
        "7.1": 24.5,
        "7.2": 25.5,
        "7.3": 26.5,
        "7.4": 27.5,
        "7.5": 28.5,
        "7.6": 29.5,
        "7.7": 30.5,
        "7.8": 31.5,
        "7.9": 32.5,
        "8.0": 33.5,
        "8.1": 34.0,
        "8.2": 34.5,
        "8.3": 35.0,
        "8.4": 35.5,
        "8.5": 36.0
    },
    "4.1": {
        "7.0": 23.7,
        "7.1": 24.7,
        "7.2": 25.7,
        "7.3": 26.7,
        "7.4": 27.7,
        "7.5": 28.7,
        "7.6": 29.7,
        "7.7": 30.7,
        "7.8": 31.7,
        "7.9": 32.7,
        "8.0": 33.7,
        "8.1": 34.2,
        "8.2": 34.7,
        "8.3": 35.2,
        "8.4": 35.7,
        "8.5": 36.2
    },
    "4.2": {
        "7.0": 23.9,
        "7.1": 24.9,
        "7.2": 25.9,
        "7.3": 26.9,
        "7.4": 27.9,
        "7.5": 28.9,
        "7.6": 29.9,
        "7.7": 30.9,
        "7.8": 31.9,
        "7.9": 32.9,
        "8.0": 33.9,
        "8.1": 34.4,
        "8.2": 34.9,
        "8.3": 35.4,
        "8.4": 35.9,
        "8.5": 36.4
    },
    "4.3": {
        "7.0": 24.1,
        "7.1": 25.1,
        "7.2": 26.1,
        "7.3": 27.1,
        "7.4": 28.1,
        "7.5": 29.1,
        "7.6": 30.1,
        "7.7": 31.1,
        "7.8": 32.1,
        "7.9": 33.1,
        "8.0": 34.1,
        "8.1": 34.6,
        "8.2": 35.1,
        "8.3": 35.6,
        "8.4": 36.1,
        "8.5": 36.6
    },
    "4.4": {
        "7.0": 24.3,
        "7.1": 25.3,
        "7.2": 26.3,
        "7.3": 27.3,
        "7.4": 28.3,
        "7.5": 29.3,
        "7.6": 30.3,
        "7.7": 31.3,
        "7.8": 32.3,
        "7.9": 33.3,
        "8.0": 34.3,
        "8.1": 34.8,
        "8.2": 35.3,
        "8.3": 35.8,
        "8.4": 36.3,
        "8.5": 36.8
    },
    "4.5": {
        "7.0": 24.5,
        "7.1": 25.5,
        "7.2": 26.5,
        "7.3": 27.5,
        "7.4": 28.5,
        "7.5": 29.5,
        "7.6": 30.5,
        "7.7": 31.5,
        "7.8": 32.5,
        "7.9": 33.5,
        "8.0": 34.5,
        "8.1": 35.0,
        "8.2": 35.5,
        "8.3": 36.0,
        "8.4": 36.5,
        "8.5": 37.0
    },
    "4.6": {
        "7.0": 24.7,
        "7.1": 25.7,
        "7.2": 26.7,
        "7.3": 27.7,
        "7.4": 28.7,
        "7.5": 29.7,
        "7.6": 30.7,
        "7.7": 31.7,
        "7.8": 32.7,
        "7.9": 33.7,
        "8.0": 34.7,
        "8.1": 35.2,
        "8.2": 35.7,
        "8.3": 36.2,
        "8.4": 36.7,
        "8.5": 37.2
    },
    "4.7": {
        "7.0": 24.9,
        "7.1": 25.9,
        "7.2": 26.9,
        "7.3": 27.9,
        "7.4": 28.9,
        "7.5": 29.9,
        "7.6": 30.9,
        "7.7": 31.9,
        "7.8": 32.9,
        "7.9": 33.9,
        "8.0": 34.9,
        "8.1": 35.4,
        "8.2": 35.9,
        "8.3": 36.4,
        "8.4": 36.9,
        "8.5": 37.4
    },
    "4.8": {
        "7.0": 25.1,
        "7.1": 26.1,
        "7.2": 27.1,
        "7.3": 28.1,
        "7.4": 29.1,
        "7.5": 30.1,
        "7.6": 31.1,
        "7.7": 32.1,
        "7.8": 33.1,
        "7.9": 34.1,
        "8.0": 35.1,
        "8.1": 35.6,
        "8.2": 36.1,
        "8.3": 36.6,
        "8.4": 37.1,
        "8.5": 37.6
    },
    "4.9": {
        "7.0": 25.3,
        "7.1": 26.3,
        "7.2": 27.3,
        "7.3": 28.3,
        "7.4": 29.3,
        "7.5": 30.3,
        "7.6": 31.3,
        "7.7": 32.3,
        "7.8": 33.3,
        "7.9": 34.3,
        "8.0": 35.3,
        "8.1": 35.8,
        "8.2": 36.3,
        "8.3": 36.8,
        "8.4": 37.3,
        "8.5": 37.8
    },
    "5.0": {
        "7.0": 25.5,
        "7.1": 26.5,
        "7.2": 27.5,
        "7.3": 28.5,
        "7.4": 29.5,
        "7.5": 30.5,
        "7.6": 31.5,
        "7.7": 32.5,
        "7.8": 33.5,
        "7.9": 34.5,
        "8.0": 35.5,
        "8.1": 36.0,
        "8.2": 36.5,
        "8.3": 37.0,
        "8.4": 37.5,
        "8.5": 38.0
    }
};

// 🔥 FUNCTION
// ✅ RATE ADJUSTMENT — Change this single value to increase or decrease all rates
// Positive = increase, Negative = decrease
// Examples: 1 = +1 rupee, -2 = -2 rupees, 0.5 = +50 paise
const RATE_ADJUSTMENT = 1; // Currently set to +1 rupee

function getRate(fat, snf) {
    const fatKey = parseFloat(fat).toFixed(1);
    const snfKey = parseFloat(snf).toFixed(1);

    const baseRate = cowmilkRateChart[fatKey] ? cowmilkRateChart[fatKey][snfKey] : undefined;

    // Apply adjustment to whatever rate is found
    return baseRate !== undefined ? baseRate + RATE_ADJUSTMENT : 0.00;
}

function calculateAmount(type, element) {
    const row = element.closest("tr");

    const litres = parseFloat(row.querySelector(`.litres-${type}`)?.value || 0);
    const fat = parseFloat(row.querySelector(`.fat-${type}`)?.value || 0);
    const snf = parseFloat(row.querySelector(`.snf-${type}`)?.value || 0);

    const rate = getRate(fat, snf);
    const total = litres * rate;

    row.querySelector(`.total-amount-${type}`).textContent = total.toFixed(2);

    calculateTotals();
}

function calculateTotals() {
    let totalLitres = 0, totalAmount = 0;

    document.querySelectorAll("tbody tr").forEach(row => {
        totalLitres += parseFloat(row.querySelector("input")?.value || 0);
        totalAmount += parseFloat(row.querySelector("td:last-child")?.textContent || 0);
    });

    document.getElementById("totalLitres").textContent = totalLitres.toFixed(2);
    document.getElementById("totalAmount").textContent = totalAmount.toFixed(2);
}

// --- End ---
