import React, { useEffect, useState, useContext, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { AuthContext } from "../context/AuthContext";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
} from "../services/budgetService";
import { getTransactions, deleteTransaction } from "../services/transactionService";
import { getAccounts, updateAccount } from "../services/accountService"; // updateAccount imported here
import CreateTransactionModal from "../components/CreateTransactionModal";
import { useTheme } from "../theme/ThemeProvider";
import { useNavigate } from "react-router-dom";
import ChartSwitcher from "../components/ChartSwitcher";
import CombinedInsightBanner from "../components/CombinedInsightBanner";

Chart.register(...registerables);

const COLORS = ["#14b8a6", "#10b981", "#22c55e", "#2dd4bf", "#6366f1", "#f97316"];

const TransactionItem = React.memo(({ tx, idx, onDelete }) => (
  <motion.div
    key={tx.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.1 }}
    className="glass-container p-4 rounded-md hover:shadow-lg transition-shadow"
  >
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <span className="font-semibold text-lg text-cyan-400">
        {tx.type} - <span className="text-indigo-600">${parseFloat(tx.amount).toFixed(2)}</span>
      </span>
      <button
        className="mt-2 sm:mt-0 text-red-500 hover:text-red-600 font-bold transition-colors"
        onClick={() => onDelete(tx.id)}
        aria-label="Delete Transaction"
      >
        Delete
      </button>
    </div>
    <div className="text-sm text-slate-700 dark:text-gray-300 mt-2">
      {new Date(tx.date).toLocaleDateString()} | {tx.category} | {tx.description}
    </div>
  </motion.div>
));

