import React, { useState } from 'react';

const containerClasses = "max-w-sm mx-auto p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-md";
const titleClasses = "text-center text-md font-bold text-zinc-900 dark:text-zinc-100";
const textClasses = "text-center text-zinc-700 dark:text-zinc-300 mt-2";
const inputClasses = "w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md";
const buttonContainerClasses = "flex mt-4 border border-zinc-300 dark:border-zinc-700 rounded-md";
const buttonClasses = "w-1/2 p-2 border-r border-zinc-300 dark:border-zinc-700";
const buttonLastClasses = "w-1/2 p-2";

const TopUp = ({ onClose, onConfirm, setError }) => {
  const [amount, setAmount] = useState("");
  const [formattedAmount, setFormattedAmount] = useState("");
  const [localError, setLocalError] = useState("");

  const handleConfirm = async () => {
    if (!amount) {
      setLocalError("Please enter an amount.");
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setLocalError("Please enter a valid positive amount.");
      return;
    }

    try {
      await onConfirm(amount);  // Gọi hàm xác nhận từ props
      onClose();          // Đóng modal sau khi xác nhận
    } catch (error) {
      setError("Failed to initiate payment.");  // Xử lý lỗi nếu xảy ra trong quá trình xác nhận
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Loại bỏ các ký tự không phải số
    setAmount(value);

    if (value === "") {
      setFormattedAmount(""); // Nếu input trống, đặt formattedAmount là chuỗi rỗng
    } else {
      const numberValue = parseFloat(value);
      setFormattedAmount(numberValue.toLocaleString());
    }

    setLocalError("");  // Xóa lỗi khi người dùng thay đổi giá trị
  };

  return (
    <div className={containerClasses}>
      <h2 className={titleClasses}>Top-up</h2>
      <p className={textClasses}>
        Please enter the amount to top-up your wallet.
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
    </div>
  );
};

export default TopUp;
