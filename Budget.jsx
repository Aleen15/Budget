import React from "react";
import "./Budget.css";
import Navbar from '../LandingPage/Navbar';

const Budget = () => {
  return (
    <div className="budget-container">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Main Content */}
      <div className="content">
        <div className="header">
          <h2>Budgets</h2>
          <div className="btn-plus">
            <button className="btn btn-primary">+ Add Budget</button>
            <button className="btn btn-primary">+ Add Expense</button>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="budget-summary">
          <h3>v saiteja viswanath</h3>
          <div className="budget-amount">$789 / $7890</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: "10%" }}></div>
          </div>
        </div>

        {/* Expense History */}
        <div className="expense-history">
          <h3>Expense History</h3>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Budget</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>v saiteja viswanath</td>
                <td>$789</td>
                <td>v saiteja viswanath</td>
                <td>August 30, 2024 at 09:31 AM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Budget;