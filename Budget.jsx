import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Budget.css";
import Navbar from "../LandingPage/Navbar";
import ExpenseHistory from "./ExpenseHistory"; // Import the ExpenseHistory component

const Budget = () => {
  const [showBudgetDialog, setShowBudgetDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [showExpenseTable, setShowExpenseTable] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);

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

  // Fetch all budgets when the component mounts
  useEffect(() => {
    axios
      .get("http://localhost:8005/auth/budgets/get-all-budgets")
      .then((response) => {
        setBudgets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching budgets:", error);
      });
  }, []);

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
    axios
      .post("http://localhost:8005/auth/budgets/create-budget", newBudget)
      .then((response) => {
        setBudgets([...budgets, response.data]);
        closeBudgetDialog();
      })
      .catch((error) => {
        console.error("Error creating budget:", error);
      });
  };

  const saveExpense = () => {
    const expenseData = {
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
    };

    axios
      .post(
        `http://localhost:8005/auth/budgets/add-expense/${selectedBudgetId}/expenses`,
        expenseData
      )
      .then((response) => {
        const updatedBudgets = budgets.map((budget) => {
          if (budget.id === selectedBudgetId) {
            const updatedExpenses = [...budget.expenses, response.data];
            const totalExpense = updatedExpenses.reduce(
              (sum, exp) => sum + exp.amount,
              0
            );
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
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data);
        } else {
          console.error("Error adding expense:", error);
        }
      });
  };

  const deleteBudget = (id) => {
    axios
      .delete(`http://localhost:8005/auth/budgets/delete-budget/${id}`)
      .then(() => {
        setBudgets(budgets.filter((budget) => budget.id !== id));
        setShowDeleteConfirmation(false);
        setBudgetToDelete(null);
      })
      .catch((error) => {
        console.error("Error deleting budget:", error);
      });
  };

  // Show delete confirmation dialog
  const handleDeleteClick = (id) => {
    setBudgetToDelete(id);
    setShowDeleteConfirmation(true);
  };

  // Hide the delete confirmation dialog without deleting
  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
    setBudgetToDelete(null);
  };

  const toggleExpenseTable = (id) => {
    if (selectedBudgetId === id && showExpenseTable) {
      // If clicking the same budget, toggle off
      setShowExpenseTable(false);
      setSelectedBudgetId(null);
      return;
    }

    setSelectedBudgetId(id);

    // Fetch expenses for the selected budget
    axios
      .get(`http://localhost:8005/auth/budgets/get-expense/${id}/expenses`)
      .then((response) => {
        // Update the expenses for the selected budget
        setBudgets((prevBudgets) =>
          prevBudgets.map((budget) =>
            budget.id === id ? { ...budget, expenses: response.data } : budget
          )
        );
        setShowExpenseTable(true); // Show the expense table after fetching data
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
      });
  };

  const selectedBudget = budgets.find((b) => b.id === selectedBudgetId);

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

        <div className="main">
          {/* Scrollable Budget Summary Section */}
          <div className="budget-summary-container">
            {budgets.map((budget) => (
              <div key={budget.id} className="budget-summary">
                <div className="budget-sum">
                  <h3>{budget.name}</h3>
                  <p>{budget.description}</p>
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
                      {selectedBudgetId === budget.id && showExpenseTable
                        ? "Hide Expenses"
                        : "View Expenses"}
                    </button>

                    {/* Delete Icon */}
                    <button
                      className="btn btn-danger delete-btn"
                      onClick={() => handleDeleteClick(budget.id)}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Expense History Section */}
          <div className="expense-history-container">
            {showExpenseTable && selectedBudget && (
              <ExpenseHistory expenses={selectedBudget.expenses} />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="dialog-overlay">
          <div className="dialog-box">
            <h3>Are you sure you want to delete this budget?</h3>
            <div className="dialog-actions">
              <button
                className="btn btn-danger"
                onClick={() => deleteBudget(budgetToDelete)}
              >
                Yes
              </button>
              <button className="btn btn-secondary" onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Budget Dialog */}
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

      {/* Add Expense Dialog */}
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
