import React, { useEffect, useState, useContext, useRef } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ReactECharts from "echarts-for-react";
import { AuthContext } from "../context/AuthContext";
import { getBudgets, createBudget, updateBudget, deleteBudget } from "../services/budgetService";
import { getTransactions, deleteTransaction } from "../services/transactionService";
import { getAccounts } from "../services/accountService";
import CreateTransactionModal from "../components/CreateTransactionModal";
import gsap from "gsap";
import { useTheme } from "../theme/ThemeProvider";
import { useNavigate } from "react-router-dom";
import ChartSwitcher from "../components/ChartSwitcher"; // Import the new component

Chart.register(...registerables);

const Overview = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Data states
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Budget form state
  const [budgetAmount, setBudgetAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Chart view state: use string values "Bar", "Daily", "Pie"
  const [chartView, setChartView] = useState("Bar");

  // Refs for GSAP animations
  const barChartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const budgetRef = useRef(null);
  const transactionListRef = useRef(null);
  const cardRefs = useRef([]);

  // Common Chart Options for Chart.js charts
  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme === "light" ? "#0f172a" : "#f8fafc",
          font: { family: "Inter, sans-serif", size: 14 },
        },
      },
      tooltip: {
        backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
        titleColor: theme === "light" ? "#0f172a" : "#f8fafc",
        bodyColor: theme === "light" ? "#475569" : "#cbd5e1",
        borderColor: theme === "light" ? "#e2e8f0" : "#334155",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    },
    scales: {
      x: {
        grid: { color: theme === "light" ? "#e2e8f0" : "#334155" },
        ticks: { color: theme === "light" ? "#64748b" : "#94a3b8" },
      },
      y: {
        grid: { color: theme === "light" ? "#e2e8f0" : "#334155" },
        ticks: { color: theme === "light" ? "#64748b" : "#94a3b8" },
      },
    },
  });

  // ========= FETCH DATA ============
  const fetchData = async () => {
    setLoading(true);
    try {
      const [txRes, accRes, budRes] = await Promise.all([
        getTransactions(token),
        getAccounts(token),
        getBudgets(token),
      ]);
      setTransactions(txRes || []);
      setAccounts(accRes || []);
      setBudgets(budRes || []);
      setSelectedAccount(accRes[0]?.id || null);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err.message);
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // ========= DAILY EXPENSES CHART ============
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const dailyExpenses = Array(daysInMonth).fill(0);
  transactions.forEach((tx) => {
    if (tx.type === "EXPENSE") {
      const txDate = new Date(tx.date);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        const day = txDate.getDate();
        dailyExpenses[day - 1] += parseFloat(tx.amount);
      }
    }
  });
  const dailyLabels = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const dailyData = {
    labels: dailyLabels,
    datasets: [
      {
        label: "Daily Expenses",
        data: dailyExpenses.map((val) => parseFloat(val.toFixed(2))),
        borderColor: "#f97316",
        backgroundColor: "#f97316",
        fill: false,
      },
    ],
  };

  // ========= EXPENSES BY CATEGORY (Bar Chart) ============
  const expenseTransactions = transactions.filter((tx) => tx.type === "EXPENSE");
  const categoryTotals = expenseTransactions.reduce((acc, tx) => {
    const cat = tx.category ? tx.category.trim() : "Unknown";
    const amt = parseFloat(tx.amount);
    acc[cat] = (acc[cat] || 0) + amt;
    return acc;
  }, {});
  const barData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals).map((val) => parseFloat(val.toFixed(2))),
        backgroundColor: Object.keys(categoryTotals).map((_, i) =>
          ["#14b8a6", "#10b981", "#22c55e", "#2dd4bf", "#6366f1", "#f97316"][i % 6]
        ),
      },
    ],
  };

  // ========= ECharts Pie Chart Data ============
  const echartsData = Object.keys(categoryTotals).map((cat, i) => ({
    name: cat,
    value: parseFloat(categoryTotals[cat].toFixed(2)),
    itemStyle: {
      color: ["#14b8a6", "#10b981", "#22c55e", "#2dd4bf", "#6366f1", "#f97316"][i % 6],
    },
  }));
  const echartsOptions = {
    tooltip: { trigger: "item", formatter: "{b}: ${c} ({d}%)" },
    series: [
      {
        name: "Expenses",
        type: "pie",
        radius: "50%",
        data: echartsData,
        emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: "rgba(0,0,0,0.5)" } },
      },
    ],
  };

  // ========= DOUGHNUT CHART DATA (Account Balances) ============
  const doughnutData = {
    labels: accounts.map((acc) => acc.name),
    datasets: [
      {
        label: "Balances",
        data: accounts.map((acc) => parseFloat(acc.balance).toFixed(2)),
        backgroundColor: accounts.map((_, i) =>
          ["#14b8a6", "#10b981", "#22c55e", "#2dd4bf", "#6366f1", "#f97316"][i % 6]
        ),
      },
    ],
  };

  // ========= GSAP ANIMATIONS ============
  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });
      tl.fromTo(chartContainerRef.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0 })
        .fromTo(doughnutChartRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, "-=0.7")
        .fromTo(budgetRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, "-=0.7")
        .fromTo(transactionListRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, "-=0.7");
      if (cardRefs.current.length) {
        gsap.fromTo(
          cardRefs.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }
        );
      }
    }
  }, [loading, accounts]);

  // ========= BUDGET LOGIC ============
  const budget = budgets[0] || null;
  const monthlyExpense = expenseTransactions
    .filter(
      (tx) =>
        tx.type === "EXPENSE" &&
        new Date(tx.date).getMonth() === currentMonth &&
        new Date(tx.date).getFullYear() === currentYear
    )
    .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);
  const spentPercentage = budget ? (monthlyExpense / budget.amount) * 100 : 0;
  const getProgressColor = () => {
    if (spentPercentage < 50) return "bg-green-500";
    if (spentPercentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  // ========= BUDGET HANDLERS ============
  const handleBudgetCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!budgetAmount || isNaN(budgetAmount) || parseFloat(budgetAmount) <= 0) {
      setError("Invalid budget amount.");
      return;
    }
    try {
      const newBudget = await createBudget(token, { amount: parseFloat(budgetAmount) });
      setBudgets([newBudget]);
      setBudgetAmount("");
    } catch (err) {
      console.error("Error creating budget:", err.message);
      setError("Failed to create budget. Try again.");
    }
  };

  const handleBudgetUpdate = async (e) => {
    e.preventDefault();
    setError("");
    if (!budgetAmount || isNaN(budgetAmount) || parseFloat(budgetAmount) <= 0) {
      setError("Invalid budget amount.");
      return;
    }
    try {
      const updated = await updateBudget(token, budget.id, { amount: parseFloat(budgetAmount) });
      setBudgets([updated]);
      setBudgetAmount("");
    } catch (err) {
      console.error("Error updating budget:", err.message);
      setError("Failed to update budget. Try again.");
    }
  };

  const handleBudgetDelete = async () => {
    setError("");
    try {
      await deleteBudget(token, budget.id);
      setBudgets([]);
      setBudgetAmount("");
    } catch (err) {
      console.error("Error deleting budget:", err.message);
      setError("Failed to delete budget. Try again.");
    }
  };

  // ========= TRANSACTION DELETE HANDLER ============
  const handleDelete = async (id) => {
    try {
      await deleteTransaction(token, id);
      fetchData();
    } catch (err) {
      console.error("Error deleting transaction:", err.message);
      setError("Failed to delete transaction.");
    }
  };

  // No filtering; using all transactions.
  const filteredTransactions = transactions;

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900"
          : "bg-gradient-to-br from-gray-900 to-blue-900 text-gray-100"
      }`}
    >
      {/* Main header using same gradient as other pages */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600">
        Overview Dashboard
      </h1>

      {error && <div className="mb-4 text-center text-red-500">{error}</div>}

      {/* Advisory Message if no accounts exist */}
      {!loading && accounts.length === 0 && (
        <div className="max-w-3xl mx-auto mb-8 p-4 glass-container text-center">
          <p>
            It looks like you haven't added any accounts yet. Please visit the{" "}
            <span className="text-indigo-600 underline cursor-pointer" onClick={() => navigate("/accounts")}>
              Accounts
            </span>{" "}
            section to create your first account. Once added, you'll be able to track transactions,
            set budgets, and view insightful charts on your spending.
          </p>
        </div>
      )}

      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center mb-8 gap-6 justify-center">
        {/* Account Selection */}
        <div className="glass-container p-4 rounded-2xl shadow-2xl">
          <label className="block mb-2 font-semibold text-gray-900 dark:text-gray-100">
            Select an Account
          </label>
          <select
            className="glass-input"
            value={selectedAccount || ""}
            onChange={(e) => setSelectedAccount(e.target.value)}
            aria-label="Select Account"
          >
            <option value="" disabled>
              Select an Account
            </option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} - ${parseFloat(acc.balance).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        {/* Doughnut Chart for Account Balances */}
        <div
          ref={doughnutChartRef}
          className="w-40 h-40 glass-container rounded-2xl p-4 shadow-2xl flex justify-center items-center"
        >
          <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>

        {/* Create Transaction Button */}
        <div>
          <CreateTransactionModal
            accounts={accounts}
            onSuccess={fetchData}
            className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN (Charts & Budget Tracker) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Budget Tracker Card */}
            <div ref={budgetRef} className="glass-container rounded-2xl p-8 shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">Monthly Budget Tracker</h2>
              {budget ? (
                <>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Budget:</span>{" "}
                    <span className="text-blue-600">{`$${budget.amount}`}</span>
                  </p>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Spent (This Month):</span>{" "}
                    <span className="text-red-500">{`$${monthlyExpense.toFixed(2)}`}</span>
                  </p>
                  {/* Progress Bar */}
                  <div className="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full ${getProgressColor()}`}
                      style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                    />
                  </div>
                  {/* Update / Delete Budget Forms */}
                  <form onSubmit={handleBudgetUpdate} className="mt-4 flex flex-wrap gap-3">
                    <input
                      type="number"
                      className="glass-input w-24"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="New amt"
                      aria-label="New Budget Amount"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Update Budget"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={handleBudgetDelete}
                      className="px-4 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label="Delete Budget"
                    >
                      Delete
                    </button>
                  </form>
                </>
              ) : (
                <form onSubmit={handleBudgetCreate} className="space-y-3">
                  <p className="text-gray-700 dark:text-gray-300">
                    No budget set yet. Create one below:
                  </p>
                  <div className="flex flex-wrap gap-3 items-center">
                    <input
                      type="number"
                      className="glass-input w-32"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="Budget amt"
                      required
                      aria-label="Budget Amount"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Create Budget"
                    >
                      Create Budget
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Chart Card with ChartSwitcher */}
            <div ref={chartContainerRef} className="glass-container rounded-2xl p-8 shadow-2xl relative">
              <ChartSwitcher
                chartView={chartView}
                onChange={setChartView}
                barData={barData}
                dailyData={dailyData}
                echartsOptions={echartsOptions}
                getChartOptions={getChartOptions}
              />
            </div>
          </div>

          {/* RIGHT COLUMN (Transaction List) */}
          <div ref={transactionListRef} className="glass-container rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[600px]">
            <h2 className="text-xl font-bold mb-4 text-cyan-400">All Transactions</h2>
            <div className="space-y-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, idx) => (
                  <div
                    key={tx.id}
                    ref={(el) => (cardRefs.current[idx] = el)}
                    className="glass-container p-4 rounded-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                      <span className="font-semibold text-lg text-cyan-400">
                        {tx.type} - <span className="text-indigo-600">${parseFloat(tx.amount).toFixed(2)}</span>
                      </span>
                      <button
                        className="mt-2 sm:mt-0 text-red-500 hover:text-red-600 font-bold transition-colors"
                        onClick={() => handleDelete(tx.id)}
                        aria-label="Delete Transaction"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                      {new Date(tx.date).toLocaleDateString()} | {tx.category} | {tx.description}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No transactions found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
