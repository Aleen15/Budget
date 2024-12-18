import React, { useState } from "react";
import "./Budget.css";
import Navbar from "../LandingPage/Navbar";

const Budget = () => {
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [showExpenseTable, setShowExpenseTable] = useState(false);

  const [newBudget, setNewBudget] = useState({
    name: "",
    description: "",
    budget: "",
    expense: "",
  });

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
  });

  const openBudgetDialog = () => setShowBudgetDialog(true);
  const closeBudgetDialog = () => {
    setShowBudgetDialog(false);
    setNewBudget({ name: "", description: "", budget: "", expense: "" });
  };

  const openExpenseDialog = (id) => {
    setSelectedBudgetId(id);
    setShowExpenseDialog(true);
  };

  const closeExpenseDialog = () => {
    setShowExpenseDialog(false);
    setNewExpense({ description: "", amount: "" });
  };

  const handleBudgetInputChange = (e) => {
    const { name, value } = e.target;
    setNewBudget((prevBudget) => ({ ...prevBudget, [name]: value }));
  };

  const handleExpenseInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prevExpense) => ({ ...prevExpense, [name]: value }));
  };

  const saveBudget = () => {
    const newId = budgets.length + 1;
    const updatedBudgets = [
      ...budgets,
      {
        id: newId,
        ...newBudget,
        progress: (newBudget.expense / newBudget.budget) * 100,
        expenses: [],
      },
    ];
    setBudgets(updatedBudgets);
    closeBudgetDialog();
  };

  const saveExpense = () => {
    const updatedBudgets = budgets.map((budget) => {
      if (budget.id === selectedBudgetId) {
        const updatedExpenses = [
          ...budget.expenses,
          {
            id: budget.expenses.length + 1,
            description: newExpense.description,
            amount: parseFloat(newExpense.amount),
            date: new Date().toLocaleString(),
          },
        ];
        const totalExpense = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        return {
          ...budget,
          expenses: updatedExpenses,
          expense: totalExpense,
          progress: (totalExpense / budget.budget) * 100,
        };
      }
      return budget;
    });

    setBudgets(updatedBudgets);
    closeExpenseDialog();
  };

  const deleteBudget = (id) => {
    setBudgets(budgets.filter((budget) => budget.id !== id));
  };

  const toggleExpenseTable = (id) => {
    setSelectedBudgetId(id);
    setShowExpenseTable((prev) => (prev && selectedBudgetId === id ? false : true));
  };

  return (
    <div className="budget-container">
      <Navbar />

      <div className="content">
        <div className="header">
          <h2>Budgets</h2>
          <button className="btn-primary" onClick={openBudgetDialog}>
            + Add Budget
          </button>
        </div>

        {/* Scrollable Budget Summary Section */}
        <div className="budget-summary-container">
          {budgets.map((budget) => (
            <div key={budget.id} className="budget-summary">
              <div className="budget-sum">
                <h3>{budget.name}</h3>
                <div className="budget-amount">
                  ${budget.expense} / ${budget.budget}
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${budget.progress}%` }}
                  ></div>
                </div>
                <div className="summary-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => openExpenseDialog(budget.id)}
                  >
                    Add Expense
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => toggleExpenseTable(budget.id)}
                  >
                    View Expenses
                  </button>
                </div>
              </div>

              {/* Scrollable Expense History */}
              {showExpenseTable && selectedBudgetId === budget.id && (
                <div className="expense-history">
                  <h3>Expense History</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budget.expenses.map((expense) => (
                        <tr key={expense.id}>
                          <td>{expense.id}</td>
                          <td>{expense.description}</td>
                          <td>${expense.amount.toFixed(2)}</td>
                          <td>{expense.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showBudgetDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Add New Budget</h3>
            <div className="dialog-content">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newBudget.name}
                onChange={handleBudgetInputChange}
              />
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={newBudget.description}
                onChange={handleBudgetInputChange}
              />
              <label>Budget:</label>
              <input
                type="number"
                name="budget"
                value={newBudget.budget}
                onChange={handleBudgetInputChange}
              />
              <label>Expense:</label>
              <input
                type="number"
                name="expense"
                value={newBudget.expense}
                onChange={handleBudgetInputChange}
              />
            </div>
            <div className="dialog-actions">
              <button className="btn btn-primary" onClick={saveBudget}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={closeBudgetDialog}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showExpenseDialog && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Add Expense</h3>
            <div className="dialog-content">
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={newExpense.description}
                onChange={handleExpenseInputChange}
              />
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={newExpense.amount}
                onChange={handleExpenseInputChange}
              />
            </div>
            <div className="dialog-actions">
              <button className="btn btn-primary" onClick={saveExpense}>
                Add
              </button>
              <button className="btn btn-secondary" onClick={closeExpenseDialog}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
