// --- scripts.js (merged: cow milk chart + fixes + all original features) ---

function todayLocal() {
    const t = new Date();
    return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

document.addEventListener("DOMContentLoaded", function () {
    // ---------- Farmer list ----------
    const farmerList = document.getElementById("farmerList");
    const farmers = ["Dashrath Salunke", "Anand Nandgavn", "Parasa Alas"];
    if (farmerList) {
        farmers.forEach(farmer => {
            const option = document.createElement("option");
            option.value = farmer;
            farmerList.appendChild(option);
        });
    }

    // ---------- Bill date ----------
    const billDate = document.getElementById("billDate");
    if (billDate) {
        billDate.addEventListener("change", generatePreviousDates);
        billDate.value = todayLocal(); // today's date on load
    }

    // ---------- Recalculate while typing (one listener per table) ----------
    [["morningTableBody", "morning"], ["eveningTableBody", "evening"]].forEach(([id, type]) => {
        const body = document.getElementById(id);
        if (!body) return;
        body.addEventListener("input", function (e) {
            if (e.target.matches("input")) calculateAmount(type, e.target);
        });
    });

    generatePreviousDates();

    // ---------- Dark mode ----------
    const darkModeToggle = document.createElement("button");
    darkModeToggle.innerHTML = "🌙";
    darkModeToggle.classList.add("dark-mode-toggle");
    document.body.appendChild(darkModeToggle);

    try {
        if (localStorage.getItem("darkMode") === "enabled") {
            document.body.classList.add("dark-mode");
            darkModeToggle.innerHTML = "☀️";
        }
    } catch (e) { /* storage unavailable */ }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        document.body.style.transition = "background-color 0.3s ease-in-out, color 0.3s ease-in-out";
        const on = document.body.classList.contains("dark-mode");
        darkModeToggle.innerHTML = on ? "☀️" : "🌙";
        try { localStorage.setItem("darkMode", on ? "enabled" : "disabled"); } catch (e) { /* ignore */ }
    });
});

function generatePreviousDates() {
    const morningTableBody = document.getElementById("morningTableBody");
    const eveningTableBody = document.getElementById("eveningTableBody");
    const value = document.getElementById("billDate").value; // "YYYY-MM-DD"

    // Date cleared: empty the tables instead of showing "Invalid Date"
    if (!value) {
        morningTableBody.innerHTML = "";
        eveningTableBody.innerHTML = "";
        calculateTotals();
        return;
    }

    // Parse parts manually to avoid UTC time zone shifts
    const [y, m, d] = value.split("-").map(Number);
    const currentDate = new Date(y, m - 1, d - 6);

    let morningHtml = "";
    let eveningHtml = "";

    for (let i = 0; i < 7; i++) {
        const dd = String(currentDate.getDate()).padStart(2, "0");
        const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
        const formattedDate = `${dd}/${mm}`;

        ["morning", "evening"].forEach(type => {
            const rowHtml = `
            <tr>
                <td>${formattedDate}</td>
                <td><input type="number" class="input litres-${type}" min="0" step="0.01"></td>
                <td><input type="number" class="input fat-${type}" min="0" step="0.1"></td>
                <td><input type="number" class="input snf-${type}" min="0" step="0.1"></td>
                <td class="total-amount-${type}">0.00</td>
                <td class="rate-${type}" style="display:none">0.00</td>
            </tr>`;
            if (type === "morning") morningHtml += rowHtml;
            else eveningHtml += rowHtml;
        });

        currentDate.setDate(currentDate.getDate() + 1);
    }

    morningTableBody.innerHTML = morningHtml;
    eveningTableBody.innerHTML = eveningHtml;
    calculateTotals(); // reset totals to match the new empty tables
}

// ================= RATE CHART =================

