import { transactionsRepository } from '../../../container.js';
import { ClientError } from '../../../exceptions/client-error.js';
import { InvariantError } from '../../../exceptions/error.js';
import response from '../../../utils/response.js';
import { uploadToCloud } from '../../../utils/upload-file.js';

// eslint-disable-next-line no-unused-vars
export const addTransactionsExpense = async (req, res, next) => {
  const { items, transactionDate, description } = req.validated;
  const { id } = req.user;

  const totalAmount = items.reduce((acc, item) => {
    const quantity =
      item.detailType === 'product' || item.detailType === 'food_drink'
        ? Number(item.quantity)
        : 1;

    return acc + (quantity * Number(item.unitPrice));
  }, 0);

  await transactionsRepository.createTransactionWithDetails({
    userID: id,
    description,
    totalAmount,
    type: 'expense',
    transactionDate: transactionDate,
    items,
  });

  return response(res, 201, 'Berhasil menambahkan transaksi');
};

// eslint-disable-next-line no-unused-vars
export const addTransactionsIncome = async (req, res, next) => {
  const { totalAmount, description, nameIncome, transactionDate } = req.validated;
  const { id } = req.user;

  await transactionsRepository.createTransactionIncome({
    userID: id,
    totalAmount,
    description,
    nameIncome,
    type: 'income',
    transactionDate: transactionDate,
  });

  return response(res, 201, 'Berhasil menambahkan transaksi');
};


// eslint-disable-next-line no-unused-vars
export const getDashboard = async (req, res, next) => {
  const { id } = req.user;
  const { startDate, endDate } = req.query;


  const [chart, summary, category, history] = await Promise.all([
    transactionsRepository.getChart({ userID: id, startDate, endDate }),
    transactionsRepository.getDashboardSummary({ userID: id, startDate, endDate }),
    transactionsRepository.getCategoryBreakdown({ userID: id, startDate, endDate }),
    transactionsRepository.getHistory({ userID: id, startDate, endDate, page: 1, limit: 10 }),
  ]);

  return response(res, 200, 'dashboard success', { chart, summary, category, history });

};

// eslint-disable-next-line no-unused-vars
export const deleteTransaction = async (req, res, next) => {
  console.log(req.validated);

  const { userID, transactionID } = req.validated;
  await transactionsRepository.deleteTransaction({ userID, transactionID });
  return response(res, 200, 'Berhasil dihapus');
};

export const uploadFileFoto = async (req, res, next) => {
  if (!req.file) {
    return next(new ClientError('No file uploaded'));
  }
  const result = await transactionsRepository.processOCR(req.file);
  const data = result.data.map((transaction) => ({
    ...transaction,
    items: transaction.items.map((item) => {
      const quantity = item.quantity ? Number(item.quantity) : null;
      const totalPrice = item.totalPrice ? Number(item.totalPrice) : 0;
      const unitPrice = item.unitPrice
        ? Number(item.unitPrice)
        : quantity
          ? totalPrice / quantity
          : totalPrice;

      const detailType = item.detailType
        ? item.detailType
        : quantity
          ? 'product'
          : 'service';

      return {
        ...item,
        detailType,
        quantity,
        unitPrice,
        totalPrice,
      };
    }),
  }));
  if (!result.success) return next(new InvariantError('Ocr e durung mari ojo dipokso...'));
  await uploadToCloud(req.file);


  return response(res, 200, {  data  });
};

// eslint-disable-next-line no-unused-vars
export const getHistory = async (req, res, next) => {
  const { id } = req.user;
  const { startDate, endDate, search, type } = req.query;

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);

  let prevStart, prevEnd;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    prevEnd = new Date(start.getTime() - 86400000);
    prevStart = new Date(prevEnd.getTime() - diffMs);
  }

  const [availableYears, history, summary, previousSummary] = await Promise.all([
    transactionsRepository.getAvailableYears({ userID: id }),

    transactionsRepository.getHistory({
      userID: id,
      startDate,
      endDate,
      search,
      type,
      page,
      limit: limit + 1,
    }),

    transactionsRepository.getDashboardSummary({
      userID: id, startDate, endDate,
    }),

    prevStart && prevEnd
      ? transactionsRepository.getDashboardSummary({
        userID: id,
        startDate: prevStart.toISOString().split('T')[0],
        endDate: prevEnd.toISOString().split('T')[0],
      })
      : Promise.resolve({ income: 0, expense: 0, balance: 0 }),
  ]);

  const hasMore = history.length > limit;
  const data = hasMore ? history.slice(0, limit) : history;

  return response(res, 200, 'History ok', {
    availableYears,
    history: data,
    summary,
    previousSummary,
    pagination: {
      page,
      limit,
      hasMore,
    },
  });
};