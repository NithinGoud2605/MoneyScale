import React, { useEffect, useState, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { getAccounts, createAccount, deleteAccount } from "../services/accountService";
import { getTransactions } from "../services/transactionService";
import { useTheme } from "../theme/ThemeProvider";
import gsap from "gsap";

const Accounts = () => {
  const { token } = useContext(AuthContext);
  const { theme } = useTheme();

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("CURRENT");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");

  const containerRef = useRef(null);

  const fetchData = async () => {
    try {
      const accountsData = await getAccounts(token);
      setAccounts(accountsData || []);
      const transactionsData = await getTransactions(token);
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

  // Animate the account container on update
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, [accounts]);

  // Create Account
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createAccount(token, {
        name,
        type,
        balance: parseFloat(balance),
      });
      setName("");
      setType("CURRENT");
      setBalance(0);
      fetchData();
    } catch (err) {
      console.error("Error creating account:", err);
      setError("Failed to create account.");
    }
  };

  // Delete Account
  const handleDelete = async (id) => {
    try {
      await deleteAccount(token, id);
      fetchData();
    } catch (err) {
      console.error("Error deleting account:", err);
      setError("Failed to delete account.");
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
          text-transparent bg-clip-text
          bg-gradient-to-r from-teal-500 to-emerald-500
        "
      >
        My Accounts
      </h2>
      {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

      {/* Create Account Form */}
      <form
        onSubmit={handleCreate}
        className="
          mb-8 max-w-3xl mx-auto
          bg-white/80 dark:bg-slate-800/80
          p-6 rounded-xl shadow-xl backdrop-blur-md
          border border-white/10
        "
      >
        <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
          <div>
            <label className="block mb-1 font-semibold">Name:</label>
            <input
              type="text"
              className={`
                border p-2 rounded w-full
                focus:outline-none focus:ring-2 focus:ring-teal-500
                ${theme === "light"
                  ? "bg-white border-slate-300"
                  : "bg-slate-700 border-slate-600"
                }
              `}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Account Name"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Type:</label>
            <select
              className={`
                border p-2 rounded w-full
                focus:outline-none focus:ring-2 focus:ring-teal-500
                ${theme === "light"
                  ? "bg-white border-slate-300"
                  : "bg-slate-700 border-slate-600"
                }
              `}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="CURRENT">CURRENT</option>
              <option value="SAVINGS">SAVINGS</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Balance:</label>
            <input
              type="number"
              className={`
                border p-2 rounded w-full
                focus:outline-none focus:ring-2 focus:ring-teal-500
                ${theme === "light"
                  ? "bg-white border-slate-300"
                  : "bg-slate-700 border-slate-600"
                }
              `}
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              required
              placeholder="0"
            />
          </div>
          <button
            className="
              bg-teal-500 text-white px-4 py-2 rounded
              hover:bg-teal-600 transition-colors font-semibold
              transform hover:scale-105 mt-2 md:mt-0 w-full md:w-auto
            "
            type="submit"
          >
            Create Account
          </button>
        </div>
      </form>

      {/* Accounts Grid */}
      <div
        ref={containerRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
      >
        {accounts.length > 0 ? (
          accounts.map((acc) => {
            const accTransactions = transactions
              .filter((tx) => tx.accountId === acc.id)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 3);

            return (
              <div
                key={acc.id}
                className="
                  p-4 rounded-xl shadow-xl
                  bg-white/80 dark:bg-slate-800/80
                  backdrop-blur-md border border-white/10
                  hover:shadow-2xl transition transform hover:-translate-y-1
                "
              >
                <div className="mb-3">
                  <p className="font-semibold text-xl">{acc.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">
                    {acc.type}
                  </p>
                  <p className="text-lg font-bold mt-1 text-teal-600 dark:text-teal-300">
                    ${parseFloat(acc.balance).toFixed(2)}
                  </p>
                </div>
                {/* Recent Transactions */}
                {accTransactions.length > 0 && (
                  <div className="mt-3">
                    <p className="font-semibold">Recent Transactions:</p>
                    <ul className="mt-1 space-y-1">
                      {accTransactions.map((tx) => (
                        <li key={tx.id} className="text-sm text-slate-600 dark:text-slate-300">
                          {tx.type} - ${parseFloat(tx.amount).toFixed(2)} on{" "}
                          {new Date(tx.date).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  onClick={() => handleDelete(acc.id)}
                  className="
                    mt-4 w-full bg-red-500 text-white py-2 rounded
                    hover:bg-red-600 transition-colors font-semibold
                  "
                >
                  Delete Account
                </button>
              </div>
            );
          })
        ) : (
          <p className="text-center text-slate-500 col-span-full">No accounts found.</p>
        )}
      </div>
    </div>
  );
};

export default Accounts;
