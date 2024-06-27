import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const containerClasses = "max-w-sm mx-auto p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-md";
const titleClasses = "text-center text-md font-semibold text-zinc-900 dark:text-zinc-100";
const textClasses = "text-center text-zinc-700 dark:text-zinc-300 mt-2";
const inputClasses = "w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md";
const buttonContainerClasses = "flex mt-4 border border-zinc-300 dark:border-zinc-700 rounded-md";
const buttonClasses = "w-1/2 p-2 border-r border-zinc-300 dark:border-zinc-700";
const buttonLastClasses = "w-1/2 p-2";

const Withdraw = ({balance, onClose, onConfirm, setError }) => {
  const [amount, setAmount] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const [localError, setLocalError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setLocalError("Please enter a valid amount.");
      return;
    }

    if (parseFloat(amount) > balance) {
      setLocalError("Insufficient balance.");
      return;
    }
    setShowConfirmModal(true)

  };
  const handleWithdrawConfirm = async () =>{
    setIsLoading(true)
    setShowConfirmModal(false)
    setTimeout(async () => {
      try {
        await onConfirm(amount);  
        setIsLoading(false);      
        onClose();                
      } catch (error) {
        setIsLoading(false);     
        setError("Failed to initiate withdrawal.");  
      }
    }, 2000);  
  }
  const handleChange = (e) => {
    let value = e.target.value;

  
    value = value.replace(/[^0-9,]/g, "");


    if (value.indexOf(",") !== -1) {
      const parts = value.split(",");
      value = parts[0] + "," + parts.slice(1).join("");
    }

    setAmount(value.replace(/,/g, ""));  
    setFormattedAmount(value);          
    setLocalError("");  
  };

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>Withdraw</h2>
      <p className={textClasses}>
        Your current balance is {balance.toLocaleString()}. Please enter the amount to withdraw from your wallet.
      </p>
      <div className="mt-4">
        <input
          type="text"
          className={inputClasses}
          placeholder="Enter amount"
          value={formattedAmount}
          onChange={handleChange}
        />
      </div>
      {localError && <div className="text-red-500 mt-2">{localError}</div>}
      <div className={buttonContainerClasses}>
        <button 
          className={`${buttonClasses} hover:bg-red-500 text-zinc-700 dark:text-zinc-300`} 
          onClick={onClose}>
          Cancel
        </button>
        <button 
          className={`${buttonLastClasses} hover:bg-green-500 text-blue-600 dark:text-blue-400`} 
          onClick={handleConfirm}>
          OK
        </button>
      </div>
      {isLoading && (
        <div className="mt-4 text-center">
          <div className="loader" />
          <p className="text-zinc-700 dark:text-zinc-300">Processing your request...</p>
        </div>
      )}
      {showConfirmModal && (
        <ConfirmModal
          message={`Are you sure you want to withdraw ${formattedAmount}?`}
          onConfirm={handleWithdrawConfirm}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default Withdraw;
