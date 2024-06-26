import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TopUp from "./TopUp";
import WithDraw from "./WithDraw";
import TransactionListModal from "./TransactionModal";

const UserWallet = () => {
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("token");
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      fetchUserBalance();
      fetchTransactions();
    }
  }, []);

  const fetchUserBalance = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `http://localhost:8080/api/user/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const user = response.data;
        setBalance(user.balance);
      } else {
        console.error("Failed to fetch user balance");
      }
    } catch (error) {
      console.error("Error fetching user balance:", error);
    }
  };


  const handlePayment = async (amount) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const apiPayment = `http://localhost:8080/api/payment/create_payment?id=${userId}&amount=${amount}`;

    try {
      const response = await axios.get(apiPayment, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const paymentDto = response.data;
        if (paymentDto.status === "OK") {
          window.location.href = paymentDto.url; // Chuyển hướng người dùng khi thành công
        } else {
          setError("Payment initiation failed.");
        }
      } else {
        console.error("Payment initiation failed");
        setError("Payment initiation failed.");
      }
    } catch (error) {
      console.error("Error during payment initiation:", error);
      setError("Error during payment initiation.");
    }
  };

  const handleWithdraw = async (amount) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.post(`http://localhost:8080/api/payment/withdraw`, null, {
        params: {
          id: userId,
          amount: amount,
        },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Gửi token xác thực
        },
      });

      if (response.status !== 200) {
        throw new Error('Failed to withdraw');
      }

      const data = response.data;
      setBalance((prevBalance) => prevBalance - parseFloat(amount));
      // Update balance and transactions here if necessary
      fetchTransactions()

    } catch (error) {
      console.error('Error during withdrawal:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDepositClick = () => {
    setShowTopUpModal(true);
  };

  const handleWithdrawClick = () => {
    setShowWithdrawModal(true);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-zinc-100 rounded-xl dark:bg-zinc-800">
      <h1 className="text-2xl font-bold">My Wallet</h1>
      <p className="mt-4 text-lg">Your current balance:</p>
      <p className="text-3xl text-green-600 font-bold">{balance.toLocaleString()} VND</p>
      <div className="mt-4 flex space-x-4">
        <button
          className={`bg-orange-400 hover:bg-orange-500 text-white py-2 px-4 rounded`}
          onClick={handleWithdrawClick}
        >
          Withdraw
        </button>
        <button
          className={`bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded`}
          onClick={handleDepositClick}
        >
          Top-up
        </button>
      </div>
      <h2 className="mt-8 text- font-bold">Transactions</h2>
      <div className="mt-4 flex space-x-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="from-date" className="text-sm">
            From
          </label>
          <input
            id="from-date"
            type="date"
            className="border border-zinc-300 p-2 rounded"
            value={fromDate}
            onChange={handleFromDateChange}
          />
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="to-date" className="text-sm">
            To
          </label>
          <input
            id="to-date"
            type="date"
            className="border border-zinc-300 p-2 rounded"
            value={toDate}
            onChange={handleToDateChange}
          />
        </div>
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded`}
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-200 p-4 rounded-lg shadow-lg">
            <WithDraw 
              balance={balance}
              onClose={() => setShowWithdrawModal(false)}
              onConfirm={(amount) => {
                handleWithdraw(amount);
                setShowWithdrawModal(false);
              }}
              setError={setError}
            />
          </div>
        </div>
      )}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-slate-200 p-4 rounded-lg shadow-lg">
            <TopUp 
              onClose={() => setShowTopUpModal(false)}
              onConfirm={(amount) => {
                handlePayment(amount); // Xử lý nạp tiền
                setShowTopUpModal(false);
              }}
              setError={setError}
            />
          </div>
        </div>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default UserWallet;
