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

        totalIncomeElem.textContent = totalIncome.toFixed(2);
        totalExpenseElem.textContent = totalExpense.toFixed(2);
        totalProfitElem.textContent = totalProfit.toFixed(2);
    }

    // Function to add a new record to the table
    function addRecord(income, expense, profit) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${income}</td>
            <td>${expense}</td>
            <td>${profit}</td>
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

    // Handle form submission
    calculatorForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const income = parseFloat(document.getElementById("income").value);
        const expense = parseFloat(document.getElementById("expense").value);

        // Validate inputs
        if (isNaN(income) || isNaN(expense) || income <= 0 || expense <= 0) {
            alert("请输入有效的收入和支出数额！");
            return;
        }

        const profit = income - expense;
        records.push({ income, expense, profit });

        addRecord(income, expense, profit);
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

    // Download the records as CSV in English
    downloadBtn.addEventListener("click", function () {
        if (records.length === 0) {
            showErrorMessage("No records to download!");
            return;
        }

        let csvContent = "Income (RM), Expense (RM), Profit (RM)\n"; // English headers

        records.forEach(record => {
            csvContent += `${record.income}, ${record.expense}, ${record.profit}\n`;
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

            // Show a loading spinner or message while file is being processed
            showLoadingMessage("Processing file...");

            reader.onload = function (e) {
                const contents = e.target.result;
                const rows = contents.split("\n");

                // Clear previous records
                records = [];
                recordTable.innerHTML = "";  // Clear the table

                // Skip the header row
                rows.slice(1).forEach(row => {
                    const columns = row.split(",");
                    if (columns.length === 3) {
                        const income = parseFloat(columns[0].trim());
                        const expense = parseFloat(columns[1].trim());
                        const profit = parseFloat(columns[2].trim());

                        if (!isNaN(income) && !isNaN(expense) && !isNaN(profit)) {
                            records.push({ income, expense, profit });
                            addRecord(income, expense, profit);
                        }
                    }
                });

                updateTotals(); // Update the totals after file load
                toggleDownloadButton(); // Update download button state

                // Hide the loading message
                hideLoadingMessage();

                // Show success message after upload
                showSuccessMessage("Records successfully uploaded!");
            };

            reader.readAsText(file);
        } else {
            // Show error message if the file is not CSV
            showErrorMessage("Please upload a valid CSV file!");
        }
    });

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

    // Show loading message
    function showLoadingMessage(message) {
        const loadingMessage = document.createElement("div");
        loadingMessage.classList.add("loading");
        loadingMessage.textContent = message;
        document.querySelector(".container").appendChild(loadingMessage);
        loadingMessage.style.display = "block";
    }

    // Hide loading message
    function hideLoadingMessage() {
        const loadingMessage = document.querySelector(".loading");
        if (loadingMessage) {
            loadingMessage.style.display = "none";
        }
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
});
