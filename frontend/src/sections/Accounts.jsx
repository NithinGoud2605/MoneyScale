import React, { useEffect, useState, useContext, useRef } from "react";
import { getAccounts, createAccount, deleteAccount } from "../services/accountService";
import { getTransactions } from "../services/transactionService";
import { AuthContext } from "../context/AuthContext";
import gsap from "gsap";
import { useTheme } from "../theme/ThemeProvider";

const Accounts = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useTheme();

  // State for accounts, transactions, form data, and error message
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ name: "", type: "CURRENT", balance: 0 });
  const [error, setError] = useState("");

  // Refs for animation
  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  // Combined data fetch function
  const fetchData = async () => {
    try {
      const [accountsData, transactionsData] = await Promise.all([
        getAccounts(token),
        getTransactions(token)
      ]);
      setAccounts(accountsData || []);
      setTransactions(transactionsData || []);
    } catch (err) {
      console.error("Error fetching accounts:", err);
      setError("Failed to fetch accounts.");
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Animate the container (on mount)
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  // Animate each account card when accounts change
  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "back.out(1.7)" }
      );
    }
  }, [accounts]);

  // Handler to create a new account
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createAccount(token, { ...form, balance: parseFloat(form.balance) });
      setForm({ name: "", type: "CURRENT", balance: 0 });
      fetchData();
    } catch (err) {
      console.error("Error creating account:", err);
      setError("Failed to create account.");
    }
  };

  // Handler to delete an account
  const handleDelete = async (id) => {
    try {
      await deleteAccount(token, id);
      fetchData();
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account.");
    }
  };

  // Calculate total balance across accounts
  const totalBalance = accounts
    .reduce((sum, acc) => sum + parseFloat(acc.balance), 0)
    .toFixed(2);

  return (
    <div
      className={`p-6 min-h-screen transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900"
          : "bg-gradient-to-br from-gray-900 to-blue-900 text-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header & Summary */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-4 md:space-y-0">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Financial Portfolios
          </h2>
          <div className="glass-container p-4 rounded-2xl">
            <div className={`text-xl font-semibold ${theme === "light" ? "total-assets-light" : "total-assets-dark"}`}>
              Total Assets:{" "}
              <span className={`text-2xl ${theme === "light" ? "total-assets-value-light" : "total-assets-value-dark"}`}>
                ${totalBalance}
              </span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Create Account Form - Sticky Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-6 h-fit">
            <div className="glass-container p-6 rounded-2xl shadow-2xl transform perspective-1000 hover:rotate-x-2 transition-transform duration-300">
              <h3 className="text-2xl font-bold mb-6 text-cyan-400 border-b border-cyan-500/30 pb-3">
                New Account
              </h3>
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="glass-input-container">
                  <input
                    type="text"
                    className="glass-input"
                    placeholder="Account Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <span className="input-icon">🏦</span>
                </div>
  
                <div className="glass-input-container">
                  <select
                    className="glass-input"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="CURRENT">Current Account</option>
                    <option value="SAVINGS">Savings Account</option>
                  </select>
                  <span className="input-icon">📑</span>
                </div>
  
                <div className="glass-input-container">
                  <input
                    type="number"
                    className="glass-input"
                    placeholder="Initial Balance"
                    value={form.balance}
                    onChange={(e) => setForm({ ...form, balance: e.target.value })}
                  />
                  <span className="input-icon">💰</span>
                </div>
  
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-700 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
  
          {/* Accounts Grid */}
          <div className="lg:col-span-8 xl:col-span-9" ref={containerRef}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {accounts.length > 0 ? (
                accounts.map((acc, idx) => (
                  <div
                    key={acc.id}
                    ref={(el) => (cardsRef.current[idx] = el)}
                    className="glass-container group relative p-6 rounded-2xl shadow-2xl border border-white/30 hover:-translate-y-2 transition-all duration-300"
                  >
                    {/* Account Header */}
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-cyan-400">{acc.name}</h3>
                        <p className="text-sm text-cyan-300/80">{acc.type}</p>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                        ${parseFloat(acc.balance).toFixed(2)}
                      </div>
                    </div>
  
                    {/* Transaction Timeline */}
                    <div className="border-t border-cyan-500/20 pt-4">
                      <h4 className="text-sm font-semibold text-cyan-300 mb-3">Recent Activity</h4>
                      <div className="space-y-3">
                        {transactions
                          .filter((tx) => tx.accountId === acc.id)
                          .slice(0, 3)
                          .map((tx) => (
                            <div key={tx.id} className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${tx.type === "INCOME" ? "bg-green-400" : "bg-red-400"}`} />
                              <div className="flex-1">
                                <p className="text-sm text-white/90">{tx.description}</p>
                                <p className="text-xs text-cyan-300/60">
                                  {new Date(tx.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </p>
                              </div>
                              <div className={`text-sm font-medium ${tx.type === "INCOME" ? "text-green-400" : "text-red-400"}`}>
                                ${parseFloat(tx.amount).toFixed(2)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
  
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(acc.id)}
                      className="mt-4 w-full py-2 bg-red-500/20 text-red-400 rounded-lg backdrop-blur-sm hover:bg-red-500/30 transition-all duration-300"
                      aria-label={`Delete account ${acc.name}`}
                    >
                      Delete Account
                    </button>
  
                    {/* Hover Effect Elements */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-full">No accounts found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
  
      
    </div>
  );
};

export default Accounts;
