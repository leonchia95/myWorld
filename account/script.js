
document.getElementById("calculatorForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // 获取用户输入的值
    const income = parseFloat(document.getElementById("income").value);
    const expenses = parseFloat(document.getElementById("expenses").value);
    const taxRate = parseFloat(document.getElementById("taxRate").value);

    // 计算税前利润、税务、净利润
    const profit = income - expenses;
    const tax = profit * (taxRate / 100);
    const netProfit = profit - tax;

    // 更新页面上的结果
    document.getElementById("profit").textContent = profit.toFixed(2);
    document.getElementById("tax").textContent = tax.toFixed(2);
    document.getElementById("netProfit").textContent = netProfit.toFixed(2);
});
