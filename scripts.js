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

const milkRateChart = {
    "5.0": {
        "8.5": 52.0,
        "8.6": 52.5,
        "8.7": 53.0,
        "8.8": 53.5,
        "8.9": 54.0,
        "9.0": 54.5,
        "9.1": 55.0,
        "9.2": 55.5,
        "9.3": 56.0,
        "9.4": 56.5,
        "9.5": 57.0,
        "9.6": 57.5,
        "9.7": 58.0,
        "9.8": 58.5,
        "9.9": 59.0,
        "10.0": 59.5
    },
    "5.1": {
        "8.5": 52.5,
        "8.6": 53.0,
        "8.7": 53.5,
        "8.8": 54.0,
        "8.9": 54.5,
        "9.0": 55.0,
        "9.1": 55.5,
        "9.2": 56.0,
        "9.3": 56.5,
        "9.4": 57.0,
        "9.5": 57.5,
        "9.6": 58.0,
        "9.7": 58.5,
        "9.8": 59.0,
        "9.9": 59.5,
        "10.0": 60.0
    },
    "5.2": {
        "8.5": 53.0,
        "8.6": 53.5,
        "8.7": 54.0,
        "8.8": 54.5,
        "8.9": 55.0,
        "9.0": 55.5,
        "9.1": 56.0,
        "9.2": 56.5,
        "9.3": 57.0,
        "9.4": 57.5,
        "9.5": 58.0,
        "9.6": 58.5,
        "9.7": 59.0,
        "9.8": 59.5,
        "9.9": 60.0,
        "10.0": 60.5
    },
    "5.3": {
        "8.5": 53.5,
        "8.6": 54.0,
        "8.7": 54.5,
        "8.8": 55.0,
        "8.9": 55.5,
        "9.0": 56.0,
        "9.1": 56.5,
        "9.2": 57.0,
        "9.3": 57.5,
        "9.4": 58.0,
        "9.5": 58.5,
        "9.6": 59.0,
        "9.7": 59.5,
        "9.8": 60.0,
        "9.9": 60.5,
        "10.0": 61.0
    },
    "5.4": {
        "8.5": 54.0,
        "8.6": 54.5,
        "8.7": 55.0,
        "8.8": 55.5,
        "8.9": 56.0,
        "9.0": 56.5,
        "9.1": 57.0,
        "9.2": 57.5,
        "9.3": 58.0,
        "9.4": 58.5,
        "9.5": 59.0,
        "9.6": 59.5,
        "9.7": 60.0,
        "9.8": 60.5,
        "9.9": 61.0,
        "10.0": 61.5
    },
    "5.5": {
        "8.5": 54.5,
        "8.6": 55.0,
        "8.7": 55.5,
        "8.8": 56.0,
        "8.9": 56.5,
        "9.0": 57.0,
        "9.1": 57.5,
        "9.2": 58.0,
        "9.3": 58.5,
        "9.4": 59.0,
        "9.5": 59.5,
        "9.6": 60.0,
        "9.7": 60.5,
        "9.8": 61.0,
        "9.9": 61.5,
        "10.0": 62.0
    },
    "5.6": {
        "8.5": 55.0,
        "8.6": 55.5,
        "8.7": 56.0,
        "8.8": 56.5,
        "8.9": 57.0,
        "9.0": 57.5,
        "9.1": 58.0,
        "9.2": 58.5,
        "9.3": 59.0,
        "9.4": 59.5,
        "9.5": 60.0,
        "9.6": 60.5,
        "9.7": 61.0,
        "9.8": 61.5,
        "9.9": 62.0,
        "10.0": 62.5
    },
    "5.7": {
        "8.5": 55.5,
        "8.6": 56.0,
        "8.7": 56.5,
        "8.8": 57.0,
        "8.9": 57.5,
        "9.0": 58.0,
        "9.1": 58.5,
        "9.2": 59.0,
        "9.3": 59.5,
        "9.4": 60.0,
        "9.5": 60.5,
        "9.6": 61.0,
        "9.7": 61.5,
        "9.8": 62.0,
        "9.9": 62.5,
        "10.0": 63.0
    },
    "5.8": {
        "8.5": 56.0,
        "8.6": 56.5,
        "8.7": 57.0,
        "8.8": 57.5,
        "8.9": 58.0,
        "9.0": 58.5,
        "9.1": 59.0,
        "9.2": 59.5,
        "9.3": 60.0,
        "9.4": 60.5,
        "9.5": 61.0,
        "9.6": 61.5,
        "9.7": 62.0,
        "9.8": 62.5,
        "9.9": 63.0,
        "10.0": 63.5
    },
    "5.9": {
        "8.5": 56.5,
        "8.6": 57.0,
        "8.7": 57.5,
        "8.8": 58.0,
        "8.9": 58.5,
        "9.0": 59.0,
        "9.1": 59.5,
        "9.2": 60.0,
        "9.3": 60.5,
        "9.4": 61.0,
        "9.5": 61.5,
        "9.6": 62.0,
        "9.7": 62.5,
        "9.8": 63.0,
        "9.9": 63.5,
        "10.0": 64.0
    },
    "6.0": {
        "8.5": 57.0,
        "8.6": 57.5,
        "8.7": 58.0,
        "8.8": 58.5,
        "8.9": 59.0,
        "9.0": 59.5,
        "9.1": 60.0,
        "9.2": 60.5,
        "9.3": 61.0,
        "9.4": 61.5,
        "9.5": 62.0,
        "9.6": 62.5,
        "9.7": 63.0,
        "9.8": 63.5,
        "9.9": 64.0,
        "10.0": 64.5
    },
    "6.1": {
        "8.5": 57.5,
        "8.6": 58.0,
        "8.7": 58.5,
        "8.8": 59.0,
        "8.9": 59.5,
        "9.0": 60.0,
        "9.1": 60.5,
        "9.2": 61.0,
        "9.3": 61.5,
        "9.4": 62.0,
        "9.5": 62.5,
        "9.6": 63.0,
        "9.7": 63.5,
        "9.8": 64.0,
        "9.9": 64.5,
        "10.0": 65.0
    },
    "6.2": {
        "8.5": 58.0,
        "8.6": 58.5,
        "8.7": 59.0,
        "8.8": 59.5,
        "8.9": 60.0,
        "9.0": 60.5,
        "9.1": 61.0,
        "9.2": 61.5,
        "9.3": 62.0,
        "9.4": 62.5,
        "9.5": 63.0,
        "9.6": 63.5,
        "9.7": 64.0,
        "9.8": 64.5,
        "9.9": 65.0,
        "10.0": 65.5
    },
    "6.3": {
        "8.5": 58.5,
        "8.6": 59.0,
        "8.7": 59.5,
        "8.8": 60.0,
        "8.9": 60.5,
        "9.0": 61.0,
        "9.1": 61.5,
        "9.2": 62.0,
        "9.3": 62.5,
        "9.4": 63.0,
        "9.5": 63.5,
        "9.6": 64.0,
        "9.7": 64.5,
        "9.8": 65.0,
        "9.9": 65.5,
        "10.0": 66.0
    },
    "6.4": {
        "8.5": 59.0,
        "8.6": 59.5,
        "8.7": 60.0,
        "8.8": 60.5,
        "8.9": 61.0,
        "9.0": 61.5,
        "9.1": 62.0,
        "9.2": 62.5,
        "9.3": 63.0,
        "9.4": 63.5,
        "9.5": 64.0,
        "9.6": 64.5,
        "9.7": 65.0,
        "9.8": 65.5,
        "9.9": 66.0,
        "10.0": 66.5
    },
    "6.5": {
        "8.5": 59.5,
        "8.6": 60.0,
        "8.7": 60.5,
        "8.8": 61.0,
        "8.9": 61.5,
        "9.0": 62.0,
        "9.1": 62.5,
        "9.2": 63.0,
        "9.3": 63.5,
        "9.4": 64.0,
        "9.5": 64.5,
        "9.6": 65.0,
        "9.7": 65.5,
        "9.8": 66.0,
        "9.9": 66.5,
        "10.0": 67.0
    },
    "6.6": {
        "8.5": 60.0,
        "8.6": 60.5,
        "8.7": 61.0,
        "8.8": 61.5,
        "8.9": 62.0,
        "9.0": 62.5,
        "9.1": 63.0,
        "9.2": 63.5,
        "9.3": 64.0,
        "9.4": 64.5,
        "9.5": 65.0,
        "9.6": 65.5,
        "9.7": 66.0,
        "9.8": 66.5,
        "9.9": 67.0,
        "10.0": 67.5
    },
    "6.7": {
        "8.5": 60.5,
        "8.6": 61.0,
        "8.7": 61.5,
        "8.8": 62.0,
        "8.9": 62.5,
        "9.0": 63.0,
        "9.1": 63.5,
        "9.2": 64.0,
        "9.3": 64.5,
        "9.4": 65.0,
        "9.5": 65.5,
        "9.6": 66.0,
        "9.7": 66.5,
        "9.8": 67.0,
        "9.9": 67.5,
        "10.0": 68.0
    },
    "6.8": {
        "8.5": 61.0,
        "8.6": 61.5,
        "8.7": 62.0,
        "8.8": 62.5,
        "8.9": 63.0,
        "9.0": 63.5,
        "9.1": 64.0,
        "9.2": 64.5,
        "9.3": 65.0,
        "9.4": 65.5,
        "9.5": 66.0,
        "9.6": 66.5,
        "9.7": 67.0,
        "9.8": 67.5,
        "9.9": 68.0,
        "10.0": 68.5
    },
    "6.9": {
        "8.5": 61.5,
        "8.6": 62.0,
        "8.7": 62.5,
        "8.8": 63.0,
        "8.9": 63.5,
        "9.0": 64.0,
        "9.1": 64.5,
        "9.2": 65.0,
        "9.3": 65.5,
        "9.4": 66.0,
        "9.5": 66.5,
        "9.6": 67.0,
        "9.7": 67.5,
        "9.8": 68.0,
        "9.9": 68.5,
        "10.0": 69.0
    },
    "7.0": {
        "8.5": 62.0,
        "8.6": 62.5,
        "8.7": 63.0,
        "8.8": 63.5,
        "8.9": 64.0,
        "9.0": 64.5,
        "9.1": 65.0,
        "9.2": 65.5,
        "9.3": 66.0,
        "9.4": 66.5,
        "9.5": 67.0,
        "9.6": 67.5,
        "9.7": 68.0,
        "9.8": 68.5,
        "9.9": 69.0,
        "10.0": 69.5
    },
    "7.1": {
        "8.5": 62.5,
        "8.6": 63.0,
        "8.7": 63.5,
        "8.8": 64.0,
        "8.9": 64.5,
        "9.0": 65.0,
        "9.1": 65.5,
        "9.2": 66.0,
        "9.3": 66.5,
        "9.4": 67.0,
        "9.5": 67.5,
        "9.6": 68.0,
        "9.7": 68.5,
        "9.8": 69.0,
        "9.9": 69.5,
        "10.0": 70.0
    },
    "7.2": {
        "8.5": 63.0,
        "8.6": 63.5,
        "8.7": 64.0,
        "8.8": 64.5,
        "8.9": 65.0,
        "9.0": 65.5,
        "9.1": 66.0,
        "9.2": 66.5,
        "9.3": 67.0,
        "9.4": 67.5,
        "9.5": 68.0,
        "9.6": 68.5,
        "9.7": 69.0,
        "9.8": 69.5,
        "9.9": 70.0,
        "10.0": 70.5
    },
    "7.3": {
        "8.5": 63.5,
        "8.6": 64.0,
        "8.7": 64.5,
        "8.8": 65.0,
        "8.9": 65.5,
        "9.0": 66.0,
        "9.1": 66.5,
        "9.2": 67.0,
        "9.3": 67.5,
        "9.4": 68.0,
        "9.5": 68.5,
        "9.6": 69.0,
        "9.7": 69.5,
        "9.8": 70.0,
        "9.9": 70.5,
        "10.0": 71.0
    },
    "7.4": {
        "8.5": 64.0,
        "8.6": 64.5,
        "8.7": 65.0,
        "8.8": 65.5,
        "8.9": 66.0,
        "9.0": 66.5,
        "9.1": 67.0,
        "9.2": 67.5,
        "9.3": 68.0,
        "9.4": 68.5,
        "9.5": 69.0,
        "9.6": 69.5,
        "9.7": 70.0,
        "9.8": 70.5,
        "9.9": 71.0,
        "10.0": 71.5
    },
    "7.5": {
        "8.5": 64.5,
        "8.6": 65.0,
        "8.7": 65.5,
        "8.8": 66.0,
        "8.9": 66.5,
        "9.0": 67.0,
        "9.1": 67.5,
        "9.2": 68.0,
        "9.3": 68.5,
        "9.4": 69.0,
        "9.5": 69.5,
        "9.6": 70.0,
        "9.7": 70.5,
        "9.8": 71.0,
        "9.9": 71.5,
        "10.0": 72.0
    },
    "7.6": {
        "8.5": 65.0,
        "8.6": 65.5,
        "8.7": 66.0,
        "8.8": 66.5,
        "8.9": 67.0,
        "9.0": 67.5,
        "9.1": 68.0,
        "9.2": 68.5,
        "9.3": 69.0,
        "9.4": 69.5,
        "9.5": 70.0,
        "9.6": 70.5,
        "9.7": 71.0,
        "9.8": 71.5,
        "9.9": 72.0,
        "10.0": 72.5
    },
    "7.7": {
        "8.5": 65.5,
        "8.6": 66.0,
        "8.7": 66.5,
        "8.8": 67.0,
        "8.9": 67.5,
        "9.0": 68.0,
        "9.1": 68.5,
        "9.2": 69.0,
        "9.3": 69.5,
        "9.4": 70.0,
        "9.5": 70.5,
        "9.6": 71.0,
        "9.7": 71.5,
        "9.8": 72.0,
        "9.9": 72.5,
        "10.0": 73.0
    },
    "7.8": {
        "8.5": 66.0,
        "8.6": 66.5,
        "8.7": 67.0,
        "8.8": 67.5,
        "8.9": 68.0,
        "9.0": 68.5,
        "9.1": 69.0,
        "9.2": 69.5,
        "9.3": 70.0,
        "9.4": 70.5,
        "9.5": 71.0,
        "9.6": 71.5,
        "9.7": 72.0,
        "9.8": 72.5,
        "9.9": 73.0,
        "10.0": 73.5
    },
    "7.9": {
        "8.5": 66.5,
        "8.6": 67.0,
        "8.7": 67.5,
        "8.8": 68.0,
        "8.9": 68.5,
        "9.0": 69.0,
        "9.1": 69.5,
        "9.2": 70.0,
        "9.3": 70.5,
        "9.4": 71.0,
        "9.5": 71.5,
        "9.6": 72.0,
        "9.7": 72.5,
        "9.8": 73.0,
        "9.9": 73.5,
        "10.0": 74.0
    },
    "8.0": {
        "8.5": 67.0,
        "8.6": 67.5,
        "8.7": 68.0,
        "8.8": 68.5,
        "8.9": 69.0,
        "9.0": 69.5,
        "9.1": 70.0,
        "9.2": 70.5,
        "9.3": 71.0,
        "9.4": 71.5,
        "9.5": 72.0,
        "9.6": 72.5,
        "9.7": 73.0,
        "9.8": 73.5,
        "9.9": 74.0,
        "10.0": 74.5
    },
    "8.1": {
        "8.5": 67.5,
        "8.6": 68.0,
        "8.7": 68.5,
        "8.8": 69.0,
        "8.9": 69.5,
        "9.0": 70.0,
        "9.1": 70.5,
        "9.2": 71.0,
        "9.3": 71.5,
        "9.4": 72.0,
        "9.5": 72.5,
        "9.6": 73.0,
        "9.7": 73.5,
        "9.8": 74.0,
        "9.9": 74.5,
        "10.0": 75.0
    },
    "8.2": {
        "8.5": 68.0,
        "8.6": 68.5,
        "8.7": 69.0,
        "8.8": 69.5,
        "8.9": 70.0,
        "9.0": 70.5,
        "9.1": 71.0,
        "9.2": 71.5,
        "9.3": 72.0,
        "9.4": 72.5,
        "9.5": 73.0,
        "9.6": 73.5,
        "9.7": 74.0,
        "9.8": 74.5,
        "9.9": 75.0,
        "10.0": 75.5
    },
    "8.3": {
        "8.5": 68.5,
        "8.6": 69.0,
        "8.7": 69.5,
        "8.8": 70.0,
        "8.9": 70.5,
        "9.0": 71.0,
        "9.1": 71.5,
        "9.2": 72.0,
        "9.3": 72.5,
        "9.4": 73.0,
        "9.5": 73.5,
        "9.6": 74.0,
        "9.7": 74.5,
        "9.8": 75.0,
        "9.9": 75.5,
        "10.0": 76.0
    },
    "8.4": {
        "8.5": 69.0,
        "8.6": 69.5,
        "8.7": 70.0,
        "8.8": 70.5,
        "8.9": 71.0,
        "9.0": 71.5,
        "9.1": 72.0,
        "9.2": 72.5,
        "9.3": 73.0,
        "9.4": 73.5,
        "9.5": 74.0,
        "9.6": 74.5,
        "9.7": 75.0,
        "9.8": 75.5,
        "9.9": 76.0,
        "10.0": 76.5
    },
    "8.5": {
        "8.5": 69.5,
        "8.6": 70.0,
        "8.7": 70.5,
        "8.8": 71.0,
        "8.9": 71.5,
        "9.0": 72.0,
        "9.1": 72.5,
        "9.2": 73.0,
        "9.3": 73.5,
        "9.4": 74.0,
        "9.5": 74.5,
        "9.6": 75.0,
        "9.7": 75.5,
        "9.8": 76.0,
        "9.9": 76.5,
        "10.0": 77.0
    },
    "8.6": {
        "8.5": 70.0,
        "8.6": 70.5,
        "8.7": 71.0,
        "8.8": 71.5,
        "8.9": 72.0,
        "9.0": 72.5,
        "9.1": 73.0,
        "9.2": 73.5,
        "9.3": 74.0,
        "9.4": 74.5,
        "9.5": 75.0,
        "9.6": 75.5,
        "9.7": 76.0,
        "9.8": 76.5,
        "9.9": 77.0,
        "10.0": 77.5
    },
    "8.7": {
        "8.5": 70.5,
        "8.6": 71.0,
        "8.7": 71.5,
        "8.8": 72.0,
        "8.9": 72.5,
        "9.0": 73.0,
        "9.1": 73.5,
        "9.2": 74.0,
        "9.3": 74.5,
        "9.4": 75.0,
        "9.5": 75.5,
        "9.6": 76.0,
        "9.7": 76.5,
        "9.8": 77.0,
        "9.9": 77.5,
        "10.0": 78.0
    },
    "8.8": {
        "8.5": 71.0,
        "8.6": 71.5,
        "8.7": 72.0,
        "8.8": 72.5,
        "8.9": 73.0,
        "9.0": 73.5,
        "9.1": 74.0,
        "9.2": 74.5,
        "9.3": 75.0,
        "9.4": 75.5,
        "9.5": 76.0,
        "9.6": 76.5,
        "9.7": 77.0,
        "9.8": 77.5,
        "9.9": 78.0,
        "10.0": 78.5
    },
    "8.9": {
        "8.5": 71.5,
        "8.6": 72.0,
        "8.7": 72.5,
        "8.8": 73.0,
        "8.9": 73.5,
        "9.0": 74.0,
        "9.1": 74.5,
        "9.2": 75.0,
        "9.3": 75.5,
        "9.4": 76.0,
        "9.5": 76.5,
        "9.6": 77.0,
        "9.7": 77.5,
        "9.8": 78.0,
        "9.9": 78.5,
        "10.0": 79.0
    },
    "9.0": {
        "8.5": 72.0,
        "8.6": 72.5,
        "8.7": 73.0,
        "8.8": 73.5,
        "8.9": 74.0,
        "9.0": 74.5,
        "9.1": 75.0,
        "9.2": 75.5,
        "9.3": 76.0,
        "9.4": 76.5,
        "9.5": 77.0,
        "9.6": 77.5,
        "9.7": 78.0,
        "9.8": 78.5,
        "9.9": 79.0,
        "10.0": 79.5
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

    const baseRate = milkRateChart[fatKey] ? milkRateChart[fatKey][snfKey] : undefined;
    if (baseRate === undefined) return null;

    return Math.round((baseRate + RATE_ADJUSTMENT) * 100) / 100;
}

function setInvalid(input, invalid) {
    if (!input) return;
    input.style.outline = invalid ? "2px solid red" : "";
    input.title = invalid ? "FAT/SNF not in rate chart (FAT 5.0-9.0, SNF 8.5-10.0, steps of 0.1)" : "";
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
