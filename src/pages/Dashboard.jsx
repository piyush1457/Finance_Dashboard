import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, TrendingDown, PiggyBank, ArrowRight, Activity, Moon, Sun, Sunrise, Sunset, Coffee, Cloud } from 'lucide-react';
import { format, parseISO, startOfMonth, subMonths, isSameMonth } from 'date-fns';

import { useTransactionStore } from '../store/transactionStore';
import { useFilterStore } from '../store/filterStore';
import { formatCurrency } from '../utils/formatCurrency';
import { computeInsights } from '../utils/computeInsights';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Skeleton';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#f43f5e', '#ec4899', '#14b8a6', '#6366f1'];
const USER_NAME = 'Piyush';

function useCountUp(end, duration = 1000, shouldAnimate = true) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!shouldAnimate) {
      setCount(end);
      return;
    }
    
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration, shouldAnimate]);
  
  return count;
}

export function Dashboard() {
  const { transactions } = useTransactionStore();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const setFilter = useFilterStore(state => state.setFilter);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const {
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    recentTransactions,
    areaData,
    pieData,
    barData,
    momMetrics,
    currentMonthName,
    currentMonthSavings,
    allTotalExpense,
  } = useMemo(() => {
    let inc = 0, exp = 0;
    const recent = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    transactions.forEach(t => {
      if (t.type === 'income') inc += Number(t.amount);
      else exp += Number(t.amount);
    });

    const val = inc - exp;
    const rate = inc > 0 ? ((val / inc) * 100).toFixed(1) : 0;

    const insights = computeInsights(transactions);

    // MoM Metrics Calculation
    const sortedDates = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestTxDate = sortedDates.length > 0 ? parseISO(sortedDates[0].date) : new Date();
    const currMonthStart = startOfMonth(latestTxDate);
    const prevMonthStart = subMonths(currMonthStart, 1);

    const getMetricsForMonth = (monthStart) => {
      let mInc = 0, mExp = 0;
      transactions.forEach(t => {
        if (isSameMonth(parseISO(t.date), monthStart)) {
          if (t.type === 'income') mInc += Number(t.amount);
          else mExp += Number(t.amount);
        }
      });
      const mBal = mInc - mExp;
      const mRate = mInc > 0 ? (mBal / mInc) * 100 : 0;
      return { income: mInc, expense: mExp, balance: mBal, rate: mRate };
    };

    const currMetrics = getMetricsForMonth(currMonthStart);
    const prevMetrics = getMetricsForMonth(prevMonthStart);

    const calcChange = (curr, prev) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / Math.abs(prev)) * 100;
    };

    const mom = {
      income: { val: currMetrics.income, change: calcChange(currMetrics.income, prevMetrics.income) },
      expense: { val: currMetrics.expense, change: calcChange(currMetrics.expense, prevMetrics.expense) },
      balance: { val: currMetrics.balance, change: calcChange(currMetrics.balance, prevMetrics.balance) },
      rate: { val: currMetrics.rate, change: calcChange(currMetrics.rate, prevMetrics.rate) },
    };

    // Prepare Area Chart (Balance over time by month)
    let cumulative = 0;
    const sortedForArea = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    const monthlyCumul = {};
    
    sortedForArea.forEach(t => {
      const m = format(parseISO(t.date), 'MMM');
      if (t.type === 'income') cumulative += Number(t.amount);
      else cumulative -= Number(t.amount);
      monthlyCumul[m] = cumulative;
    });

    const area = Object.keys(monthlyCumul).map(m => ({ month: m, balance: monthlyCumul[m] }));

    return {
      totalIncome: inc,
      totalExpense: exp,
      balance: val,
      savingsRate: Number(rate),
      recentTransactions: recent,
      areaData: area,
      pieData: insights.categoryChartData.slice(0, 5),
      barData: insights.savingsTrendData,
      momMetrics: mom,
      currentMonthName: format(currMonthStart, 'MMM yyyy'),
      currentMonthSavings: currMetrics.balance,
      allTotalExpense: insights.totalExpense,
    };
  }, [transactions, computeInsights, startOfMonth, subMonths, isSameMonth, parseISO, format]);

  const handleCategoryClick = (data) => {
    if (data && data.name) {
      setFilter('selectedCategory', data.name);
      navigate('/transactions');
    }
  };

  const hour = new Date().getHours();
  let greeting = 'Good morning';
  let greetingIcon = <Coffee className="w-8 h-8 text-amber-500" />;
  
  if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    greetingIcon = <Sun className="w-8 h-8 text-yellow-500" />;
  } else if (hour >= 17 && hour < 21) {
    greeting = 'Good evening';
    greetingIcon = <Cloud className="w-8 h-8 text-blue-400" />;
  } else if (hour >= 21 || hour < 5) {
    greeting = 'Good night';
    greetingIcon = <Moon className="w-8 h-8 text-purple-400" />;
  }

  const displayBalance = useCountUp(balance, 1000, !isLoading);
  const displayIncome = useCountUp(totalIncome, 1000, !isLoading);
  const displayExpense = useCountUp(totalExpense, 1000, !isLoading);
  const displaySavingsRate = useCountUp(savingsRate, 1000, !isLoading);

  return (
    <div className="space-y-6">
      {/* Personalized Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[var(--surface-color)] rounded-2xl shadow-sm border border-[var(--border-color)]">
            {greetingIcon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              {greeting}, <span className="text-emerald-500">{USER_NAME}</span> 👋
            </h1>
            <p className="text-[var(--text-muted)] mt-1 font-medium">Here's what's happening with your money today.</p>
          </div>
        </div>

        <div className="flex-1 lg:max-w-md">
          {!isLoading && (
            <Card className="px-5 py-4 bg-[var(--surface-color)] border-l-4 border-emerald-500 shadow-sm relative overflow-hidden group btn-hover-scale cursor-default">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <Activity className="w-20 h-20" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">Monthly Status</p>
              {currentMonthSavings >= 0 ? (
                <p className="text-[var(--text-primary)] font-medium text-sm leading-snug">
                  You saved <span className="font-bold text-emerald-500">{formatCurrency(currentMonthSavings)}</span> in {currentMonthName} 🎉 
                  <span className="block text-xs text-[var(--text-muted)] mt-1 font-normal italic">That's your best month this quarter!</span>
                </p>
              ) : (
                <p className="text-[var(--text-primary)] font-medium text-sm leading-snug">
                  You overspent by <span className="font-bold text-rose-500">{formatCurrency(Math.abs(currentMonthSavings))}</span> in {currentMonthName}.
                  <span className="block text-xs text-[var(--text-muted)] mt-1 font-normal italic">Let's review your spending 📊</span>
                </p>
              )}
            </Card>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Card key={i} className="p-6 space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="w-12 h-12 rounded-xl" />
              </div>
              <Skeleton className="h-4 w-20" />
            </Card>
          ))
        ) : (
          <>
            {/* Total Balance - Hero Card */}
            <Card className="p-6 border-l-accent border-l-blue-500 bg-gradient-to-br from-blue-500/[0.08] to-blue-500/[0.02] card-premium">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)]">Total Balance</p>
                  <h3 className="text-4xl font-black text-[var(--text-primary)] mt-2 tracking-tight">
                    {formatCurrency(displayBalance)}
                  </h3>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl">
                  <Wallet className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold">
                {momMetrics.balance.change >= 0 ? (
                  <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <TrendingUp className="w-3.5 h-3.5" /> ▲ {Math.abs(momMetrics.balance.change).toFixed(1)}%
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full">
                    <TrendingDown className="w-3.5 h-3.5" /> ▼ {Math.abs(momMetrics.balance.change).toFixed(1)}%
                  </div>
                )}
                <span className="text-[var(--text-muted)] ml-1 text-xs font-normal opacity-70">vs last month</span>
              </div>
            </Card>

            {/* Total Income */}
            <Card className="p-6 border-l-accent border-l-emerald-500 card-premium">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)]">Total Income</p>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-2">
                    {formatCurrency(displayIncome)}
                  </h3>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <ArrowUpRight className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold">
                {momMetrics.income.change >= 0 ? (
                  <div className="flex items-center gap-1 text-emerald-500">
                    <TrendingUp className="w-3.5 h-3.5" /> ▲ {Math.abs(momMetrics.income.change).toFixed(1)}%
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-rose-500">
                    <TrendingDown className="w-3.5 h-3.5" /> ▼ {Math.abs(momMetrics.income.change).toFixed(1)}%
                  </div>
                )}
                <span className="text-[var(--text-muted)] ml-1 text-xs font-normal">vs last month</span>
              </div>
            </Card>

            {/* Total Expenses */}
            <Card className="p-6 border-l-accent border-l-rose-500 card-premium">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)]">Total Expenses</p>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-2">
                    {formatCurrency(displayExpense)}
                  </h3>
                </div>
                <div className="p-3 bg-rose-500/10 rounded-xl">
                  <ArrowDownRight className="w-5 h-5 text-rose-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold">
                {momMetrics.expense.change <= 0 ? (
                  <div className="flex items-center gap-1 text-emerald-500">
                    <TrendingUp className="w-3.5 h-3.5" /> ▲ {Math.abs(momMetrics.expense.change).toFixed(1)}%
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-rose-500">
                    <TrendingDown className="w-3.5 h-3.5" /> ▼ {Math.abs(momMetrics.expense.change).toFixed(1)}%
                  </div>
                )}
                <span className="text-[var(--text-muted)] ml-1 text-xs font-normal">vs last month</span>
              </div>
            </Card>

            {/* Savings Rate */}
            <Card className="p-6 border-l-accent border-l-purple-500 card-premium">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-[var(--text-muted)]">Savings Rate</p>
                  <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-2">
                    {displaySavingsRate}%
                  </h3>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <PiggyBank className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <div className="mt-5 w-full bg-[var(--border-color)] rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                  style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
                />
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1 lg:col-span-2 card-premium">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Activity className="w-6 h-6 text-blue-500" /> Balance Trend
            </h3>
            <p className="text-sm text-[var(--text-muted)] mt-1 ml-8">Your net worth growth over time</p>
          </div>
          <div className="h-[300px] w-full">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                  />
                  <Area isAnimationActive={true} animationDuration={800} type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-6 flex flex-col items-center relative overflow-hidden card-premium">
          <div className="flex items-center justify-between w-full mb-4">
             <h3 className="text-lg font-semibold text-[var(--text-primary)]">Top Spending</h3>
             <span className="text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-widest bg-[var(--bg-color)] px-2 py-1 rounded-md border border-[var(--border-color)]">Interactive</span>
          </div>
          
          <div className="h-[250px] w-full flex items-center justify-center relative">
            {isLoading ? (
              <Skeleton className="w-40 h-40 rounded-full" />
            ) : pieData.length > 0 ? (
              <>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none z-10">
                  <span className="text-2xl font-black text-[var(--text-primary)]">{formatCurrency(allTotalExpense)}</span>
                  <span className="text-[var(--text-muted)] text-[10px] uppercase font-bold tracking-widest">Total Spent</span>
                </div>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={pieData} 
                      innerRadius={70} 
                      outerRadius={90} 
                      paddingAngle={5} 
                      dataKey="value"
                      isAnimationActive={true}
                      animationDuration={800}
                      onClick={handleCategoryClick}
                      className="cursor-pointer"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" className="hover:opacity-80 transition-opacity outline-none" />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '12px' }}
                      itemStyle={{ color: 'var(--text-primary)' }}
                      formatter={(val) => [formatCurrency(val), 'Spent']}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      onClick={(e) => handleCategoryClick({ name: e.value })}
                      wrapperStyle={{ cursor: 'pointer', paddingTop: '20px' }}
                      formatter={(value) => <span className="text-[var(--text-muted)] text-xs hover:text-[var(--text-primary)] transition-colors">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </>
            ) : (
              <p className="text-[var(--text-muted)] text-sm">No expense data</p>
            )}
          </div>
          <p className="mt-2 text-[10px] text-[var(--text-muted)] flex items-center gap-1">
            <Activity className="w-3 h-3" /> Click segment to view details
          </p>
        </Card>
      </div>

      {/* Row 3 - Bar Chart & Recent Trans */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 card-premium">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Income vs Expense</h3>
          <div className="h-[300px] w-full">
            {isLoading ? (
              <Skeleton className="w-full h-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '12px' }}
                    cursor={{ fill: 'var(--bg-color)' }}
                  />
                  <Bar isAnimationActive={true} animationDuration={800} dataKey="income" fill="var(--color-primary-emerald)" radius={[4, 4, 0, 0]} name="Income" />
                  <Bar isAnimationActive={true} animationDuration={800} dataKey="expense" fill="var(--color-primary-rose)" radius={[4, 4, 0, 0]} name="Expense" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="p-6 flex flex-col card-premium">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/transactions')}
              className="text-emerald-500 hover:text-emerald-600 gap-1 btn-hover-scale"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-4 w-full">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))
            ) : (
              recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-color)] transition-all border border-transparent hover:border-[var(--border-color)] group hover:translate-x-1">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                      {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[var(--text-primary)] line-clamp-1">{tx.title}</h4>
                      <p className="text-xs text-[var(--text-muted)] font-medium">
                        {format(parseISO(tx.date), 'dd MMM yyyy')} <span className="opacity-30 mx-1">•</span> {tx.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </p>
                  </div>
                </div>
              ))
            )}
            {!isLoading && recentTransactions.length === 0 && (
              <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm italic">
                No recent transactions found
              </div>
            )}
          </div>
        </Card>
      </div>

    </div>
  );
}
