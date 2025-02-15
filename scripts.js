
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


function calculateAmount(tableType, element) {
    const row = element.parentElement.parentElement;
    const litres = parseFloat(row.querySelector(`.litres-${tableType}`)?.value || 0);
    const fat = parseFloat(row.querySelector(`.fat-${tableType}`)?.value || 0);
    const snf = parseFloat(row.querySelector(`.snf-${tableType}`)?.value || 0);

    // Ensure calcAmount is correctly calculating the amount
    const totalAmount = (litres * calcAmount(fat, snf)).toFixed(2);

    row.querySelector(`.total-amount-${tableType}`).textContent = totalAmount;

    calculateTotals();
}


// Function to calculate totals
function calculateTotals() {
    let totalLitresMorning = 0, totalAmountMorning = 0;
    let totalLitresEvening = 0, totalAmountEvening = 0;

    document.querySelectorAll("#morningTableBody tr").forEach(row => {
        totalLitresMorning += parseFloat(row.querySelector(".litres-morning")?.value || 0);
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





function calcAmount(fat, snf) {
    const s = 9.0;
    const sp = (snf - s) * 10;
    const sa = snf <= 9.0 ? sp * 0.50 : sp * 0.05;

    const f = 6.5;
    const fp = (fat - f) * 10;
    const fa = fat <= 6.5 ? fp * 0.50 : fp * 0.60;

    const amount = sa + fa + 52.50;
    return amount;
}


function createTableRow(rowData) {
    const row = document.createElement("tr");

    // Create and append cells for date, litres, fat, snf, and totalAmount
    const dateCell = document.createElement("td");
    dateCell.textContent = rowData.date;
    row.appendChild(dateCell);

    const litresCell = document.createElement("td");
    const litresInput = document.createElement("input");
    litresInput.type = "number";
    litresInput.value = rowData.litres;
    litresInput.addEventListener("input", calculateTotals); // Add event listener to recalculate totals on input change
    litresCell.appendChild(litresInput);
    row.appendChild(litresCell);

    const fatCell = document.createElement("td");
    const fatInput = document.createElement("input");
    fatInput.type = "number";
    fatInput.value = rowData.fat;
    fatInput.addEventListener("input", calculateTotals); // Add event listener to recalculate totals on input change
    fatCell.appendChild(fatInput);
    row.appendChild(fatCell);

    const snfCell = document.createElement("td");
    const snfInput = document.createElement("input");
    snfInput.type = "number";
    snfInput.value = rowData.snf;
    snfInput.addEventListener("input", calculateTotals); // Add event listener to recalculate totals on input change
    snfCell.appendChild(snfInput);
    row.appendChild(snfCell);

    const totalAmountCell = document.createElement("td");
    totalAmountCell.textContent = rowData.totalAmount;
    row.appendChild(totalAmountCell);

    return row;
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
                element.textContent = "";
            }
        }
    });

    // Clear all table data (both text content and inputs inside tables)
    document.querySelectorAll("table tbody").forEach(tbody => tbody.innerHTML = "");

    // Clear inputs inside tables (if tables use inputs for data entry)
    document.querySelectorAll("table input").forEach(input => input.value = "");

    alert("All data cleared successfully");
}


document.addEventListener("DOMContentLoaded", () => {
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