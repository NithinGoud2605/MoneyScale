import React, { useState, useContext } from "react";
import { createTransaction } from "../services/transactionService";
import { updateAccount } from "../services/accountService";
import { AuthContext } from "../context/AuthContext";

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

  const handleCreateTransaction = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    if (!category.trim() || !accountId.trim()) {
      setError("Category and Account are required.");
      return;
    }

    try {
      // Adjust the account balance
      const selectedAcc = accounts.find((acc) => acc.id === accountId);
      if (!selectedAcc) {
        setError("Invalid account selected.");
        return;
      }
      let newBalance = selectedAcc.balance;
      if (type === "INCOME") {
        newBalance += parseFloat(amount);
      } else {
        newBalance -= parseFloat(amount);
      }

      // Update the account
      await updateAccount(token, accountId, { balance: newBalance });

      // Create the transaction
      await createTransaction(token, {
        type,
        amount: parseFloat(amount),
        description,
        date,
        category,
        accountId,
      });

      // Reset & Close
      setIsOpen(false);
      setType("EXPENSE");
      setAmount("");
      setDescription("");
      setDate("");
      setCategory("");
      setAccountId("");
      setError("");
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Error creating transaction:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while creating the transaction."
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
        Create Transaction
      </button>

      {isOpen && (
        <div
          className="
            fixed inset-0 bg-black bg-opacity-50
            flex items-center justify-center z-50
          "
        >
          <div className="
            bg-white dark:bg-slate-800 p-6 rounded shadow-lg
            w-11/12 md:w-1/3
          ">
            <h2 className="text-xl font-bold mb-4">Create New Transaction</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mb-4">
              <label className="block text-sm font-medium">Type</label>
              <select
                className="
                  w-full p-2 border rounded
                  dark:bg-slate-700 dark:border-slate-600
                  dark:text-slate-200
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  border-slate-300
                "
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Amount</label>
              <input
                type="number"
                className="
                  w-full p-2 border rounded
                  dark:bg-slate-700 dark:border-slate-600
                  dark:text-slate-200
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  border-slate-300
                "
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <input
                type="text"
                className="
                  w-full p-2 border rounded
                  dark:bg-slate-700 dark:border-slate-600
                  dark:text-slate-200
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  border-slate-300
                "
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Date</label>
              <input
                type="date"
                className="
                  w-full p-2 border rounded
                  dark:bg-slate-700 dark:border-slate-600
                  dark:text-slate-200
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  border-slate-300
                "
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Category</label>
              <input
                type="text"
                className="
                  w-full p-2 border rounded
                  dark:bg-slate-700 dark:border-slate-600
                  dark:text-slate-200
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  border-slate-300
                "
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Groceries"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Account</label>
              <select
                className="
                  w-full p-2 border rounded
                  dark:bg-slate-700 dark:border-slate-600
                  dark:text-slate-200
                  focus:outline-none focus:ring-2 focus:ring-teal-500
                  border-slate-300
                "
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
                onClick={handleCreateTransaction}
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

export default CreateTransactionModal;