const cowmilkRateChart = {
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

// ================= RATE LOGIC =================

// Change this single value to raise or lower all rates.
// Positive = increase, negative = decrease. Examples: 1 = +1 rupee, -2 = -2 rupees, 0.5 = +50 paise
const RATE_ADJUSTMENT = 1; // Currently +1 rupee

// Returns the rate, or null if FAT/SNF is not in the chart.
function getRate(fat, snf) {
    if (!isFinite(fat) || !isFinite(snf)) return null;

    // Only exact 0.1 steps are accepted (no silent rounding of values like 3.25)
    const fatTenths = Math.round(fat * 10);
    const snfTenths = Math.round(snf * 10);
    if (Math.abs(fat * 10 - fatTenths) > 1e-6 || Math.abs(snf * 10 - snfTenths) > 1e-6) return null;

    const fatKey = (fatTenths / 10).toFixed(1);
    const snfKey = (snfTenths / 10).toFixed(1);

    const baseRate = cowmilkRateChart[fatKey] ? cowmilkRateChart[fatKey][snfKey] : undefined;
    if (baseRate === undefined) return null;

    return Math.round((baseRate + RATE_ADJUSTMENT) * 100) / 100;
}

function setInvalid(input, invalid) {
    if (!input) return;
    input.style.outline = invalid ? "2px solid red" : "";
    input.title = invalid ? "FAT/SNF not in rate chart (FAT 3.0-5.0, SNF 8.0-9.0, steps of 0.1)" : "";
}

function calculateAmount(type, element) {
    const row = element.closest("tr");
    const litresInput = row.querySelector(`.litres-${type}`);
    const fatInput = row.querySelector(`.fat-${type}`);
    const snfInput = row.querySelector(`.snf-${type}`);

    const litres = parseFloat(litresInput?.value) || 0;
    let total = 0;

    if (fatInput.value === "" && snfInput.value === "") {
        setInvalid(fatInput, false);
        setInvalid(snfInput, false);
    } else {
        const rate = getRate(parseFloat(fatInput.value), parseFloat(snfInput.value));
        const invalid = rate === null;
        setInvalid(fatInput, invalid);
        setInvalid(snfInput, invalid);
        if (!invalid) total = litres * rate;
    }

    row.querySelector(`.total-amount-${type}`).textContent = total.toFixed(2);
    const rateCell = row.querySelector(`.rate-${type}`);
    if (rateCell) rateCell.textContent = (litres > 0 && total > 0 ? total / litres : 0).toFixed(2);
    calculateTotals();
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function calculateTotals() {
    const sums = {};

    ["morning", "evening"].forEach(type => {
        let litres = 0, amount = 0;
        document.querySelectorAll(`#${type}TableBody tr`).forEach(row => {
            litres += parseFloat(row.querySelector(`.litres-${type}`)?.value) || 0;
            amount += parseFloat(row.querySelector(`.total-amount-${type}`)?.textContent) || 0;
        });
        sums[type] = { litres, amount };
    });

    setText("morningTotalLitres", sums.morning.litres.toFixed(2));
    setText("morningTotalAmount", sums.morning.amount.toFixed(2));
    setText("eveningTotalLitres", sums.evening.litres.toFixed(2));
    setText("eveningTotalAmount", sums.evening.amount.toFixed(2));
    setText("totalLitres", (sums.morning.litres + sums.evening.litres).toFixed(2));
    setText("totalAmount", (sums.morning.amount + sums.evening.amount).toFixed(2));
}

// ---------- Arrow-key navigation ----------
document.addEventListener("keydown", function (event) {
    const activeElement = document.activeElement;
    if (!activeElement || activeElement.tagName !== "INPUT") return;

    const row = activeElement.closest("tr");
    if (!row) return;
    const table = row.closest("tbody");
    if (!table) return;

    const inputs = Array.from(table.querySelectorAll("input"));
    const index = inputs.indexOf(activeElement);

    if (event.key === "ArrowRight" && index < inputs.length - 1) {
        event.preventDefault();
        inputs[index + 1].focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        inputs[index - 1].focus();
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        const cellIndex = activeElement.parentElement?.cellIndex;
        if (cellIndex === undefined) return;
        const otherRow = event.key === "ArrowDown" ? row.nextElementSibling : row.previousElementSibling;
        const otherInput = otherRow?.children[cellIndex]?.querySelector("input");
        if (otherInput) {
            event.preventDefault();
            otherInput.focus();
        }
    }
});

// Swap inputs for plain text while printing, then restore them afterwards
function prepareForPrint() {
    const swapped = [];

    document.querySelectorAll("input").forEach(input => {
        const span = document.createElement("span");
        span.textContent = input.value || "";
        span.style.display = "inline-block";
        input.parentNode.replaceChild(span, input);
        swapped.push([span, input]);
    });

    function restore() {
        swapped.forEach(([span, input]) => {
            if (span.parentNode) span.parentNode.replaceChild(input, span);
        });
        window.removeEventListener("afterprint", restore);
    }
    window.addEventListener("afterprint", restore);

    window.print();
}

function clearData() {
    if (!confirm("Clear all data?")) return;

    ["farmerName", "balance", "signature"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") el.value = "";
        else el.textContent = "-";
    });

    const billDate = document.getElementById("billDate");
    if (billDate) billDate.value = todayLocal();

    generatePreviousDates(); // rebuilds empty rows and resets all totals to 0.00
    alert("All data cleared successfully");
}

// --- End ---
