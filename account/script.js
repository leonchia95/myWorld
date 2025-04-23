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

		// CSV Header
		let csvContent = "Month, Income (RM), Expense (RM), Profit (RM)\n"; // Proper header row

		records.forEach(record => {
			// Format the numbers without thousands separator
			const formattedIncome = record.income.toFixed(2);
			const formattedExpense = record.expense.toFixed(2);
			const formattedProfit = record.profit.toFixed(2);

			// Concatenate the row data
			csvContent += `${record.month}, ${formattedIncome}, ${formattedExpense}, ${formattedProfit}\n`;
		});

		// Create a Blob object with the CSV content
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

		// Create a link to trigger the download
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

				// Directly process rows without splitting them
				const rows = contents.split(/\r?\n/); // Use regex for compatibility across different OS (handles both \n and \r\n)

				// Clear previous records
				records = [];
				recordTable.innerHTML = "";  // Clear the table

				// Skip the header row
				rows.slice(1).forEach((row, index) => {
					if (row.trim() === '') return;  // Skip empty lines

					const columns = row.split(",").map(column => column.trim()); // Trim whitespace

					if (columns.length === 4) {  // Check for 4 columns
						const month = columns[0];
						const income = parseFloat(columns[1].replace(/,/g, ''));
						const expense = parseFloat(columns[2].replace(/,/g, ''));
						const profit = parseFloat(columns[3].replace(/,/g, ''));

						// Validate data
						if (!month || isNaN(income) || isNaN(expense) || isNaN(profit)) {
							showErrorMessage(`Row ${index + 1} contains invalid data. Skipping row.`);
							return;  // Skip this row if data is invalid
						}

						records.push({ month, income, expense, profit });
						addRecord(month, income, expense, profit);
					} else {
						showErrorMessage(`Row ${index + 1} does not have 4 columns. Skipping row.`);
					}
				});

				updateTotals(); // Update totals after file load
				toggleDownloadButton(); // Update download button state
				showSuccessMessage("File uploaded successfully!"); // Success message
			};

			reader.onerror = function () {
				showErrorMessage("There was an error reading the file. Please try again.");
			};

			reader.readAsText(file);
		} else {
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

    // Handle logout
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem('loggedIn');
        alert("成功登出!");
        window.location.href = 'login.html'; // Redirect to the login page
    });
	
    // Initialize download button state
    toggleDownloadButton();
});
