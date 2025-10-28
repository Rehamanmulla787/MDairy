// --- Start of Updated scripts.js ---

document.addEventListener("DOMContentLoaded", function () {
    const farmerList = document.getElementById("farmerList");
    const farmerInput = document.getElementById("farmerName");

    // Example farmers (Replace this with real data from Firebase if needed)
    const farmers = ["Dashrath Salunke", "Anand Nandgavn", "Parasa Alas"];

    // Load farmers into datalist
    function loadFarmers() {
        farmerList.innerHTML = ""; // Clear previous options
        farmers.forEach(farmer => {
            const option = document.createElement("option");
            option.value = farmer;
            farmerList.appendChild(option);
        });
    }

    loadFarmers(); // Populate the list on page load

    // Event: Show filtered suggestions while typing
    farmerInput.addEventListener("input", function () {
        const inputValue = this.value.toLowerCase();
        farmerList.innerHTML = ""; // Clear previous options

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
        const rowMorning = `
            <tr>
                <td>${formattedDate}</td>
                <td><input type="number" class="input litres-morning" onchange="calculateAmount('morning', this)"></td>
                <td><input type="number" class="input fat-morning" onchange="calculateAmount('morning', this)"></td>
                <td><input type="number" class="input snf-morning" onchange="calculateAmount('morning', this)"></td>
                <td class="total-amount-morning"></td>
            </tr>
        `;
        morningTableBody.innerHTML += rowMorning;

        const rowEvening = `
            <tr>
                <td>${formattedDate}</td>
                <td><input type="number" class="input litres-evening" onchange="calculateAmount('evening', this)"></td>
                <td><input type="number" class="input fat-evening" onchange="calculateAmount('evening', this)"></td>
                <td><input type="number" class="input snf-evening" onchange="calculateAmount('evening', this)"></td>
                <td class="total-amount-evening"></td>
            </tr>
        `;
        eveningTableBody.innerHTML += rowEvening;

        currentDate.setDate(currentDate.getDate() + 1);
    }
}


// --- START OF NEW/MODIFIED RATE LOGIC ---

// Milk Rate Chart converted from your Excel file
const milkRateChart = {
  "5.00": {
    "7.5": 28.00,
    "7.6": 29.00,
    "7.7": 30.00,
    "7.8": 31.00,
    "7.9": 32.00,
    "8.0": 33.00,
    "8.1": 34.00,
    "8.2": 35.00,
    "8.3": 36.00,
    "8.4": 37.00,
    "8.5": 38.00,
    "8.6": 38.90,
    "8.7": 39.70,
    "8.8": 40.40,
    "8.9": 41.00,
    "9.0": 41.50,
    "9.1": 41.50,
    "9.2": 41.50,
    "9.3": 41.50,
    "9.4": 41.50,
    "9.5": 41.50
  },
  "5.10": {
    "7.5": 29.50,
    "7.6": 30.50,
    "7.7": 31.50,
    "7.8": 32.50,
    "7.9": 33.50,
    "8.0": 34.50,
    "8.1": 35.50,
    "8.2": 36.50,
    "8.3": 37.50,
    "8.4": 38.50,
    "8.5": 39.50,
    "8.6": 40.40,
    "8.7": 41.20,
    "8.8": 41.90,
    "8.9": 42.50,
    "9.0": 43.00,
    "9.1": 43.00,
    "9.2": 43.00,
    "9.3": 43.00,
    "9.4": 43.00,
    "9.5": 43.00
  },
  "5.20": {
    "7.5": 30.90,
    "7.6": 31.90,
    "7.7": 32.90,
    "7.8": 33.90,
    "7.9": 34.90,
    "8.0": 35.90,
    "8.1": 36.90,
    "8.2": 37.90,
    "8.3": 38.90,
    "8.4": 39.90,
    "8.5": 40.90,
    "8.6": 41.80,
    "8.7": 42.60,
    "8.8": 43.30,
    "8.9": 43.90,
    "9.0": 44.40,
    "9.1": 44.40,
    "9.2": 44.40,
    "9.3": 44.40,
    "9.4": 44.40,
    "9.5": 44.40
  },
  "5.30": {
    "7.5": 32.20,
    "7.6": 33.20,
    "7.7": 34.20,
    "7.8": 35.20,
    "7.9": 36.20,
    "8.0": 37.20,
    "8.1": 38.20,
    "8.2": 39.20,
    "8.3": 40.20,
    "8.4": 41.20,
    "8.5": 42.20,
    "8.6": 43.10,
    "8.7": 43.90,
    "8.8": 44.60,
    "8.9": 45.20,
    "9.0": 45.70,
    "9.1": 45.70,
    "9.2": 45.70,
    "9.3": 45.70,
    "9.4": 45.70,
    "9.5": 45.70
  },
  "5.40": {
    "7.5": 33.40,
    "7.6": 34.40,
    "7.7": 35.40,
    "7.8": 36.40,
    "7.9": 37.40,
    "8.0": 38.40,
    "8.1": 39.40,
    "8.2": 40.40,
    "8.3": 41.40,
    "8.4": 42.40,
    "8.5": 43.40,
    "8.6": 44.30,
    "8.7": 45.10,
    "8.8": 45.80,
    "8.9": 46.40,
    "9.0": 46.90,
    "9.1": 46.90,
    "9.2": 46.90,
    "9.3": 46.90,
    "9.4": 46.90,
    "9.5": 46.90
  },
  "5.50": {
    "7.5": 34.50,
    "7.6": 35.50,
    "7.7": 36.50,
    "7.8": 37.50,
    "7.9": 38.50,
    "8.0": 39.50,
    "8.1": 40.50,
    "8.2": 41.50,
    "8.3": 42.50,
    "8.4": 43.50,
    "8.5": 44.50,
    "8.6": 45.40,
    "8.7": 46.20,
    "8.8": 46.90,
    "8.9": 47.50,
    "9.0": 48.00,
    "9.1": 48.10,
    "9.2": 48.20,
    "9.3": 48.30,
    "9.4": 48.40,
    "9.5": 48.50
  },
  "5.60": {
    "7.5": 35.50,
    "7.6": 36.50,
    "7.7": 37.50,
    "7.8": 38.50,
    "7.9": 39.50,
    "8.0": 40.50,
    "8.1": 41.50,
    "8.2": 42.50,
    "8.3": 43.50,
    "8.4": 44.50,
    "8.5": 45.50,
    "8.6": 46.40,
    "8.7": 47.20,
    "8.8": 47.90,
    "8.9": 48.50,
    "9.0": 49.00,
    "9.1": 49.10,
    "9.2": 49.20,
    "9.3": 49.30,
    "9.4": 49.40,
    "9.5": 49.50
  },
  "5.70": {
    "7.5": 36.40,
    "7.6": 37.40,
    "7.7": 38.40,
    "7.8": 39.40,
    "7.9": 40.40,
    "8.0": 41.40,
    "8.1": 42.40,
    "8.2": 43.40,
    "8.3": 44.40,
    "8.4": 45.40,
    "8.5": 46.40,
    "8.6": 47.30,
    "8.7": 48.10,
    "8.8": 48.80,
    "8.9": 49.40,
    "9.0": 49.90,
    "9.1": 50.00,
    "9.2": 50.10,
    "9.3": 50.20,
    "9.4": 50.30,
    "9.5": 50.40
  },
  "5.80": {
    "7.5": 37.20,
    "7.6": 38.20,
    "7.7": 39.20,
    "7.8": 40.20,
    "7.9": 41.20,
    "8.0": 42.20,
    "8.1": 43.20,
    "8.2": 44.20,
    "8.3": 45.20,
    "8.4": 46.20,
    "8.5": 47.20,
    "8.6": 48.10,
    "8.7": 48.90,
    "8.8": 49.60,
    "8.9": 50.20,
    "9.0": 50.70,
    "9.1": 50.80,
    "9.2": 50.90,
    "9.3": 51.00,
    "9.4": 51.10,
    "9.5": 51.20
  },
  "5.90": {
    "7.5": 37.90,
    "7.6": 38.90,
    "7.7": 39.90,
    "7.8": 40.90,
    "7.9": 41.90,
    "8.0": 42.90,
    "8.1": 43.90,
    "8.2": 44.90,
    "8.3": 45.90,
    "8.4": 46.90,
    "8.5": 47.90,
    "8.6": 48.80,
    "8.7": 49.60,
    "8.8": 50.30,
    "8.9": 50.90,
    "9.0": 51.40,
    "9.1": 51.50,
    "9.2": 51.60,
    "9.3": 51.70,
    "9.4": 51.80,
    "9.5": 51.90
  },
  "6.00": {
    "7.5": 38.50,
    "7.6": 39.50,
    "7.7": 40.50,
    "7.8": 41.50,
    "7.9": 42.50,
    "8.0": 43.50,
    "8.1": 44.50,
    "8.2": 45.50,
    "8.3": 46.50,
    "8.4": 47.50,
    "8.5": 48.50,
    "8.6": 49.40,
    "8.7": 50.20,
    "8.8": 50.90,
    "8.9": 51.50,
    "9.0": 52.00,
    "9.1": 52.10,
    "9.2": 52.20,
    "9.3": 52.30,
    "9.4": 52.40,
    "9.5": 52.50
  },
  "6.10": {
    "7.5": 39.10,
    "7.6": 40.10,
    "7.7": 41.10,
    "7.8": 42.10,
    "7.9": 43.10,
    "8.0": 44.10,
    "8.1": 45.10,
    "8.2": 46.10,
    "8.3": 47.10,
    "8.4": 48.10,
    "8.5": 49.10,
    "8.6": 50.00,
    "8.7": 50.80,
    "8.8": 51.50,
    "8.9": 52.10,
    "9.0": 52.60,
    "9.1": 52.70,
    "9.2": 52.80,
    "9.3": 52.90,
    "9.4": 53.00,
    "9.5": 53.10
  },
  "6.20": {
    "7.5": 39.70,
    "7.6": 40.70,
    "7.7": 41.70,
    "7.8": 42.70,
    "7.9": 43.70,
    "8.0": 44.70,
    "8.1": 45.70,
    "8.2": 46.70,
    "8.3": 47.70,
    "8.4": 48.70,
    "8.5": 49.70,
    "8.6": 50.60,
    "8.7": 51.40,
    "8.8": 52.10,
    "8.9": 52.70,
    "9.0": 53.20,
    "9.1": 53.30,
    "9.2": 53.40,
    "9.3": 53.50,
    "9.4": 53.60,
    "9.5": 53.70
  },
  "6.30": {
    "7.5": 40.30,
    "7.6": 41.30,
    "7.7": 42.30,
    "7.8": 43.30,
    "7.9": 44.30,
    "8.0": 45.30,
    "8.1": 46.30,
    "8.2": 47.30,
    "8.3": 48.30,
    "8.4": 49.30,
    "8.5": 50.30,
    "8.6": 51.20,
    "8.7": 52.00,
    "8.8": 52.70,
    "8.9": 53.30,
    "9.0": 53.80,
    "9.1": 53.90,
    "9.2": 54.00,
    "9.3": 54.10,
    "9.4": 54.20,
    "9.5": 54.30
  },
  "6.40": {
    "7.5": 40.90,
    "7.6": 41.90,
    "7.7": 42.90,
    "7.8": 43.90,
    "7.9": 44.90,
    "8.0": 45.90,
    "8.1": 46.90,
    "8.2": 47.90,
    "8.3": 48.90,
    "8.4": 49.90,
    "8.5": 50.90,
    "8.6": 51.80,
    "8.7": 52.60,
    "8.8": 53.30,
    "8.9": 53.90,
    "9.0": 54.40,
    "9.1": 54.50,
    "9.2": 54.60,
    "9.3": 54.70,
    "9.4": 54.80,
    "9.5": 54.90
  },
  "6.50": {
    "7.5": 41.50,
    "7.6": 42.50,
    "7.7": 43.50,
    "7.8": 44.50,
    "7.9": 45.50,
    "8.0": 46.50,
    "8.1": 47.50,
    "8.2": 48.50,
    "8.3": 49.50,
    "8.4": 50.50,
    "8.5": 51.50,
    "8.6": 52.40,
    "8.7": 53.20,
    "8.8": 53.90,
    "8.9": 54.50,
    "9.0": 55.00,
    "9.1": 55.10,
    "9.2": 55.20,
    "9.3": 55.30,
    "9.4": 55.40,
    "9.5": 55.50
  },
  "6.60": {
    "7.5": 42.10,
    "7.6": 43.10,
    "7.7": 44.10,
    "7.8": 45.10,
    "7.9": 46.10,
    "8.0": 47.10,
    "8.1": 48.10,
    "8.2": 49.10,
    "8.3": 50.10,
    "8.4": 51.10,
    "8.5": 52.10,
    "8.6": 53.00,
    "8.7": 53.80,
    "8.8": 54.50,
    "8.9": 55.10,
    "9.0": 55.60,
    "9.1": 55.70,
    "9.2": 55.80,
    "9.3": 55.90,
    "9.4": 56.00,
    "9.5": 56.10
  },
  "6.70": {
    "7.5": 42.70,
    "7.6": 43.70,
    "7.7": 44.70,
    "7.8": 45.70,
    "7.9": 46.70,
    "8.0": 47.70,
    "8.1": 48.70,
    "8.2": 49.70,
    "8.3": 50.70,
    "8.4": 51.70,
    "8.5": 52.70,
    "8.6": 53.60,
    "8.7": 54.40,
    "8.8": 55.10,
    "8.9": 55.70,
    "9.0": 56.20,
    "9.1": 56.30,
    "9.2": 56.40,
    "9.3": 56.50,
    "9.4": 56.60,
    "9.5": 56.70
  },
  "6.80": {
    "7.5": 43.30,
    "7.6": 44.30,
    "7.7": 45.30,
    "7.8": 46.30,
    "7.9": 47.30,
    "8.0": 48.30,
    "8.1": 49.30,
    "8.2": 50.30,
    "8.3": 51.30,
    "8.4": 52.30,
    "8.5": 53.30,
    "8.6": 54.20,
    "8.7": 55.00,
    "8.8": 55.70,
    "8.9": 56.30,
    "9.0": 56.80,
    "9.1": 56.90,
    "9.2": 57.00,
    "9.3": 57.10,
    "9.4": 57.20,
    "9.5": 57.30
  },
  "6.90": {
    "7.5": 43.90,
    "7.6": 44.90,
    "7.7": 45.90,
    "7.8": 46.90,
    "7.9": 47.90,
    "8.0": 48.90,
    "8.1": 49.90,
    "8.2": 50.90,
    "8.3": 51.90,
    "8.4": 52.90,
    "8.5": 53.90,
    "8.6": 54.80,
    "8.7": 55.60,
    "8.8": 56.30,
    "8.9": 56.90,
    "9.0": 57.40,
    "9.1": 57.50,
    "9.2": 57.60,
    "9.3": 57.70,
    "9.4": 57.80,
    "9.5": 57.90
  },
  "7.00": {
    "7.5": 45.50,
    "7.6": 46.50,
    "7.7": 47.50,
    "7.8": 48.50,
    "7.9": 49.50,
    "8.0": 50.50,
    "8.1": 51.50,
    "8.2": 52.50,
    "8.3": 53.50,
    "8.4": 54.50,
    "8.5": 55.50,
    "8.6": 56.40,
    "8.7": 57.20,
    "8.8": 57.90,
    "8.9": 58.50,
    "9.0": 59.00,
    "9.1": 59.10,
    "9.2": 59.20,
    "9.3": 59.30,
    "9.4": 59.40,
    "9.5": 59.50
  }
};

/**
 * Looks up the rate based on Fat and SNF from the milkRateChart.
 * @param {number} fat - The Fat percentage.
 * @param {number} snf - The SNF percentage.
 * @returns {number} The rate per litre, or 0.00 if not found.
 */
function getRate(fat, snf) {
    // Round to one decimal place and convert to string key for lookup
    const fatKey = parseFloat(fat).toFixed(1);
    const snfKey = parseFloat(snf).toFixed(1);

    // Look up the rate: milkRateChart[fatKey][snfKey]
    const rate = milkRateChart[fatKey] ? milkRateChart[fatKey][snfKey] : undefined;

    return rate !== undefined ? rate : 0.00;
}

/**
 * Calculates the total amount for a row using the milk rate chart lookup.
 * @param {string} tableType - 'morning' or 'evening'.
 * @param {HTMLElement} element - The input element that was changed.
 */
function calculateAmount(tableType, element) {
    const row = element.parentElement.parentElement;
    
    // Get values from the respective inputs
    const litres = parseFloat(row.querySelector(`.litres-${tableType}`)?.value || 0);
    const fat = parseFloat(row.querySelector(`.fat-${tableType}`)?.value || 0);
    const snf = parseFloat(row.querySelector(`.snf-${tableType}`)?.value || 0);

    // Look up the rate
    const ratePerLitre = getRate(fat, snf); 
    
    // Calculate total amount
    const totalAmount = (litres * ratePerLitre);

    // Update the Rate cell and the Total Amount cell
    row.querySelector(`.total-amount-${tableType}`).textContent = totalAmount.toFixed(2);

    calculateTotals();
}

// REMOVED the previous 'calcAmount(fat, snf)' function.

// --- END OF NEW/MODIFIED RATE LOGIC ---


// Function to calculate totals (Only minor updates for the new Rate column)
function calculateTotals() {
    let totalLitresMorning = 0, totalAmountMorning = 0;
    let totalLitresEvening = 0, totalAmountEvening = 0;

    document.querySelectorAll("#morningTableBody tr").forEach(row => {
        totalLitresMorning += parseFloat(row.querySelector(".litres-morning")?.value || 0);
        // Note: Reads total amount from the display TD, not recalculating
        totalAmountMorning += parseFloat(row.querySelector(".total-amount-morning")?.textContent || "0");
    });

    document.querySelectorAll("#eveningTableBody tr").forEach(row => {
        totalLitresEvening += parseFloat(row.querySelector(".litres-evening")?.value || 0);
        totalAmountEvening += parseFloat(row.querySelector(".total-amount-evening")?.textContent || "0");
    });

    document.getElementById("morningTotalLitres").textContent = totalLitresMorning.toFixed(2);
    document.getElementById("morningTotalAmount").textContent = totalAmountMorning.toFixed(2);
    document.getElementById("eveningTotalLitres").textContent = totalLitresEvening.toFixed(2);
    document.getElementById("eveningTotalAmount").textContent = totalAmountEvening.toFixed(2);

    document.getElementById("totalLitres").textContent = (totalLitresMorning + totalLitresEvening).toFixed(2);
    document.getElementById("totalAmount").textContent = (totalAmountMorning + totalAmountEvening).toFixed(2);
}

document.addEventListener("keydown", function (event) {
    const activeElement = document.activeElement;

    if (activeElement.tagName === "INPUT") {
        let row = activeElement.closest("tr");
        if (!row) return;  
        
        let table = row.closest("tbody");
        if (!table) return; 

        let inputs = Array.from(table.querySelectorAll("input"));
        let index = inputs.indexOf(activeElement);

        if (event.key === "ArrowRight" && index < inputs.length - 1) {
            event.preventDefault(); // Prevent browser auto-fill
            inputs[index + 1].focus();
        } 
        else if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            inputs[index - 1].focus();
        } 
        else if (event.key === "ArrowDown") {
            let cellIndex = activeElement.parentElement?.cellIndex;
            if (cellIndex !== undefined) {
                let nextRow = row.nextElementSibling;
                let nextInput = nextRow?.children[cellIndex]?.querySelector("input");
                if (nextInput) {
                    event.preventDefault();
                    nextInput.focus();
                }
            }
        } 
        else if (event.key === "ArrowUp") {
            let cellIndex = activeElement.parentElement?.cellIndex;
            if (cellIndex !== undefined) {
                let prevRow = row.previousElementSibling;
                let prevInput = prevRow?.children[cellIndex]?.querySelector("input");
                if (prevInput) {
                    event.preventDefault();
                    prevInput.focus();
                }
            }
        }
    }
});
function prepareForPrint() {
  document.querySelectorAll("input").forEach(input => {
    const span = document.createElement("span");
    span.textContent = input.value || "";
    span.style.display = "inline-block";
    input.parentNode.replaceChild(span, input);
  });
  window.print();
}


function clearData() {
    const elementsToClear = [
        "billDate", "farmerName", "balance", 
        "morningTotalLitres", "morningTotalAmount",
        "eveningTotalLitres", "eveningTotalAmount",
        "totalLitres", "totalAmount", "signature"
    ];

    // Clear input fields and displayed text
    elementsToClear.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (element.tagName === "INPUT") {
                element.value = "";
            } else {
                element.textContent = "-"; // Set to default display
            }
        }
    });

    // Clear all table data (both text content and inputs inside tables)
    document.querySelectorAll("table tbody").forEach(tbody => tbody.innerHTML = "");

    // Clear inputs inside tables (if tables use inputs for data entry)
    document.querySelectorAll("table input").forEach(input => input.value = "");
    
    // Re-generate the table rows with the new structure
    generatePreviousDates();

    alert("All data cleared successfully");
}


document.addEventListener("DOMContentLoaded", () => {
    // Set today's date on load and generate table rows
    document.getElementById("billDate").value = new Date().toISOString().substring(0, 10);
    generatePreviousDates();

    const darkModeToggle = document.createElement("button");
    darkModeToggle.innerHTML = "🌙"; // Default icon as moon
    darkModeToggle.classList.add("dark-mode-toggle");
    document.body.appendChild(darkModeToggle);

    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.innerHTML = "☀️"; // Change to sun
    }

    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        document.body.style.transition = "background-color 0.3s ease-in-out, color 0.3s ease-in-out";
        
        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            darkModeToggle.innerHTML = "☀️";
        } else {
            localStorage.setItem("darkMode", "disabled");
            darkModeToggle.innerHTML = "🌙";
        }
    });
});
// --- End of Updated scripts.js ---
