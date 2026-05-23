import { api } from './axios-instance';


export const createTransaction = async ({ type, body }) => {
  if (type === 'income') {
    const { description, nameIncome, totalAmount, transactionDate } = body;
    const res = await api.post('/transactions/income', { description, nameIncome, totalAmount, transactionDate });
    return res.data;
  } else {
    const { description, items, transactionDate } = body;
    const res = await api.post('/transactions/expense', { description, items, transactionDate });
    return res.data;
  }
};

export const getTransactionDashboard = async (query = '') => {
  const res = await api.get(`/transactions/dashboard${query}`);
  return res.data;
};
export const getTransactionHistory = async (query = '') => {
  const res = await api.get(`/transactions/history${query}`);
  return res.data;
};

export const postTransactionUpload = async ({ formData }) => {
  const res = await api.post('/transactions/upload', formData);
  return res.data;
};

