import React, { useState, useContext } from "react";
import { createAccount } from "../services/accountService";
import { AuthContext } from "../context/AuthContext";

const CreateAccountModal = ({ onSuccess }) => {
  const { token } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("CURRENT");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");

  const handleCreateAccount = async () => {
    if (!accountName.trim()) {
      setError("Account name is required.");
      return;
    }
    if (balance < 0) {
      setError("Balance cannot be negative.");
      return;
    }

    try {
      await createAccount(token, {
        name: accountName,
        type: accountType,
        balance,
      });
      setIsOpen(false);
      setAccountName("");
      setAccountType("CURRENT");
      setBalance(0);
      setError("");
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Error creating account:", error);
      setError(
        error.response?.data?.message ||
        "An error occurred while creating the account. Please try again."
      );
    }
  };

  return (
    <>
      <button
        className="
          bg-teal-500 text-white py-2 px-4 rounded
          hover:bg-teal-600 transition-colors
        "
        onClick={() => setIsOpen(true)}
      >
        Create Account
      </button>
      {isOpen && (
        <div className="
          fixed inset-0 bg-black bg-opacity-50
          flex items-center justify-center z-50
        ">
          <div className="
            bg-white dark:bg-slate-800 p-6 rounded shadow-lg
            w-11/12 md:w-1/3
          ">
            <h2 className="text-xl font-bold mb-4">Create New Account</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4">
              <label className="block text-sm font-medium">Account Name</label>
              <input
                type="text"
                className="
                  w-full p-2 border rounded
                  dark:bg-slate-700 dark:border-slate-600
                  dark:text-slate-200
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  border-slate-300
                "
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g. Savings Account"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Account Type</label>
              <select
                className="
                  w-full p-2 border rounded
                  dark:bg-slate-700 dark:border-slate-600
                  dark:text-slate-200
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  border-slate-300
                "
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
              >
                <option value="CURRENT">Current</option>
                <option value="SAVINGS">Savings</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Initial Balance</label>
              <input
                type="number"
                className="
                  w-full p-2 border rounded
                  dark:bg-slate-700 dark:border-slate-600
                  dark:text-slate-200
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  border-slate-300
                "
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="
                  py-2 px-4 bg-slate-300 dark:bg-slate-700
                  rounded hover:bg-slate-400 dark:hover:bg-slate-600
                "
                onClick={() => {
                  setIsOpen(false);
                  setError("");
                }}
              >
                Cancel
              </button>
              <button
                className="
                  py-2 px-4 bg-teal-500 text-white rounded
                  hover:bg-teal-600 transition-colors
                "
                onClick={handleCreateAccount}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAccountModal;
