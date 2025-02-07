import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../services/transactionService";
import { getAccounts } from "../services/accountService";
import gsap from "gsap";
import { useTheme } from "../theme/ThemeProvider";

const Transactions = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useTheme();

  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({
    type: "INCOME",
    amount: "",
    description: "",
    date: "",
    category: "",
    accountId: "",
  });
  const [error, setError] = useState("");
  const containerRef = useRef(null);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const data = await getTransactions(token);
      setTransactions(data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions.");
    }
  };

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      const data = await getAccounts(token);
      setAccounts(data || []);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchAccounts();
    }
  }, [token]);

  // GSAP animation on container
  useEffect(() => {
    if (window.innerWidth >= 768 && containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, [transactions]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    const { amount, accountId } = form;
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setError("Please enter a valid positive amount.");
      return;
    }
    if (!accountId) {
      setError("Please select an account.");
      return;
    }

    try {
      await createTransaction(token, {
        ...form,
        amount: parseFloat(amount),
      });
      setForm({
        type: "INCOME",
        amount: "",
        description: "",
        date: "",
        category: "",
        accountId: "",
      });
      fetchTransactions();
    } catch (err) {
      console.error("Error creating transaction:", err);
      setError("Failed to create transaction.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(token, id);
      fetchTransactions();
    } catch (err) {
      console.error("Error deleting transaction:", err);
      setError("Failed to delete transaction.");
    }
  };

  return (
    <div
      className={`
        p-6 min-h-screen transition-colors
        ${theme === "light"
          ? "bg-gradient-to-br from-slate-50 to-white text-slate-800"
          : "bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100"
        }
      `}
    >
      <h2
        className="
          text-3xl font-extrabold mb-6 text-center
          bg-clip-text text-transparent
          bg-gradient-to-r from-teal-500 to-emerald-500
        "
      >
        Transactions
      </h2>

      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {/* Create Transaction Form */}
      <div className="max-w-4xl mx-auto mb-10 px-4">
        <form
          onSubmit={handleCreate}
          className={`
            bg-white/80 dark:bg-slate-800/80 p-6 rounded-xl
            shadow-xl backdrop-blur-md border border-white/10
          `}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Transaction Type */}
            <select
              className={`
                p-2 border rounded shadow-sm w-full
                focus:outline-none focus:ring-2 focus:ring-teal-500
                ${theme === "light"
                  ? "bg-white border-slate-300"
                  : "bg-slate-700 border-slate-600"
                }
              `}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
            </select>

            {/* Amount */}
            <input
              type="number"
              placeholder="Amount"
              className={`
                p-2 border rounded shadow-sm w-full
                focus:outline-none focus:ring-2 focus:ring-teal-500
                ${theme === "light"
                  ? "bg-white border-slate-300"
                  : "bg-slate-700 border-slate-600"
                }
              `}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />

            {/* Description */}
            <input
              type="text"
              placeholder="Description"
              className={`
                p-2 border rounded shadow-sm w-full
                focus:outline-none focus:ring-2 focus:ring-teal-500
                ${theme === "light"
                  ? "bg-white border-slate-300"
                  : "bg-slate-700 border-slate-600"
                }
              `}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            {/* Date */}
            <input
              type="date"
              className={`
                p-2 border rounded shadow-sm w-full
                focus:outline-none focus:ring-2 focus:ring-teal-500
                ${theme === "light"
                  ? "bg-white border-slate-300"
                  : "bg-slate-700 border-slate-600"
                }
              `}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            {/* Category */}
            <input
              type="text"
              placeholder="Category"
              className={`
                p-2 border rounded shadow-sm w-full
                focus:outline-none focus:ring-2 focus:ring-teal-500
                ${theme === "light"
                  ? "bg-white border-slate-300"
                  : "bg-slate-700 border-slate-600"
                }
              `}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />

            {/* Account Selection */}
            <select
              className={`
                p-2 border rounded shadow-sm w-full
                focus:outline-none focus:ring-2 focus:ring-teal-500
                ${theme === "light"
                  ? "bg-white border-slate-300"
                  : "bg-slate-700 border-slate-600"
                }
              `}
              value={form.accountId}
              onChange={(e) => setForm({ ...form, accountId: e.target.value })}
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} - ${parseFloat(account.balance).toFixed(2)}
                </option>
              ))}
            </select>

            {/* Submit Button */}
            <button
              type="submit"
              className="
                col-span-full bg-teal-500 hover:bg-teal-600
                text-white p-2 rounded shadow-md
                transition-transform transform hover:scale-105
                font-semibold
              "
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>

      {/* Transactions List - Line Wise */}
      <div ref={containerRef} className="max-w-6xl mx-auto px-4">
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <div
              key={tx.id}
              className={`
                flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700
                hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors
              `}
            >
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-semibold text-lg mr-4">
                  {tx.type} -{" "}
                  <span className="text-teal-600 dark:text-teal-300">
                    ${parseFloat(tx.amount).toFixed(2)}
                  </span>
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-300">
                  {new Date(tx.date).toLocaleDateString()} | {tx.category} |{" "}
                  {tx.description}
                </span>
              </div>
              <button
                className="
                  text-red-500 hover:text-red-600 font-bold
                "
                onClick={() => handleDelete(tx.id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-500">
            No transactions found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
