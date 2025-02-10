import React, { useState, useContext, useRef, useEffect, useCallback } from "react";
import { createTransaction } from "../services/transactionService";
import { updateAccount } from "../services/accountService";
import { AuthContext } from "../context/AuthContext";
import gsap from "gsap";

const CreateTransactionModal = ({ accounts = [], onSuccess }) => {
  const { token } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState("EXPENSE");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [accountId, setAccountId] = useState("");
  const [error, setError] = useState("");

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  const handleCreateTransaction = useCallback(async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!category.trim() || !accountId.trim()) {
      setError("Category and Account are required.");
      return;
    }
    try {
      const selectedAcc = accounts.find((acc) => acc.id === accountId);
      if (!selectedAcc) {
        setError("Invalid account selected.");
        return;
      }
      let newBalance = parseFloat(selectedAcc.balance);
      if (type === "INCOME") {
        newBalance += parseFloat(amount);
      } else {
        newBalance -= parseFloat(amount);
      }
      await updateAccount(token, accountId, { balance: newBalance });
      await createTransaction(token, {
        type,
        amount: parseFloat(amount),
        description,
        date,
        category,
        accountId,
      });
      setIsOpen(false);
      setType("EXPENSE");
      setAmount("");
      setDescription("");
      setDate("");
      setCategory("");
      setAccountId("");
      setError("");
      onSuccess && onSuccess();
    } catch (err) {
      console.error("Error creating transaction:", err);
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the transaction."
      );
    }
  }, [amount, category, accountId, type, description, date, token, accounts, onSuccess]);

  return (
    <>
      <button
        className="px-6 py-2 rounded-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
        onClick={() => setIsOpen(true)}
      >
        Create Transaction
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={modalRef}
            className="glass-container p-6 rounded-2xl shadow-xl w-full max-w-md max-h-full overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Transaction</h2>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setError("");
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Type</label>
                <select
                  className="w-full p-2 glass-input rounded border focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-2 glass-input rounded border focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <input
                  type="text"
                  placeholder="Optional"
                  className="w-full p-2 glass-input rounded border focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Date</label>
                <input
                  type="date"
                  className="w-full p-2 glass-input rounded border focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Groceries"
                  className="w-full p-2 glass-input rounded border focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Account</label>
                <select
                  className="w-full p-2 glass-input rounded border focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select an Account
                  </option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} - ${account.balance}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setError("");
                  }}
                  className="py-2 px-4 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateTransaction}
                  className="py-2 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded hover:from-cyan-600 hover:to-blue-700 transition-colors"
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

export default CreateTransactionModal;
