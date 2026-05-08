
import { nanoid } from 'nanoid';
import DatabasePool from '../../../databases/database-pool.js';
export class TransactionsRepository extends DatabasePool {
  async createTransactionWithDetails({
    userID,
    totalAmount,
    type,
    transactionDate,
    items,
  }) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const transactionQuery = {
        text: `
        INSERT INTO transactions
        (id, user_id, total_amount, type, transaction_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
        values: [
          `transactions-${nanoid()}`,
          userID,
          totalAmount,
          type,
          transactionDate,
        ],
      };

      const transactionResult = await client.query(transactionQuery);

      const transactionID = transactionResult.rows[0].id;

      for (const item of items) {
        const detailQuery = {
          text: `
          INSERT INTO transaction_details
          (id, transaction_id, detail_type, name, quantity, unit_price, total_price)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          values: [
            `transaction-details-${nanoid()}`,
            transactionID,
            item.detailType,
            item.name,
            item.quantity,
            item.unitPrice,
            item.quantity * item.unitPrice,
          ],
        };

        await client.query(detailQuery);
      }

      await client.query('COMMIT');

      return transactionID;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async createTransactionIncome({
    userID,
    totalAmount,
    type,
    transactionDate,
  }) {

    const query = {
      text: `
        INSERT INTO transactions
        (id, user_id, total_amount, type, transaction_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
      `,
      values: [
        `transactions-${nanoid()}`,
        userID,
        totalAmount,
        type,
        transactionDate,
      ],
    };
    const result = await this.pool.query(query);
    return result.rows[0].id;
  }

  async getDashboardSummary({
    userID,
    range = 'all',
    startDate,
    endDate,
  }) {

    let whereClause = `
    WHERE user_id = $1
  `;

    const values = [userID];

    if (startDate && endDate) {
      whereClause += ' AND transaction_date BETWEEN $2 AND $3';
      values.push(startDate, endDate);
    } else if (range === 'week') {
      whereClause += ' AND transaction_date >= NOW() - INTERVAL \'7 days\'';
    } else if (range === 'month') {
      whereClause += ' AND transaction_date >= NOW() - INTERVAL \'30 days\'';
    } else if (range === 'year') {
      whereClause += ' AND transaction_date >= NOW() - INTERVAL \'1 year\'';
    }

    const query = {
      text: `
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN type = 'income'
              THEN total_amount
              ELSE 0
            END
          ), 0
        ) as income,

        COALESCE(
          SUM(
            CASE
              WHEN type = 'expense'
              THEN total_amount
              ELSE 0
            END
          ), 0
        ) as expense

      FROM transactions

      ${whereClause}
    `,
      values,
    };

    const result = await this.pool.query(query);

    const income = Number(result.rows[0].income);
    const expense = Number(result.rows[0].expense);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }

  async getChart({ userID, range = 'all', startDate, endDate }) {
    const values = [userID];

    let dateFilter = '';
    let label;
    let groupBy;

    if (startDate && endDate) {
      dateFilter = 'AND transaction_date BETWEEN $2 AND $3';
      values.push(startDate, endDate);

      const diffDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

      if (diffDays <= 14) {
        label = "TO_CHAR(transaction_date, 'DD Mon')";
        groupBy = 'transaction_date';
      } else if (diffDays <= 90) {
        label = "TO_CHAR(DATE_TRUNC('week', transaction_date), 'DD Mon')";
        groupBy = "DATE_TRUNC('week', transaction_date)";
      } else {
        label = "TO_CHAR(DATE_TRUNC('month', transaction_date), 'Mon YYYY')";
        groupBy = "DATE_TRUNC('month', transaction_date)";
      }
    } else if (range === 'week') {
      dateFilter = "AND transaction_date >= NOW() - INTERVAL '7 days'";
      label = "TO_CHAR(transaction_date, 'DD Mon')";
      groupBy = 'transaction_date';
    } else if (range === 'month') {
      dateFilter = "AND transaction_date >= NOW() - INTERVAL '30 days'";
      label = "TO_CHAR(DATE_TRUNC('week', transaction_date), 'DD Mon')";
      groupBy = "DATE_TRUNC('week', transaction_date)";
    } else if (range === 'year') {
      dateFilter = "AND transaction_date >= NOW() - INTERVAL '1 year'";
      label = "TO_CHAR(DATE_TRUNC('month', transaction_date), 'Mon YYYY')";
      groupBy = "DATE_TRUNC('month', transaction_date)";
    } else {
      label = "TO_CHAR(DATE_TRUNC('year', transaction_date), 'YYYY')";
      groupBy = "DATE_TRUNC('year', transaction_date)";
    }

    const query = {
      text: `
      SELECT
        ${label} AS label,

        COALESCE(SUM(
          CASE
            WHEN type = 'income'
            THEN total_amount
            ELSE 0
          END
        ), 0) AS income,

        COALESCE(SUM(
          CASE
            WHEN type = 'expense'
            THEN total_amount
            ELSE 0
          END
        ), 0) AS expense

      FROM transactions

      WHERE user_id = $1
      ${dateFilter}

      GROUP BY ${groupBy}, ${label}
      ORDER BY ${groupBy}
    `,
      values,
    };

    const result = await this.pool.query(query);

    return result.rows.map((row) => ({
      label: row.label,
      income: Number(row.income),
      expense: Number(row.expense),
    }));
  }

}
export default TransactionsRepository;
