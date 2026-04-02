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
      fixedCosts: 0,
      totalIncome: 0,
      fixedCostRatio: 0,
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

  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
    const [ma, ya] = a.split(' ');
    const [mb, yb] = b.split(' ');
    const dateA = new Date(`20${ya}`, ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(ma));
    const dateB = new Date(`20${yb}`, ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(mb));
    return dateA - dateB;
  });

  const savingsTrendData = sortedMonths.map(m => {
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
  let totalIncomeAll = 0;
  let totalExpenseAll = 0;

  savingsTrendData.forEach(d => {
    totalIncomeAll += d.income;
    totalExpenseAll += d.expense;
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

  const avgMonthlyIncome = totalIncomeAll / (savingsTrendData.length || 1);

  // Generate text insights
  const textInsights = [];
  
  if (highestCategory.value > 0) {
    const pct = ((highestCategory.value / totalExpenseAll) * 100).toFixed(1);
    textInsights.push({
      type: 'spending',
      text: `${highestCategory.name} takes up ${pct}% of your total expenses — your single biggest cost center`,
      severity: 'amber',
      icon: 'TrendingDown'
    });
  }

  if (highestIncomeMonthObj && highestIncomeMonthObj.income > 0) {
    const diffPct = avgMonthlyIncome > 0 ? (((highestIncomeMonthObj.income - avgMonthlyIncome) / avgMonthlyIncome) * 100).toFixed(0) : 100;
    const monthName = format(parseISO(transactions.find(t => format(parseISO(t.date), 'MMM yy') === highestIncomeMonthObj.month).date), 'MMMM');
    textInsights.push({
      type: 'income',
      text: `${monthName} was your strongest month — income was ${diffPct}% higher than your ${savingsTrendData.length}-month average`,
      severity: 'green',
      icon: 'TrendingUp'
    });
  }

  if (savingsTrendData.length >= 2) {
    const lastMonth = savingsTrendData[savingsTrendData.length - 1];
    const prevMonth = savingsTrendData[savingsTrendData.length - 2];
    const monthName = format(parseISO(transactions.find(t => format(parseISO(t.date), 'MMM yy') === lastMonth.month).date), 'MMMMM');
    const prevMonthName = format(parseISO(transactions.find(t => format(parseISO(t.date), 'MMM yy') === prevMonth.month).date), 'MMMMM');
    
    if (lastMonth.expense < prevMonth.expense) {
      const diff = prevMonth.expense - lastMonth.expense;
      const pct = ((diff / prevMonth.expense) * 100).toFixed(1);
      textInsights.push({
        type: 'control',
        text: `You spent ₹${diff.toLocaleString('en-IN')} less in ${monthName} vs ${prevMonthName} — that's ${pct}% lower. Your best spending control month.`,
        severity: 'green',
        icon: 'Activity'
      });
    }
  }

  // Rent to income ratio
  const totalRent = categoryTotals['Rent'] || 0;
  const rentRatio = totalIncomeAll > 0 ? (totalRent / totalIncomeAll) * 100 : 0;
  let rentMessage = '';
  let rentSeverity = 'green';
  if (rentRatio > 40) {
    rentMessage = `Your rent is ${rentRatio.toFixed(1)}% of total income — significantly above the recommended 30% threshold. Consider reviewing housing costs.`;
    rentSeverity = 'red';
  } else if (rentRatio >= 30) {
    rentMessage = `Your rent is ${rentRatio.toFixed(1)}% of income — slightly above the ideal 30%. You're managing well.`;
    rentSeverity = 'amber';
  } else {
    rentMessage = `Excellent! Rent is only ${rentRatio.toFixed(1)}% of income — well within healthy limits 🎉`;
    rentSeverity = 'green';
  }
  textInsights.push({ type: 'rent', text: rentMessage, severity: rentSeverity, icon: 'Home' });

  // Subscription creep
  const totalSub = categoryTotals['Subscriptions'] || 0;
  const avgSub = totalSub / (savingsTrendData.length || 1);
  const annualSub = avgSub * 12;
  textInsights.push({
    type: 'subscriptions',
    text: `Subscriptions cost you ₹${avgSub.toLocaleString('en-IN')}/month on average — that's ₹${annualSub.toLocaleString('en-IN')} annually. Review if all are being used.`,
    severity: avgSub > 2000 ? 'amber' : 'green',
    icon: 'CreditCard'
  });

  // Payment methods
  const paymentMethodTotals = {};
  expenses.forEach(t => {
    paymentMethodTotals[t.paymentMethod] = (paymentMethodTotals[t.paymentMethod] || 0) + Number(t.amount);
  });
  const paymentMethodData = Object.entries(paymentMethodTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return {
    highestCategory,
    frequentCategory: { name: frequentCategory[0], count: frequentCategory[1] },
    bestSavingsMonth: { month: bestSavingsMonth, savings: bestSavings },
    worstSpendingMonth: { month: worstSpendingMonth, expense: worstSpending },
    categoryChartData,
    savingsTrendData,
    paymentMethodData,
    textInsights,
    totalExpense: totalExpenseAll,
    fixedCosts: (categoryTotals['Rent'] || 0) + (categoryTotals['Utilities'] || 0),
    totalIncome: totalIncomeAll,
    fixedCostRatio: (totalIncomeAll > 0 ? (((categoryTotals['Rent'] || 0) + (categoryTotals['Utilities'] || 0)) / totalIncomeAll) * 100 : 0),
  };
}
