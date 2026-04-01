import { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';
import { Lightbulb, TrendingDown, TrendingUp, CreditCard, Activity, ArrowRight, Wallet } from 'lucide-react';
import { useTransactionStore } from '../store/transactionStore';
import { computeInsights } from '../utils/computeInsights';
import { formatCurrency } from '../utils/formatCurrency';
import { Card } from '../components/ui/Card';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#f43f5e', '#ec4899', '#14b8a6', '#6366f1'];

export function Insights() {
  const { transactions } = useTransactionStore();

  const {
    highestCategory,
    frequentCategory,
    bestSavingsMonth,
    worstSpendingMonth,
    categoryChartData,
    savingsTrendData,
    paymentMethodData,
    textInsights,
  } = useMemo(() => computeInsights(transactions), [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] p-8">
        <Activity className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
        <p>Add some transactions to see your financial insights.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-[var(--text-muted)]">Highest Spend Area</p>
          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[var(--text-primary)] truncate max-w-[150px]">{highestCategory.name}</h3>
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-500"><TrendingDown className="w-5 h-5" /></div>
          </div>
          <p className="text-sm text-rose-500 font-medium mt-1">{formatCurrency(highestCategory.value)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-[var(--text-muted)]">Most Frequent Type</p>
          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[var(--text-primary)] truncate max-w-[150px]">{frequentCategory.name}</h3>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Activity className="w-5 h-5" /></div>
          </div>
          <p className="text-sm text-blue-500 font-medium mt-1">{frequentCategory.count} times</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-[var(--text-muted)]">Best Savings Month</p>
          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[var(--text-primary)] truncate">{bestSavingsMonth.month || '-'}</h3>
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <p className="text-sm text-emerald-500 font-medium mt-1">Saved {formatCurrency(bestSavingsMonth.savings)}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-medium text-[var(--text-muted)]">Highest Expense Month</p>
          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-[var(--text-primary)] truncate">{worstSpendingMonth.month || '-'}</h3>
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Wallet className="w-5 h-5" /></div>
          </div>
          <p className="text-sm text-amber-500 font-medium mt-1">Spent {formatCurrency(worstSpendingMonth.expense)}</p>
        </Card>
      </div>

      {/* Narrative AI Insights section */}
      {textInsights.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Lightbulb className="w-32 h-32" />
          </div>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-[var(--text-primary)] mb-6">
            <Lightbulb className="text-yellow-500 w-6 h-6" /> Smart Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {textInsights.map((insight, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                </div>
                <p className="text-[var(--text-primary)] leading-relaxed">
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Complex Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Savings Trend */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Savings Trend (6 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsTrendData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="savings" stroke="var(--color-primary-emerald)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-primary-emerald)' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Categories Bar */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-6">Top categories by spending</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={categoryChartData.slice(0, 5)} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border-color)" />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                <YAxis dataKey="name" type="category" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--bg-color)' }}
                  contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                  formatter={(val) => formatCurrency(val)}
                />
                <Bar dataKey="value" fill="var(--color-primary-blue)" radius={[0, 4, 4, 0]}>
                  {categoryChartData.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-[var(--text-primary)] mb-6">
            <CreditCard className="text-blue-500 w-5 h-5" /> Expenses By Payment Method
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-[250px] w-full">
            <div className="w-1/2 h-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentMethodData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--surface-color)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
                    formatter={(val) => formatCurrency(val)}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-4">
              {paymentMethodData.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[i] }} />
                    <span className="font-medium text-[var(--text-primary)]">{d.name}</span>
                  </div>
                  <span className="text-[var(--text-muted)]">{formatCurrency(d.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
        
      </div>
    </div>
  );
}
