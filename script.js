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

const  cowmilkRateChart = {
    "3.0": {
        "8.0": 37.0,
        "8.1": 37.3,
        "8.2": 37.6,
        "8.3": 37.9,
        "8.4": 38.2,
        "8.5": 38.5,
        "8.6": 38.7,
        "8.7": 38.9,
        "8.8": 39.1,
        "8.9": 39.3,
        "9.0": 39.5
    },
    "3.1": {
        "8.0": 37.3,
        "8.1": 37.6,
        "8.2": 37.9,
        "8.3": 38.2,
        "8.4": 38.5,
        "8.5": 38.8,
        "8.6": 39.0,
        "8.7": 39.2,
        "8.8": 39.4,
        "8.9": 39.6,
        "9.0": 39.8
    },
    "3.2": {
        "8.0": 37.6,
        "8.1": 37.9,
        "8.2": 38.2,
        "8.3": 38.5,
        "8.4": 38.8,
        "8.5": 39.1,
        "8.6": 39.3,
        "8.7": 39.5,
        "8.8": 39.7,
        "8.9": 39.9,
        "9.0": 40.1
    },
    "3.3": {
        "8.0": 37.9,
        "8.1": 38.2,
        "8.2": 38.5,
        "8.3": 38.8,
        "8.4": 39.1,
        "8.5": 39.4,
        "8.6": 39.6,
        "8.7": 39.8,
        "8.8": 40.0,
        "8.9": 40.2,
        "9.0": 40.4
    },
    "3.4": {
        "8.0": 38.2,
        "8.1": 38.5,
        "8.2": 38.8,
        "8.3": 39.1,
        "8.4": 39.4,
        "8.5": 39.7,
        "8.6": 39.9,
        "8.7": 40.1,
        "8.8": 40.3,
        "8.9": 40.5,
        "9.0": 40.7
    },
    "3.5": {
        "8.0": 38.5,
        "8.1": 38.8,
        "8.2": 39.1,
        "8.3": 39.4,
        "8.4": 39.7,
        "8.5": 40.0,
        "8.6": 40.2,
        "8.7": 40.4,
        "8.8": 40.6,
        "8.9": 40.8,
        "9.0": 41.0
    },
    "3.6": {
        "8.0": 38.7,
        "8.1": 39.0,
        "8.2": 39.3,
        "8.3": 39.6,
        "8.4": 39.9,
        "8.5": 40.2,
        "8.6": 40.4,
        "8.7": 40.6,
        "8.8": 40.8,
        "8.9": 41.0,
        "9.0": 41.2
    },
    "3.7": {
        "8.0": 38.9,
        "8.1": 39.2,
        "8.2": 39.5,
        "8.3": 39.8,
        "8.4": 40.1,
        "8.5": 40.4,
        "8.6": 40.6,
        "8.7": 40.8,
        "8.8": 41.0,
        "8.9": 41.2,
        "9.0": 41.4
    },
    "3.8": {
        "8.0": 39.1,
        "8.1": 39.4,
        "8.2": 39.7,
        "8.3": 40.0,
        "8.4": 40.3,
        "8.5": 40.6,
        "8.6": 40.8,
        "8.7": 41.0,
        "8.8": 41.2,
        "8.9": 41.4,
        "9.0": 41.6
    },
    "3.9": {
        "8.0": 39.3,
        "8.1": 39.6,
        "8.2": 39.9,
        "8.3": 40.2,
        "8.4": 40.5,
        "8.5": 40.8,
        "8.6": 41.0,
        "8.7": 41.2,
        "8.8": 41.4,
        "8.9": 41.6,
        "9.0": 41.8
    },
    "4.0": {
        "8.0": 39.5,
        "8.1": 39.8,
        "8.2": 40.1,
        "8.3": 40.4,
        "8.4": 40.7,
        "8.5": 41.0,
        "8.6": 41.2,
        "8.7": 41.4,
        "8.8": 41.6,
        "8.9": 41.8,
        "9.0": 42.0
    },
    "4.1": {
        "8.0": 39.7,
        "8.1": 40.0,
        "8.2": 40.3,
        "8.3": 40.6,
        "8.4": 40.9,
        "8.5": 41.2,
        "8.6": 41.4,
        "8.7": 41.6,
        "8.8": 41.8,
        "8.9": 42.0,
        "9.0": 42.2
    },
    "4.2": {
        "8.0": 39.9,
        "8.1": 40.2,
        "8.2": 40.5,
        "8.3": 40.8,
        "8.4": 41.1,
        "8.5": 41.4,
        "8.6": 41.6,
        "8.7": 41.8,
        "8.8": 42.0,
        "8.9": 42.2,
        "9.0": 42.4
    },
    "4.3": {
        "8.0": 40.1,
        "8.1": 40.4,
        "8.2": 40.7,
        "8.3": 41.0,
        "8.4": 41.3,
        "8.5": 41.6,
        "8.6": 41.8,
        "8.7": 42.0,
        "8.8": 42.2,
        "8.9": 42.4,
        "9.0": 42.6
    },
    "4.4": {
        "8.0": 40.3,
        "8.1": 40.6,
        "8.2": 40.9,
        "8.3": 41.2,
        "8.4": 41.5,
        "8.5": 41.8,
        "8.6": 42.0,
        "8.7": 42.2,
        "8.8": 42.4,
        "8.9": 42.6,
        "9.0": 42.8
    },
    "4.5": {
        "8.0": 40.5,
        "8.1": 40.8,
        "8.2": 41.1,
        "8.3": 41.4,
        "8.4": 41.7,
        "8.5": 42.0,
        "8.6": 42.2,
        "8.7": 42.4,
        "8.8": 42.6,
        "8.9": 42.8,
        "9.0": 43.0
    },
    "4.6": {
        "8.0": 40.7,
        "8.1": 41.0,
        "8.2": 41.3,
        "8.3": 41.6,
        "8.4": 41.9,
        "8.5": 42.2,
        "8.6": 42.4,
        "8.7": 42.6,
        "8.8": 42.8,
        "8.9": 43.0,
        "9.0": 43.2
    },
    "4.7": {
        "8.0": 40.9,
        "8.1": 41.2,
        "8.2": 41.5,
        "8.3": 41.8,
        "8.4": 42.1,
        "8.5": 42.4,
        "8.6": 42.6,
        "8.7": 42.8,
        "8.8": 43.0,
        "8.9": 43.2,
        "9.0": 43.4
    },
    "4.8": {
        "8.0": 41.1,
        "8.1": 41.4,
        "8.2": 41.7,
        "8.3": 42.0,
        "8.4": 42.3,
        "8.5": 42.6,
        "8.6": 42.8,
        "8.7": 43.0,
        "8.8": 43.2,
        "8.9": 43.4,
        "9.0": 43.6
    },
    "4.9": {
        "8.0": 41.3,
        "8.1": 41.6,
        "8.2": 41.9,
        "8.3": 42.2,
        "8.4": 42.5,
        "8.5": 42.8,
        "8.6": 43.0,
        "8.7": 43.2,
        "8.8": 43.4,
        "8.9": 43.6,
        "9.0": 43.8
    },
    "5.0": {
        "8.0": 41.5,
        "8.1": 41.8,
        "8.2": 42.1,
        "8.3": 42.4,
        "8.4": 42.7,
        "8.5": 43.0,
        "8.6": 43.2,
        "8.7": 43.4,
        "8.8": 43.6,
        "8.9": 43.8,
        "9.0": 44.0
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
function prepareForPrint() {
    document.querySelectorAll("input").forEach(input => {
        const span = document.createElement("span");
        span.textContent = input.value || "";
        span.style.display = "inline-block";
        input.parentNode.replaceChild(span, input);
    });
    window.print();
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
