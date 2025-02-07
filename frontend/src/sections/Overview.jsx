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

Chart.register(...registerables);

const Overview = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useTheme();

  // Data states
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Budget form state
  const [budgetAmount, setBudgetAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Chart view state: cycle between "Bar", "Line", and "ECharts"
  const chartViews = ["Bar", "Line", "ECharts"];
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

  // =========== FETCH DATA ============
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

  // GSAP animations after data load
  useEffect(() => {
    if (!loading) {
      const tl = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });
      tl.fromTo(barChartRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 })
        .fromTo(
          doughnutChartRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0 },
          "-=0.7"
        )
        .fromTo(budgetRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0 }, "-=0.7")
        .fromTo(
          transactionListRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0 },
          "-=0.7"
        );
    }
  }, [loading]);

  // =========== BUDGET LOGIC ============
  const budget = budgets[0] || null; // assume one budget
  const currentMonth = new Date().getMonth();
  // Calculate total monthly expense
  const monthlyExpense = transactions
    .filter(
      (tx) =>
        tx.type === "EXPENSE" &&
        new Date(tx.date).getMonth() === currentMonth
    )
    .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);
  const spentPercentage = budget ? (monthlyExpense / budget.amount) * 100 : 0;

  const getProgressColor = () => {
    if (spentPercentage < 50) return "bg-green-500";
    if (spentPercentage < 80) return "bg-yellow-500";
    return "bg-red-500";
  };

  // =========== BUDGET HANDLERS ============
  const handleBudgetCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!budgetAmount || isNaN(budgetAmount) || parseFloat(budgetAmount) <= 0) {
      setError("Invalid budget amount.");
      return;
    }
    try {
      const newB = await createBudget(token, { amount: parseFloat(budgetAmount) });
      setBudgets([newB]);
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
      const updated = await updateBudget(token, budget.id, {
        amount: parseFloat(budgetAmount),
      });
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

  // =========== CHART DATA (Expenses Only) ============
  const expenseTransactions = transactions.filter((tx) => tx.type === "EXPENSE");

  // Aggregate expenses by category
  const categoryTotals = expenseTransactions.reduce((acc, tx) => {
    const cat = tx.category ? tx.category.trim() : "Unknown";
    const amt = parseFloat(tx.amount);
    acc[cat] = (acc[cat] || 0) + amt;
    return acc;
  }, {});

  // Data for Chart.js Bar Chart
  const barData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        label: "Expenses by Category",
        data: Object.values(categoryTotals).map((val) => parseFloat(val.toFixed(2))),
        backgroundColor: Object.keys(categoryTotals).map(
          (_, i) =>
            [
              "#14b8a6", // teal-500
              "#10b981", // emerald-500
              "#22c55e", // green-500
              "#2dd4bf", // teal-400
              "#6366f1", // indigo-500
              "#f97316", // orange-500
            ][i % 6]
        ),
      },
    ],
  };

  // Data for Chart.js Line Chart (Monthly Expenses)
  const monthlyExpenses = Array(12).fill(0);
  expenseTransactions.forEach((tx) => {
    const month = new Date(tx.date).getMonth();
    monthlyExpenses[month] += parseFloat(tx.amount);
  });
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Monthly Expenses",
        data: monthlyExpenses.map((val) => parseFloat(val.toFixed(2))),
        borderColor: "#14b8a6", // teal-500
        backgroundColor: "#14b8a6",
        fill: false,
      },
    ],
  };

  // Data for ECharts Pie Chart
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

  // =========== DOUGHNUT CHART DATA ============
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

  return (
    <div
      className={`
        p-4 md:p-8 min-h-screen transition-colors flex flex-col
        ${theme === "light"
          ? "bg-gradient-to-br from-slate-50 to-white text-slate-800"
          : "bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100"
        }
      `}
    >
      <h1
        className="
          text-4xl md:text-5xl font-extrabold text-center mb-8
          bg-clip-text text-transparent
          bg-gradient-to-r from-teal-500 to-emerald-500
        "
      >
        Overview Dashboard
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Top Controls Row */}
      <div className="flex flex-wrap items-center mb-8 gap-4 justify-center">
        <div className="flex flex-col md:flex-row items-center flex-1 gap-4">
          {/* Account Selection */}
          <div className="flex flex-col">
            <label className="block mb-1 font-semibold tracking-wide">
              Select an Account
            </label>
            <select
              className={`
                w-full p-2 border rounded-md shadow-sm
                focus:outline-none focus:ring-2 focus:ring-teal-400
                ${theme === "light"
                  ? "bg-white border-slate-300"
                  : "bg-slate-700 border-slate-600"
                }
              `}
              value={selectedAccount || ""}
              onChange={(e) => setSelectedAccount(e.target.value)}
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

          {/* Doughnut Chart */}
          <div
            ref={doughnutChartRef}
            className={`
              w-40 h-40 md:ml-6 bg-white/80 dark:bg-slate-700/80
              rounded-xl shadow-xl p-3 flex justify-center items-center
              backdrop-blur-md
            `}
          >
            <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Create Transaction Button */}
        <div className="flex justify-center">
          <CreateTransactionModal accounts={accounts} onSuccess={fetchData} />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-slate-500">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN (Charts & Budget Tracker) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Budget Tracker Card */}
            <div
              ref={budgetRef}
              className="
                rounded-xl shadow-xl p-6
                bg-white/80 dark:bg-slate-800/80
                backdrop-blur-md border border-white/10
              "
            >
              <h2
                className="
                  text-xl font-bold mb-4
                  text-transparent bg-clip-text
                  bg-gradient-to-r from-emerald-400 to-teal-500
                "
              >
                Monthly Budget Tracker
              </h2>
              {budget ? (
                <>
                  <p className="mb-2">
                    <span className="font-medium">Budget:</span>{" "}
                    <span className="text-teal-600 dark:text-teal-400">
                      ${budget.amount}
                    </span>
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Spent (This Month):</span>{" "}
                    <span className="text-red-500">
                      ${monthlyExpense.toFixed(2)}
                    </span>
                  </p>
                  {/* Progress Bar */}
                  <div className="relative w-full h-4 bg-slate-300 rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full ${getProgressColor()}`}
                      style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                    />
                  </div>
                  {/* Update / Delete Budget Forms */}
                  <form onSubmit={handleBudgetUpdate} className="mt-4 flex flex-wrap gap-2">
                    <input
                      type="number"
                      className="
                        p-2 border rounded
                        dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200
                        focus:outline-none focus:ring-2 focus:ring-teal-500 w-24
                        border-slate-300
                      "
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="New amt"
                    />
                    <button
                      type="submit"
                      className="
                        bg-teal-500 text-white px-4 py-2 rounded
                        hover:bg-teal-600 transition-colors font-semibold
                      "
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={handleBudgetDelete}
                      className="
                        bg-red-500 text-white px-4 py-2 rounded
                        hover:bg-red-600 transition-colors font-semibold
                      "
                    >
                      Delete
                    </button>
                  </form>
                </>
              ) : (
                <form onSubmit={handleBudgetCreate} className="space-y-2">
                  <p className="text-slate-500 dark:text-slate-300">
                    No budget set yet. Create one below:
                  </p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <input
                      type="number"
                      className="
                        p-2 border rounded
                        dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200
                        focus:outline-none focus:ring-2 focus:ring-teal-500
                        border-slate-300 w-32
                      "
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                      placeholder="Budget amt"
                      required
                    />
                    <button
                      type="submit"
                      className="
                        bg-teal-500 text-white px-4 py-2 rounded
                        hover:bg-teal-600 transition-colors font-semibold
                      "
                    >
                      Create Budget
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Chart Card with Toggle Arrow */}
            <div
              ref={chartContainerRef}
              className="
                rounded-xl shadow-xl p-6
                bg-white/80 dark:bg-slate-800/80
                backdrop-blur-md border border-white/10 relative
              "
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  Expenses Chart - {chartViews[chartViewIndex]}
                </h2>
                <button
                  onClick={toggleChartView}
                  className="
                    p-2 bg-slate-200 dark:bg-slate-700 rounded-full
                    hover:bg-slate-300 dark:hover:bg-slate-600
                    transform transition-transform duration-300 hover:rotate-90
                    shadow
                  "
                >
                  →
                </button>
              </div>
              <div ref={barChartRef}>
                {chartViews[chartViewIndex] === "Bar" && <Bar data={barData} />}
                {chartViews[chartViewIndex] === "Line" && <Line data={lineData} />}
                {chartViews[chartViewIndex] === "ECharts" && (
                  <ReactECharts option={echartsOptions} style={{ height: 350 }} />
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Transaction List) */}
          <div
            ref={transactionListRef}
            className="
              rounded-xl shadow-xl p-6
              bg-white/80 dark:bg-slate-800/80
              backdrop-blur-md border border-white/10
            "
          >
            <h2 className="text-xl font-bold mb-4">All Transactions</h2>
            <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="
                      flex items-center justify-between
                      bg-slate-100 dark:bg-slate-700
                      rounded p-3 shadow-sm
                    "
                  >
                    <div>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">
                        {tx.type} - ${parseFloat(tx.amount).toFixed(2)}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">
                        {new Date(tx.date).toLocaleDateString()} | {tx.category} | {tx.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500">No transactions found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
