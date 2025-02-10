import React, { useEffect, useState, useContext, useRef, useMemo, useCallback } from "react";
import { getTransactions, createTransaction, deleteTransaction } from "../services/transactionService";
import { getAccounts, updateAccount } from "../services/accountService"; // Ensure this service exists
import { AuthContext } from "../context/AuthContext";
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
  const [searchQuery, setSearchQuery] = useState("");

  const containerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (token) {
      fetchTransactions();
      fetchAccounts();
    }
  }, [token]);

  const fetchTransactions = useCallback(async () => {
    try {
      const data = await getTransactions(token);
      setTransactions(data || []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions.");
    }
  }, [token]);

  const fetchAccounts = useCallback(async () => {
    try {
      const data = await getAccounts(token);
      setAccounts(data || []);
    } catch (err) {
      console.error("Error fetching accounts:", err);
    }
  }, [token]);

  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, [transactions]);

  const handleCreate = useCallback(
    async (e) => {
      e.preventDefault();
      setError("");
      
      // Parse and validate the amount
      const amountVal = parseFloat(form.amount);
      if (!amountVal || isNaN(amountVal) || amountVal <= 0) {
        setError("Please enter a valid positive amount.");
        return;
      }
      
      if (!form.accountId) {
        setError("Please select an account.");
        return;
      }
      
      // Find the selected account from the current accounts state
      const selectedAcc = accounts.find((acc) => acc.id === form.accountId);
      if (!selectedAcc) {
        setError("Selected account not found.");
        return;
      }
      
      // Compute the new balance: add for INCOME, subtract for EXPENSE
      const currentBalance = parseFloat(selectedAcc.balance);
      const newBalance =
        form.type === "INCOME" ? currentBalance + amountVal : currentBalance - amountVal;
      
      try {
        // Update the account balance first (ensure your updateAccount function accepts an object with a balance field)
        await updateAccount(token, form.accountId, { balance: newBalance });
        
        // Create the transaction using the parsed amount
        await createTransaction(token, { ...form, amount: amountVal });
        
        // Reset form fields
        setForm({
          type: "INCOME",
          amount: "",
          description: "",
          date: "",
          category: "",
          accountId: ""
        });
        
        // Refresh transactions and accounts data
        fetchTransactions();
        fetchAccounts();
      } catch (err) {
        console.error("Error creating transaction:", err);
        setError("Failed to create transaction.");
      }
    },
    [token, form, fetchTransactions, fetchAccounts, accounts]
  );
  

  const handleDelete = useCallback(
    async (id) => {
      // Locate the transaction to be deleted
      const transactionToDelete = transactions.find((tx) => tx.id === id);
      if (!transactionToDelete) return;
  
      const amount = parseFloat(transactionToDelete.amount);
      const accountId = transactionToDelete.accountId;
      
      // For an expense, deleting it should add the amount back to the account.
      // For an income, deleting it should subtract the amount.
      const delta = transactionToDelete.type === "EXPENSE" ? amount : -amount;
      
      const message =
        transactionToDelete.type === "EXPENSE"
          ? `Deleting this expense transaction will add $${amount.toFixed(2)} back to the account. Do you want to proceed?`
          : `Deleting this income transaction will remove $${amount.toFixed(2)} from the account balance. Do you want to proceed?`;
  
      if (!window.confirm(message)) return;
  
      try {
        // Find the corresponding account
        const account = accounts.find((acc) => acc.id === accountId);
        if (!account) {
          setError("Account for this transaction was not found.");
          return;
        }
        
        // Compute the new balance using the delta
        const newBalance = parseFloat(account.balance) + delta;
        
        // Update the account balance by passing an object with the new balance
        await updateAccount(token, accountId, { balance: newBalance });
        
        // Then delete the transaction
        await deleteTransaction(token, id);
        
        // Refresh the transactions and accounts to reflect the changes
        fetchTransactions();
        fetchAccounts();
      } catch (err) {
        console.error("Error processing deletion:", err);
        setError("Failed to delete transaction and update account balance.");
      }
    },
    [token, transactions, fetchTransactions, fetchAccounts, accounts]
  );
  

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) =>
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [transactions, searchQuery]);

  return (
    <div
      className={`p-6 min-h-screen transition-colors flex flex-col ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900"
          : "bg-gradient-to-br from-gray-900 to-blue-900 text-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Transaction History
          </h2>
          <div className="mt-4 md:mt-0 w-full md:w-96">
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full px-4 py-2 glass-input rounded-lg border border-white/30 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* New Transaction Form */}
          <div className="lg:col-span-1">
            <div className="glass-container p-6 rounded-2xl shadow-2xl border border-white/30" ref={formRef}>
              <h3 className="text-2xl font-bold mb-6 text-cyan-400 border-b border-cyan-500/30 pb-3">
                New Transaction
              </h3>
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="glass-input-container">
                  <select
                    className="glass-input"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="INCOME">Income</option>
                    <option value="EXPENSE">Expense</option>
                  </select>
                </div>
                <div className="glass-input-container">
                  <input
                    type="number"
                    className="glass-input"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="glass-input-container">
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="glass-input-container">
                  <input
                    type="date"
                    className="glass-input"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="glass-input-container">
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="Category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div className="glass-input-container">
                  <select
                    className="glass-input"
                    value={form.accountId}
                    onChange={(e) => setForm({ ...form, accountId: e.target.value })}
                    required
                  >
                    <option value="">Select Account</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name} - ${parseFloat(account.balance).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold">
                  Add Transaction
                </button>
              </form>
            </div>
          </div>

          {/* Transactions List */}
          <div className="lg:col-span-3 glass-container backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/30" ref={containerRef}>
            <div className="space-y-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-md"
                  >
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                        {tx.type} - <span className="text-cyan-600 dark:text-cyan-400">${parseFloat(tx.amount).toFixed(2)}</span>
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(tx.date).toLocaleDateString()} | {tx.category} | {tx.description}
                      </span>
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
      </div>
    </div>
  );
};

export default Transactions;
