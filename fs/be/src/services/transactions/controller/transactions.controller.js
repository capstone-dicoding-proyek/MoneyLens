import response from '../../../utils/response.js';
import { TransactionsRepository } from '../repository/transactions.repository.js';

const transactionsRepository = new TransactionsRepository();

// eslint-disable-next-line no-unused-vars
export const addTransactionsExpense = async (req, res, next) => {
  const { items, transactionDate } = req.validated;
  const { id } = req.user;

  const totalAmount = items.reduce((acc, item) => {
    return acc + item.quantity * item.unitPrice;
  }, 0);

  await transactionsRepository.createTransactionWithDetails({
    userID: id,
    totalAmount,
    type: 'expense',
    transactionDate: transactionDate,
    items,
  });

  return response(res, 201, 'Berhasil menambahkan transaksi');
};

// eslint-disable-next-line no-unused-vars
export const addTransactionsIncome = async (req, res, next) => {
  const { totalAmount, transactionDate } = req.validated;
  const { id } = req.user;

  await transactionsRepository.createTransactionIncome({
    userID: id,
    totalAmount,
    type: 'income',
    transactionDate: transactionDate,
  });

  return response(res, 201, 'Berhasil menambahkan transaksi');
};

// eslint-disable-next-line no-unused-vars
export const getDashboard = async (req, res, next) => {
  const { id } = req.user;
  const { range, startDate, endDate } = req.query;

  const summary = await transactionsRepository.getDashboardSummary({
    userID: id,
    range,
    startDate,
    endDate,
  });

  return response(res, 200, 'ok', {
    summary
  });
};

// eslint-disable-next-line no-unused-vars
export const getChart = async (req, res, next) => {
  const { id } = req.user;
  const { range, startDate, endDate } = req.query;
  const chart = await transactionsRepository.getChart({
    endDate,
    startDate,
    userID: id,
    range
  });
  return response(res, 200, 'ok', {
    chart
  });
};