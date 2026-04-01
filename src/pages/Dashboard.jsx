import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, PiggyBank, ArrowRight, Activity } from 'lucide-react';
import { format, parseISO } from 'date-fns';

import { useTransactionStore } from '../store/transactionStore';
import { formatCurrency } from '../utils/formatCurrency';
import { computeInsights } from '../utils/computeInsights';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#f43f5e', '#ec4899', '#14b8a6', '#6366f1'];

export function Dashboard() {
  const { transactions } = useTransactionStore();

  const {
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    recentTransactions,
    areaData,
    pieData,
    barData,
  } = useMemo(() => {
    let inc = 0, exp = 0;
    const recent = transactions.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
    
    transactions.forEach(t => {
      if (t.type === 'income') inc += Number(t.amount);
      else exp += Number(t.amount);
    });

    const val = inc - exp;
    const rate = inc > 0 ? ((val / inc) * 100).toFixed(1) : 0;

    const insights = computeInsights(transactions);

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
      savingsRate: rate,
      recentTransactions: recent,
      areaData: area,
      pieData: insights.categoryChartData.slice(0, 5), // Top 5 categories
      barData: insights.savingsTrendData,
    };
  }, [transactions]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Total Balance</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-2">
                {formatCurrency(balance)}
              </h3>
            </div>
            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <Wallet className="w-5 h-5 text-emerald-500" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-500 font-medium">Healthy</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Total Income</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-2">
                {formatCurrency(totalIncome)}
              </h3>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <ArrowUpRight className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Total Expenses</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-2">
                {formatCurrency(totalExpense)}
              </h3>
            </div>
            <div className="p-3 bg-rose-500/10 rounded-xl">
              <ArrowDownRight className="w-5 h-5 text-rose-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--text-muted)]">Savings Rate</p>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mt-2">
                {savingsRate}%
              </h3>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <PiggyBank className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="mt-4 w-full bg-[var(--border-color)] rounded-full h-2 overflow-hidden">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${Math.min(Math.max(savingsRate, 0), 100)}%` }}
            />
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1 lg:col-span-2">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-500" /> Balance Trend
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary-emerald)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-primary-emerald)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="balance" stroke="var(--color-primary-emerald)" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-semibold w-full text-left text-[var(--text-primary)] mb-4">Top Spending</h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--text-primary)' }}
                    formatter={(val) => formatCurrency(val)}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-[var(--text-muted)] text-sm">No expense data</p>
            )}
          </div>
          <div className="w-full mt-4 space-y-2">
            {pieData.slice(0, 3).map((d, i) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-[var(--text-primary)]">{d.name}</span>
                </div>
                <span className="font-medium text-[var(--text-muted)]">{formatCurrency(d.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3 - Bar Chart & Recent Trans */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Income vs Expense</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  cursor={{ fill: 'var(--bg-color)' }}
                />
                <Bar dataKey="income" fill="var(--color-primary-emerald)" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="var(--color-primary-rose)" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Recent Activity</h3>
            <Button variant="ghost" size="sm" as="a" href="/transactions" className="text-emerald-500 hover:text-emerald-600 gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-color)] transition-colors border border-transparent hover:border-[var(--border-color)]">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${tx.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                    {tx.type === 'income' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)] line-clamp-1">{tx.title}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{format(parseISO(tx.date), 'dd MMM yyyy')} • {tx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-semibold ${tx.type === 'income' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
                No recent transactions
              </div>
            )}
          </div>
        </Card>
      </div>

    </div>
  );
}
