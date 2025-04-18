document.addEventListener("DOMContentLoaded", function () {
    const calculatorForm = document.getElementById("calculatorForm");
    const recordTable = document.getElementById("recordTable").getElementsByTagName("tbody")[0];
    const totalIncomeElem = document.getElementById("totalIncome");
    const totalExpenseElem = document.getElementById("totalExpense");
    const totalProfitElem = document.getElementById("totalProfit");
    const downloadBtn = document.getElementById("downloadBtn");
    const fileUpload = document.getElementById("fileUpload");
    const clearAllBtn = document.getElementById("clearAllBtn");

    let records = [];

    // Function to update totals
    function updateTotals() {
        let totalIncome = 0, totalExpense = 0, totalProfit = 0;

        records.forEach(record => {
            totalIncome += record.income;
            totalExpense += record.expense;
            totalProfit += record.profit;
        });

        totalIncomeElem.textContent = totalIncome.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        totalExpenseElem.textContent = totalExpense.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        totalProfitElem.textContent = totalProfit.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }

    // Function to add a new record to the table
    function addRecord(month, income, expense, profit) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${month}</td>
            <td>${income.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
            <td>${expense.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
            <td>${profit.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
            <td><button class="deleteBtn">删除</button></td>
        `;

        // Handle delete action
        row.querySelector(".deleteBtn").addEventListener("click", () => {
            records = records.filter(record => record.income !== income || record.expense !== expense);
            row.remove();
            updateTotals();
            toggleDownloadButton(); // Update download button state
        });

        recordTable.appendChild(row);
    }

    // Format the number as money (with thousands separators)
    function formatMoney(value) {
        return value.replace(/\D/g, '').replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
    }

    // Handle form submission
    calculatorForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const month = document.getElementById("month").value.trim(); // Get the selected month
        let income = document.getElementById("income").value;
        let expense = document.getElementById("expense").value;

        // Remove commas and parse as float
        income = parseFloat(income.replace(/,/g, ''));
        expense = parseFloat(expense.replace(/,/g, ''));

        // Validate inputs
        if (isNaN(income) || isNaN(expense) || income <= 0 || expense <= 0 || !month) {
            alert("请输入有效的月份、收入和支出数额！");
            return;
        }

        const profit = income - expense;
        records.push({ month, income, expense, profit });

        addRecord(month, income, expense, profit);
        updateTotals();
        toggleDownloadButton(); // Update download button state

        // Clear form inputs
        calculatorForm.reset();
    });

    // Disable download button if no records
    function toggleDownloadButton() {
        if (records.length === 0) {
            downloadBtn.disabled = true;
        } else {
            downloadBtn.disabled = false;
        }
    }

    // Download the records as CSV
    downloadBtn.addEventListener("click", function () {
        if (records.length === 0) {
            showErrorMessage("No records to download!");
            return;
        }

        let csvContent = "Month, Income (RM), Expense (RM), Profit (RM)\n"; // English headers

        records.forEach(record => {
            csvContent += `${record.month}, ${record.income.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}, ${record.expense.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}, ${record.profit.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}\n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");

        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", "financial_records.csv");
        link.click();
    });

    // Handle file upload
    fileUpload.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file && file.type === "text/csv") {
            const reader = new FileReader();

            reader.onload = function (e) {
                const contents = e.target.result;
                const rows = contents.split("\n");

                // Clear previous records
                records = [];
                recordTable.innerHTML = "";  // Clear the table

                // Skip the header row
                rows.slice(1).forEach(row => {
                    const columns = row.split(",");
                    if (columns.length === 4) {  // Updated to check for 4 columns: Month, Income, Expense, Profit
                        const month = columns[0].trim();
                        const income = parseFloat(columns[1].trim().replace(/,/g, ''));
                        const expense = parseFloat(columns[2].trim().replace(/,/g, ''));
                        const profit = parseFloat(columns[3].trim().replace(/,/g, ''));

                        if (!isNaN(income) && !isNaN(expense) && !isNaN(profit)) {
                            records.push({ month, income, expense, profit });
                            addRecord(month, income, expense, profit);
                        }
                    }
                });

                updateTotals(); // Update the totals after file load
                toggleDownloadButton(); // Update download button state
            };

            reader.readAsText(file);
        } else {
            // Show error message if the file is not CSV
            showErrorMessage("Please upload a valid CSV file!");
        }
    });

    // Show error message
    function showErrorMessage(message) {
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("error");
        errorMessage.textContent = message;
        document.querySelector(".container").appendChild(errorMessage);
        errorMessage.style.display = "block";

        // Hide message after 3 seconds
        setTimeout(() => {
            errorMessage.style.display = "none";
        }, 3000);
    }

    // Show success message after a successful upload
    function showSuccessMessage(message) {
        const successMessage = document.createElement("div");
        successMessage.classList.add("success");
        successMessage.textContent = message;
        document.querySelector(".container").appendChild(successMessage);
        successMessage.style.display = "block";

        // Hide message after 3 seconds
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 3000);
    }

    // Clear all records
    clearAllBtn.addEventListener("click", function () {
        records = [];
        recordTable.innerHTML = "";
        updateTotals();
        toggleDownloadButton(); // Update download button state
        showSuccessMessage("All records cleared!");
    });

    // Initialize download button state
    toggleDownloadButton();
	// Check for theme preference on page load
window.addEventListener('DOMContentLoaded', (event) => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    }
});

// Toggle the theme
const toggleButton = document.createElement('button');
toggleButton.classList.add('theme-toggle');
toggleButton.textContent = '🌙 Light/Dark Mode';
document.body.appendChild(toggleButton);

toggleButton.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
});

});
