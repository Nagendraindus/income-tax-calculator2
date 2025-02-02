'use client';

import React, { useState } from 'react';
import './TaxCalculator.css'; // Importing CSS

const TaxCalculator = () => {
  const [income, setIncome] = useState('');
  const [isSalaried, setIsSalaried] = useState(false);
  const [tax, setTax] = useState(null);
  const [error, setError] = useState('');
  const [details, setDetails] = useState(null);

  const calculateTax = (income) => {
    const standardDeduction = isSalaried ? 75000 : 0;
    const taxableIncome = Math.max(0, income - standardDeduction);

    const slabs = [400000, 800000, 1200000, 1600000, 2000000, 2400000];
    const rates = [0, 5, 10, 15, 20, 25, 30];

    let tax = 0;
    let prevSlab = 0;

    for (let i = 0; i < slabs.length; i++) {
      if (taxableIncome > slabs[i]) {
        tax += (slabs[i] - prevSlab) * (rates[i] / 100);
        prevSlab = slabs[i];
      } else {
        tax += (taxableIncome - prevSlab) * (rates[i] / 100);
        break;
      }
    }

    if (taxableIncome > slabs[slabs.length - 1]) {
      tax += (taxableIncome - slabs[slabs.length - 1]) * (rates[rates.length - 1] / 100);
    }

    const rebate = taxableIncome <= 1200000 ? Math.min(tax, 60000) : 0;
    const taxAfterRebate = tax - rebate;
    const cessAmount = taxAfterRebate * 0.04;
    const totalTax = taxAfterRebate + cessAmount;

    return {
      grossIncome: income,
      standardDeduction: standardDeduction,
      taxableIncome: taxableIncome,
      basicTax: tax,
      rebateAmount: rebate,
      taxAfterRebate: taxAfterRebate,
      cessAmount: cessAmount,
      totalTax: Math.round(totalTax * 100) / 100
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setTax(null);
    setDetails(null);

    const incomeValue = parseFloat(income);
    if (isNaN(incomeValue) || incomeValue < 0) {
      setError('Please enter a valid income amount');
      return;
    }

    const taxDetails = calculateTax(incomeValue);
    setTax(taxDetails.totalTax);
    setDetails(taxDetails);
  };

  return (
    <div className="container">
      <h1>Income Tax Calculator 2025</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className='form-tt'>Annual Income (₹)</label>
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder="Enter your annual income"
          />
        </div>

        <div className="checkbox-group">
          <input
            type="checkbox"
            checked={isSalaried}
            onChange={(e) => setIsSalaried(e.target.checked)}
          />
          <label>Salaried Employee (₹75,000 Standard Deduction)</label>
        </div>

        <button type="submit">Calculate Tax</button>

        {error && <div className="alert">{error}</div>}
      </form>

      {details && (
        <div className="results">
          <h3>Tax Calculation Results:</h3>
          
          <p>Gross Income: ₹{details.grossIncome.toLocaleString('en-IN')}</p>
          {details.standardDeduction > 0 && <p>Standard Deduction: -₹{details.standardDeduction.toLocaleString('en-IN')}</p>}
          <p>Taxable Income: ₹{details.taxableIncome.toLocaleString('en-IN')}</p>
          <p>Basic Tax: ₹{details.basicTax.toLocaleString('en-IN')}</p>
          <p>Section 87A Rebate: -₹{details.rebateAmount.toLocaleString('en-IN')}</p>
          <p>Tax After Rebate: ₹{details.taxAfterRebate.toLocaleString('en-IN')}</p>
          <p>Health & Education Cess (4%): ₹{details.cessAmount.toLocaleString('en-IN')}</p>
          <p className="total-tax">Total Tax: ₹{details.totalTax.toLocaleString('en-IN')}</p>
        </div>
      )}

      <div className="tax-slabs">
        <h3>Tax Slabs (New Regime - 2025)</h3>
        <ul>
          <li><span>Up to ₹4,00,000</span><span className="tax-rate">NIL</span></li>
          <li><span>₹4,00,001 - ₹8,00,000</span><span className="tax-rate">5%</span></li>
          <li><span>₹8,00,001 - ₹12,00,000</span><span className="tax-rate">10%</span></li>
          <li><span>₹12,00,001 - ₹16,00,000</span><span className="tax-rate">15%</span></li>
          <li><span>₹16,00,001 - ₹20,00,000</span><span className="tax-rate">20%</span></li>
          <li><span>₹20,00,001 - ₹24,00,000</span><span className="tax-rate">25%</span></li>
          <li><span>Above ₹24,00,000</span><span className="tax-rate">30%</span></li>
        </ul>
      </div>
    </div>
  );
};

export default TaxCalculator;
