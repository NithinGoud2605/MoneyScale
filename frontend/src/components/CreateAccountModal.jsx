import React, { useState, useContext, useRef, useEffect } from "react";
import { createAccount } from "../services/accountService";
import { AuthContext } from "../context/AuthContext";
import gsap from "gsap";

const CreateAccountModal = ({ onSuccess }) => {
  const { token } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountType, setAccountType] = useState("CURRENT");
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");

  const modalRef = useRef(null);

  // Animate modal content when modal opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isOpen]);

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
      // Reset form and close modal
      setIsOpen(false);
      setAccountName("");
      setAccountType("CURRENT");
      setBalance(0);
      setError("");
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Error creating account:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the account. Please try again."
      );
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-600 transition-colors"
      >
        Create Account
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-slate-800 p-6 rounded shadow-lg w-full max-w-md max-h-full overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Account</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setError("");
                }}
                className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
              {/* Account Name */}
              <div>
                <label className="block text-sm font-medium">Account Name</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder="e.g. Savings Account"
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 border-slate-300"
                />
              </div>
              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium">Account Type</label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 border-slate-300"
                >
                  <option value="CURRENT">Current</option>
                  <option value="SAVINGS">Savings</option>
                </select>
              </div>
              {/* Initial Balance */}
              <div>
                <label className="block text-sm font-medium">Initial Balance</label>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 border-slate-300"
                />
              </div>
              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setError("");
                  }}
                  className="py-2 px-4 bg-slate-300 dark:bg-slate-700 rounded hover:bg-slate-400 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  className="py-2 px-4 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAccountModal;
