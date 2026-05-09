import { api } from './axios-instance';


export const postTransactionExpense = async ({ items, transactionDate }) => {
  const res = await api.post('/transactions/expense', { items, transactionDate });
  return res.data;
};

export const postTransactionIncome = async ({ totalAmount, transactionDate }) => {
  const res = await api.post('/transactions/income', { totalAmount, transactionDate });
  return res.data;
};

export const getTransactionChart = async (query =  '') => {
  const res = await api.get(`/transactions/chart/${query}`);
  return res.data;
};

export const getTransactionDashboard = async (query = '') => {
  const res = await api.get(`/transactions/dashboard/${query}`);
  return res.data;
};