const Overview = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  // Data states
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [chartView, setChartView] = useState("Bar");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // ========= FETCH DATA ============
  const fetchData = useCallback(async () => {
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
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, fetchData]);

  // ========= CHART OPTIONS ============
  const getChartOptions = useCallback(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: theme === "light" ? "#1e293b" : "#f8fafc",
            font: { family: "Inter, sans-serif", size: 14 },
          },
        },
        tooltip: {
          backgroundColor: theme === "light" ? "#ffffff" : "#1e293b",
          titleColor: theme === "light" ? "#1e293b" : "#f8fafc",
          bodyColor: theme === "light" ? "#475569" : "#cbd5e1",
          borderColor: theme === "light" ? "#e2e8f0" : "#334155",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      },
      scales: {
        x: {
          grid: { color: theme === "light" ? "#e2e8f0" : "#334155" },
          ticks: { color: theme === "light" ? "#475569" : "#94a3b8" },
        },
        y: {
          grid: { color: theme === "light" ? "#e2e8f0" : "#334155" },
          ticks: { color: theme === "light" ? "#475569" : "#94a3b8" },
        },
      },
    }),
    [theme]
  );

  // ========= COMPUTED VALUES ============
  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + parseFloat(acc.balance), 0);
  }, [accounts]);

  const dailyData = useMemo(() => {
    const days = new Date(currentYear, currentMonth + 1, 0).getDate();
    const expenses = Array(days).fill(0);
    transactions.forEach((tx) => {
      if (tx.type === "EXPENSE") {
        const txDate = new Date(tx.date);
        if (
          txDate.getMonth() === currentMonth &&
          txDate.getFullYear() === currentYear
        ) {
          expenses[txDate.getDate() - 1] += parseFloat(tx.amount);
        }
      }
    });
    return {
      labels: Array.from({ length: days }, (_, i) => i + 1),
      datasets: [
        {
          label: "Daily Expenses",
          data: expenses.map((val) => parseFloat(val.toFixed(2))),
          borderColor: "#f97316",
          backgroundColor: "#f97316",
          fill: false,
        },
      ],
    };
  }, [transactions, currentMonth, currentYear]);

  const categoryTotals = useMemo(() => {
    return transactions
      .filter((tx) => tx.type === "EXPENSE")
      .reduce((acc, tx) => {
        const cat = tx.category ? tx.category.trim() : "Unknown";
        const amt = parseFloat(tx.amount);
        acc[cat] = (acc[cat] || 0) + amt;
        return acc;
      }, {});
  }, [transactions]);

  const barData = useMemo(
    () => ({
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          label: "Expenses by Category",
          data: Object.values(categoryTotals).map((val) =>
            parseFloat(val.toFixed(2))
          ),
          backgroundColor: Object.keys(categoryTotals).map(
            (_, i) => COLORS[i % COLORS.length]
          ),
        },
      ],
    }),
    [categoryTotals]
  );

  const echartsData = useMemo(
    () =>
      Object.keys(categoryTotals).map((cat, i) => ({
        name: cat,
        value: parseFloat(categoryTotals[cat].toFixed(2)),
        itemStyle: {
          color: COLORS[i % COLORS.length],
        },
      })),
    [categoryTotals]
  );

  const echartsOptions = useMemo(
    () => ({
      tooltip: { trigger: "item", formatter: "{b}: ${c} ({d}%)" },
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
              shadowColor: "rgba(0,0,0,0.5)",
            },
          },
        },
      ],
    }),
    [echartsData]
  );

  const doughnutData = useMemo(
    () => ({
      labels: accounts.map((acc) => acc.name),
      datasets: [
        {
          label: "Balances",
          data: accounts.map((acc) => parseFloat(acc.balance).toFixed(2)),
          backgroundColor: accounts.map((_, i) => COLORS[i % COLORS.length]),
        },
      ],
    }),
    [accounts]
  );

  const monthlyExpense = useMemo(() => {
    return transactions
      .filter(
        (tx) =>
          tx.type === "EXPENSE" &&
          new Date(tx.date).getMonth() === currentMonth &&
          new Date(tx.date).getFullYear() === currentYear
      )
      .reduce((acc, tx) => acc + parseFloat(tx.amount), 0);
  }, [transactions, currentMonth, currentYear]);

  const sortedCategories = useMemo(() => {
    return Object.entries(categoryTotals).sort(([, a], [, b]) => b - a);
  }, [categoryTotals]);

  const topCategory = sortedCategories[0] ? sortedCategories[0][0] : "None";
  const topCategoryAmount = sortedCategories[0] ? sortedCategories[0][1] : 0;

  const combinedPrompt = useMemo(() => {
    return `User Financial Overview:
- You have ${accounts.length} account(s) with a total balance of $${totalBalance.toFixed(
      2
    )}.
- Your monthly expenses total $${monthlyExpense.toFixed(2)}.
- ${
      budgets[0]
        ? `Your set budget is $${budgets[0].amount}.`
        : "You have not set a budget."
    }
- Your highest spending is on "${topCategory}" with $${topCategoryAmount.toFixed(
      2
    )} spent this month.
Please provide one-sentence insight that compares these aspects and offers strategies to optimize your investments, savings, and spending habits. Give full answer in a single line.`;
  }, [accounts, totalBalance, monthlyExpense, budgets, topCategory, topCategoryAmount]);

  // ========= BUDGET HANDLERS ============
  const handleBudgetCreate = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      if (!budgetAmount || isNaN(budgetAmount) || parseFloat(budgetAmount) <= 0) {
        setError("Invalid budget amount.");
        return;
      }
      try {
        const newBudget = await createBudget(token, {
          amount: parseFloat(budgetAmount),
        });
        setBudgets([newBudget]);
        setBudgetAmount("");
      } catch (err) {
        console.error("Error creating budget:", err.message);
        setError("Failed to create budget. Try again.");
      }
    },
    [token, budgetAmount]
  );

  const handleBudgetUpdate = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      if (!budgetAmount || isNaN(budgetAmount) || parseFloat(budgetAmount) <= 0) {
        setError("Invalid budget amount.");
        return;
      }
      try {
        const updated = await updateBudget(token, budgets[0].id, {
          amount: parseFloat(budgetAmount),
        });
        setBudgets([updated]);
        setBudgetAmount("");
      } catch (err) {
        console.error("Error updating budget:", err.message);
        setError("Failed to update budget. Try again.");
      }
    },
    [token, budgetAmount, budgets]
  );

  const handleBudgetDelete = useCallback(async () => {
    setError("");
    try {
      await deleteBudget(token, budgets[0].id);
      setBudgets([]);
      setBudgetAmount("");
    } catch (err) {
      console.error("Error deleting budget:", err.message);
      setError("Failed to delete budget. Try again.");
    }
  }, [token, budgets]);

  // ========= TRANSACTION HANDLER ============
  const handleDelete = useCallback(
    async (id) => {
      try {
        // 1) Get the transaction to delete
        const transactionToDelete = transactions.find((tx) => tx.id === id);
        console.log("transactionToDelete =>", transactionToDelete);
        if (!transactionToDelete) {
          throw new Error("Transaction not found in local state.");
        }

        // 2) Confirm with the user
        const amount = parseFloat(transactionToDelete.amount);
        const accountId = transactionToDelete.accountId;
        const message =
          transactionToDelete.type === "EXPENSE"
            ? `Deleting this expense ($${amount.toFixed(2)}) will add the amount back.`
            : `Deleting this income ($${amount.toFixed(2)}) will remove the amount.`;
        if (!window.confirm(message)) {
          return; // user canceled deletion
        }

        // 3) Find the corresponding account
        const account = accounts.find((acc) => acc.id === accountId);
        console.log("account =>", account);
        if (!account) {
          throw new Error("Account not found in local state.");
        }

        // 4) Compute the new balance based on transaction type
        const delta = transactionToDelete.type === "EXPENSE" ? amount : -amount;
        const newBalance = parseFloat(account.balance) + delta;
        console.log("Updating account =>", accountId, "with =>", newBalance);

        // 5) Update the account balance
        await updateAccount(token, accountId, { balance: newBalance });

        // 6) Delete the transaction
        console.log("Deleting transaction =>", id);
        await deleteTransaction(token, id);

        // 7) Refresh the data to update state
        await fetchData();
      } catch (err) {
        console.error("Detailed error =>", err);
        setError("Failed to delete transaction and update account balance.");
      }
    },
    [token, transactions, accounts, fetchData]
  );

  const filteredTransactions = transactions; // Extend filtering logic if needed

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 text-slate-800"
          : "bg-gradient-to-br from-gray-900 to-blue-900 text-gray-100"
      }`}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-blue-600"
      >
        Overview Dashboard
      </motion.h1>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-center text-red-500"
        >
          {error}
        </motion.div>
      )}

      {!loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <CombinedInsightBanner customPrompt={combinedPrompt} />
        </motion.div>
      )}

      {!loading && accounts.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-8 p-4 glass-container text-center"
        >
          <p>
            It looks like you haven't added any accounts yet. Please visit the{" "}
            <span
              className="text-indigo-600 underline cursor-pointer"
              onClick={() => navigate("/accounts")}
            >
              Accounts
            </span>{" "}
            section to create your first account.
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="flex flex-wrap items-center mb-8 gap-6 justify-center"
      >
        <div className="glass-container p-4 rounded-2xl shadow-2xl">
          <label className="block mb-2 font-semibold text-slate-900 dark:text-gray-100">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          className="w-40 h-40 glass-container rounded-2xl p-4 shadow-2xl flex justify-center items-center"
        >
          <Doughnut
            data={doughnutData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <CreateTransactionModal
            accounts={accounts}
            onSuccess={fetchData}
            className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </motion.div>
      </motion.div>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center text-gray-500"
        >
          Loading...
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
              className="glass-container rounded-2xl p-8 shadow-2xl"
            >
              <h2 className="text-xl font-bold mb-4 text-cyan-400">
                Monthly Budget Tracker
              </h2>
              {budgets[0] ? (
                <>
                  <p className="mb-2 text-slate-700 dark:text-gray-300">
                    <span className="font-semibold">Budget:</span>{" "}
                    <span className="text-blue-600">{`$${budgets[0].amount}`}</span>
                  </p>
                  <p className="mb-2 text-slate-700 dark:text-gray-300">
                    <span className="font-semibold">Spent (This Month):</span>{" "}
                    <span className="text-red-500">{`$${monthlyExpense.toFixed(2)}`}</span>
                  </p>
                  <div className="relative w-full h-4 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full ${
                        monthlyExpense / (budgets[0]?.amount || 1) < 0.5
                          ? "bg-green-500"
                          : monthlyExpense / (budgets[0]?.amount || 1) < 0.8
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          (monthlyExpense / (budgets[0]?.amount || 1)) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <form
                    onSubmit={handleBudgetUpdate}
                    className="mt-4 flex flex-wrap gap-3"
                  >
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
                      className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
                  <p className="text-slate-700 dark:text-gray-300">
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
                      className="px-4 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      aria-label="Create Budget"
                    >
                      Create Budget
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
              className="glass-container rounded-2xl p-8 shadow-2xl relative"
            >
              <ChartSwitcher
                chartView={chartView}
                onChange={setChartView}
                barData={barData}
                dailyData={dailyData}
                echartsOptions={echartsOptions}
                getChartOptions={getChartOptions}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="glass-container rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[600px]"
          >
            <h2 className="text-xl font-bold mb-4 text-cyan-400">
              All Transactions
            </h2>
            <div className="space-y-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, idx) => (
                  <TransactionItem key={tx.id} tx={tx} idx={idx} onDelete={handleDelete} />
                ))
              ) : (
                <p className="text-center text-gray-500">No transactions found.</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Overview;
