document.getElementById("calculatorForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // 获取用户输入的收入和支出
    const income = parseFloat(document.getElementById("income").value);
    const expense = parseFloat(document.getElementById("expense").value);

    // 检查输入是否有效
    if (isNaN(income) || isNaN(expense) || income <= 0 || expense < 0) {
        alert("请输入有效的收入和支出！");
        return;
    }

    // 计算利润
    const profit = income - expense;

    // 获取表格和总计元素
    const tableBody = document.querySelector("#recordTable tbody");
    const totalIncomeElement = document.getElementById("totalIncome");
    const totalExpenseElement = document.getElementById("totalExpense");
    const totalProfitElement = document.getElementById("totalProfit");

    // 创建一行新记录
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${income.toFixed(2)}</td>
        <td>${expense.toFixed(2)}</td>
        <td>${profit.toFixed(2)}</td>
        <td><button class="delete-btn">删除</button></td>
    `;
    tableBody.appendChild(row);

    // 给删除按钮绑定事件
    row.querySelector(".delete-btn").addEventListener("click", function() {
        row.remove();  // 删除当前行
        updateTotals(); // 更新总计
    });

    // 更新总计
    updateTotals();

    // 清空输入框
    document.getElementById("income").value = "";
    document.getElementById("expense").value = "";
});

// 更新总计
function updateTotals() {
    const rows = document.querySelectorAll("#recordTable tbody tr");
    let totalIncome = 0;
    let totalExpense = 0;
    let totalProfit = 0;

    rows.forEach(row => {
        const income = parseFloat(row.children[0].textContent);
        const expense = parseFloat(row.children[1].textContent);
        const profit = parseFloat(row.children[2].textContent);

        totalIncome += income;
        totalExpense += expense;
        totalProfit += profit;
    });

    // 显示总计
    document.getElementById("totalIncome").textContent = totalIncome.toFixed(2);
    document.getElementById("totalExpense").textContent = totalExpense.toFixed(2);
    document.getElementById("totalProfit").textContent = totalProfit.toFixed(2);
}
