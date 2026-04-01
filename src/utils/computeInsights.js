import { format, parseISO } from 'date-fns';

export function computeInsights(transactions) {
  if (!transactions || transactions.length === 0) {
    return {
      highestCategory: null,
      frequentCategory: null,
      bestSavingsMonth: null,
      worstSpendingMonth: null,
      categoryChartData: [],
      savingsTrendData: [],
      paymentMethodData: [],
      textInsights: [],
    };
  }

  // Categories spending
  const expenses = transactions.filter(t => t.type === 'expense');
  const categoryTotals = {};
  const categoryCounts = {};
  expenses.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + Number(t.amount);
    categoryCounts[t.category] = (categoryCounts[t.category] || 0) + 1;
  });

  const categoryChartData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const highestCategory = categoryChartData.length > 0 ? categoryChartData[0] : { name: '-', value: 0 };
  
  const frequentCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

  // Group by Month
  const monthlyData = {};
  transactions.forEach(t => {
    const month = format(parseISO(t.date), 'MMM yy');
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expense: 0, rawMonth: month };
    }
    if (t.type === 'income') {
      monthlyData[month].income += Number(t.amount);
    } else {
      monthlyData[month].expense += Number(t.amount);
    }
  });

  const savingsTrendData = Object.keys(monthlyData).map(m => {
    const d = monthlyData[m];
    return {
      month: m,
      savings: d.income - d.expense,
      income: d.income,
      expense: d.expense,
    };
  });

  // Find best savings month and worst spending month
  let bestSavings = -Infinity;
  let bestSavingsMonth = null;
  let worstSpending = -Infinity;
  let worstSpendingMonth = null;
  let highestIncomeMonthObj = null;

  savingsTrendData.forEach(d => {
    if (d.savings > bestSavings) {
      bestSavings = d.savings;
      bestSavingsMonth = d.month;
    }
    if (d.expense > worstSpending) {
      worstSpending = d.expense;
      worstSpendingMonth = d.month;
    }
    if (!highestIncomeMonthObj || d.income > highestIncomeMonthObj.income) {
      highestIncomeMonthObj = d;
    }
  });

  // Payment Methods
  const paymentMethodTotals = {};
  expenses.forEach(t => {
    paymentMethodTotals[t.paymentMethod] = (paymentMethodTotals[t.paymentMethod] || 0) + Number(t.amount);
  });

  const paymentMethodData = Object.entries(paymentMethodTotals).map(([name, value]) => ({ name, value }));

  // Generate text insights
  const textInsights = [];
  
  if (highestCategory.value > 0) {
    textInsights.push(`Your highest spending category is ${highestCategory.name}, totaling ₹${highestCategory.value.toLocaleString('en-IN')}.`);
  }

  if (highestIncomeMonthObj && highestIncomeMonthObj.income > 0) {
    textInsights.push(`Your highest income month was ${highestIncomeMonthObj.month} with ₹${highestIncomeMonthObj.income.toLocaleString('en-IN')}.`);
  }

  // Example dynamic calculation comparing last two months if we have enough data
  if (savingsTrendData.length >= 2) {
    const lastMonth = savingsTrendData[savingsTrendData.length - 1];
    const prevMonth = savingsTrendData[savingsTrendData.length - 2];
    
    if (lastMonth.expense > prevMonth.expense) {
      const diff = lastMonth.expense - prevMonth.expense;
      const pct = ((diff / prevMonth.expense) * 100).toFixed(1);
      textInsights.push(`You spent ${pct}% more in ${lastMonth.month} compared to ${prevMonth.month}.`);
    } else if (lastMonth.expense < prevMonth.expense) {
      const diff = prevMonth.expense - lastMonth.expense;
      const pct = ((diff / prevMonth.expense) * 100).toFixed(1);
      textInsights.push(`Great job! You spent ${pct}% less in ${lastMonth.month} compared to ${prevMonth.month}.`);
    }
  }

  return {
    highestCategory,
    frequentCategory: { name: frequentCategory[0], count: frequentCategory[1] },
    bestSavingsMonth: { month: bestSavingsMonth, savings: bestSavings },
    worstSpendingMonth: { month: worstSpendingMonth, expense: worstSpending },
    categoryChartData,
    savingsTrendData,
    paymentMethodData,
    textInsights,
  };
}
