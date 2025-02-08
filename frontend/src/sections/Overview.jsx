import React, { useEffect, useState, useContext, useRef } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import ReactECharts from "echarts-for-react";
import { AuthContext } from "../context/AuthContext";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../services/budgetService";
import { getTransactions } from "../services/transactionService";
import { getAccounts } from "../services/accountService";
import CreateTransactionModal from "../components/CreateTransactionModal";
import gsap from "gsap";
import { useTheme } from "../theme/ThemeProvider";
import { useNavigate } from "react-router-dom";

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

  // Chart view state: cycle between "Bar", "Daily", and "ECharts"
  const chartViews = ["Bar", "Daily", "ECharts"];
  const [chartViewIndex, setChartViewIndex] = useState(0);
  const toggleChartView = () => {
    setChartViewIndex((prev) => (prev + 1) % chartViews.length);
  };

  // Refs for GSAP animations
  const barChartRef = useRef(null);
  const chartContainerRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const budgetRef = useRef(null);
  const transactionListRef = useRef(null);
  const cardRefs = useRef([]);

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
  // Initialize an array of zeros for each day in the current month
  const dailyExpenses = Array(daysInMonth).fill(0);
  transactions.forEach((tx) => {
    if (tx.type === "EXPENSE") {
      const txDate = new Date(tx.date);
      if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
        const day = txDate.getDate(); // day of month (1-indexed)
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
          [
            "#14b8a6",
            "#10b981",
            "#22c55e",
            "#2dd4bf",
            "#6366f1",
            "#f97316",
          ][i % 6]
        ),
      },
    ],
  };

  // ========= ECharts Pie Chart Data ============
  const echartsData = Object.keys(categoryTotals).map((cat, i) => ({
    name: cat,
    value: parseFloat(categoryTotals[cat].toFixed(2)),
    itemStyle: {
      color: [
        "#14b8a6",
        "#10b981",
        "#22c55e",
        "#2dd4bf",
        "#6366f1",
        "#f97316",
      ][i % 6],
    },
  }));
  const echartsOptions = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: ${c} ({d}%)",
    },
    series: [
      {
        name: "Expenses",
        type: "pie",
        radius: "50%",
        data: echartsData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  // ========= DOUGHNUT CHART DATA (ACCOUNT BALANCES) ============
  const doughnutData = {
    labels: accounts.map((acc) => acc.name),
    datasets: [
      {
        label: "Balances",
        data: accounts.map((acc) => parseFloat(acc.balance).toFixed(2)),
        backgroundColor: accounts.map((_, i) =>
          [
            "#14b8a6",
            "#10b981",
            "#22c55e",
            "#2dd4bf",
            "#6366f1",
            "#f97316",
          ][i % 6]
        ),
      },
    ],
  };

  // ========= GSAP ANIMATIONS ============
  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });
      tl.fromTo(
        chartContainerRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0 }
      )
        .fromTo(
          doughnutChartRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0 },
          "-=0.7"
        )
        .fromTo(
          budgetRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0 },
          "-=0.7"
        )
        .fromTo(
          transactionListRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0 },
          "-=0.7"
        );
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

  // ========= Define filteredTransactions ============
  // For now, if no search is implemented, we'll simply use all transactions.
  const filteredTransactions = transactions;

  return (
    <div
      className={`p-4 md:p-8 min-h-screen flex flex-col transition-colors
        ${theme === "light"
          ? "bg-gradient-to-br from-slate-50 to-white text-slate-800"
          : "bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100"
        }`}
    >
      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-emerald-500">
        Overview Dashboard
      </h1>

      {/* Advise user to add an account if none exist */}
      {!loading && accounts.length === 0 && (
        <div className="max-w-3xl mx-auto mb-8 p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg shadow-md text-center">
          <p>
            It looks like you haven't added any accounts yet. Please visit the{" "}
            <span
              className="text-teal-500 underline cursor-pointer"
              onClick={() => navigate("/accounts")}
            >
              Accounts
            </span>{" "}
            section to create your first account. Once added, you'll be able to track transactions,
            set budgets, and view insightful charts on your spending.
          </p>
        </div>
      )}

      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center mb-8 gap-6 justify-center">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Account Selection */}
          <div className="bg-slate-50 dark:bg-gray-800 shadow-md rounded-lg p-4">
            <label className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Select an Account
            </label>
            <select
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
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
            className="w-40 h-40 bg-slate-50 dark:bg-gray-800 shadow-md rounded-lg p-4 flex justify-center items-center"
          >
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Create Transaction Button */}
        <div>
          <CreateTransactionModal
            accounts={accounts}
            onSuccess={fetchData}
            className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
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
            <div ref={budgetRef} className="bg-slate-50 dark:bg-gray-800 shadow-md rounded-lg p-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
                Monthly Budget Tracker
              </h2>
              {budget ? (
                <>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Budget:</span>{" "}
                    <span className="text-teal-600 dark:text-teal-400">${budget.amount}</span>
                  </p>
                  <p className="mb-2 text-gray-700 dark:text-gray-300">
                    <span className="font-semibold">Spent (This Month):</span>{" "}
                    <span className="text-red-500">${monthlyExpense.toFixed(2)}</span>
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
                      className="w-24 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="New amt"
                      aria-label="New Budget Amount"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                      aria-label="Update Budget"
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={handleBudgetDelete}
                      className="px-4 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
                      aria-label="Delete Budget"
                    >
                      Delete
                    </button>
                  </form>
                </>
              ) : (
                <form onSubmit={handleBudgetCreate} className="space-y-3">
                  <p className="text-gray-600 dark:text-gray-300">
                    No budget set yet. Create one below:
                  </p>
                  <div className="flex flex-wrap gap-3 items-center">
                    <input
                      type="number"
                      className="w-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 bg-slate-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-100"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="Budget amt"
                      required
                      aria-label="Budget Amount"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 transition duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                      aria-label="Create Budget"
                    >
                      Create Budget
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Chart Card with Toggle Arrow */}
            <div ref={chartContainerRef} className="bg-slate-50 dark:bg-gray-800 shadow-md rounded-lg p-8 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Expenses Chart - {chartViews[chartViewIndex]}
                </h2>
                <button
                  onClick={toggleChartView}
                  className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transform transition-transform duration-300 hover:rotate-90 shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  aria-label="Toggle Chart View"
                >
                  →
                </button>
              </div>
              {/* Chart container with fixed height so every chart is consistent */}
              <div ref={barChartRef} className="h-[350px] w-full">
                {chartViews[chartViewIndex] === "Bar" && (
                  <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
                )}
                {chartViews[chartViewIndex] === "Daily" && (
                  <Line data={dailyData} options={{ responsive: true, maintainAspectRatio: false }} />
                )}
                {chartViews[chartViewIndex] === "ECharts" && (
                  <ReactECharts option={echartsOptions} style={{ height: 350, width: "100%" }} />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Transaction List) */}
          <div ref={transactionListRef} className="bg-slate-50 dark:bg-gray-800 shadow-md rounded-lg p-8 overflow-y-auto max-h-[600px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              All Transactions
            </h2>
            <div className="space-y-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-sm transform hover:scale-105 transition-transform duration-200"
                  >
                    <div className="w-full">
                      <p className="font-semibold text-gray-800 dark:text-gray-200">
                        {tx.type} - ${parseFloat(tx.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                        {new Date(tx.date).toLocaleDateString()} | {tx.category} | {tx.description}
                      </p>
                    </div>
                    <button
                      className="mt-2 md:mt-0 text-red-500 hover:text-red-600 font-bold transition-colors"
                      onClick={() => handleDelete(tx.id)}
                      aria-label="Delete Transaction"
                    >
                      Delete
                    </button>
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
