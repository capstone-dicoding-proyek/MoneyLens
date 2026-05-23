
import { nanoid } from 'nanoid';
import DatabasePool from '../../../databases/database-pool.js';
export class TransactionsRepository extends DatabasePool {
  async createTransactionWithDetails({
    userID,
    totalAmount,
    type,
    transactionDate,
    items,
    description = null
  }) {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const transactionQuery = {
        text: `
        INSERT INTO transactions (id, user_id, total_amount, type,  description , transaction_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
      `,
        values: [
          `transactions-${nanoid()}`,
          userID,
          totalAmount,
          type,
          description,
          transactionDate,
        ],
      };

      const transactionResult = await client.query(transactionQuery);

      const transactionID = transactionResult.rows[0].id;
      for (const item of items) {
        const quantity = item.detailType === 'product' || item.detailType === 'food_drink' ? Number(item.quantity) : null;

        const unitPrice = Number(item.unitPrice);

        const totalPrice =
          item.detailType === 'product' || item.detailType === 'food_drink'
            ? quantity * unitPrice
            : unitPrice;

        const detailQuery = {
          text: `
        INSERT INTO transaction_details (id, transaction_id, detail_type, name, quantity, unit_price, total_price) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
          values: [
            `transaction-details-${nanoid()}`,
            transactionID,
            item.detailType,
            item.name,
            quantity,
            unitPrice,
            totalPrice,
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
    nameIncome = null,
    description = null
  }) {

    const query = {
      text: `
        INSERT INTO transactions
        (id, user_id, total_amount, name_income,description ,type, transaction_date)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id
      `,
      values: [
        `transactions-${nanoid()}`,
        userID,
        totalAmount,
        nameIncome,
        description,
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

  async getCategoryBreakdown({ userID, range = 'all', startDate, endDate }) {
    const values = [userID];
    let dateFilter = '';

    if (startDate && endDate) {
      dateFilter = 'AND t.transaction_date BETWEEN $2 AND $3';
      values.push(startDate, endDate);
    } else if (range === 'week') {
      dateFilter = "AND t.transaction_date >= NOW() - INTERVAL '7 days'";
    } else if (range === 'month') {
      dateFilter = "AND t.transaction_date >= NOW() - INTERVAL '30 days'";
    } else if (range === 'year') {
      dateFilter = "AND t.transaction_date >= NOW() - INTERVAL '1 year'";
    }

    const result = await this.pool.query({
      text: `
      SELECT
        td.detail_type,
        SUM(td.total_price) AS total
      FROM transaction_details td
      JOIN transactions t ON t.id = td.transaction_id
      WHERE t.user_id = $1
        AND t.type = 'expense'
        ${dateFilter}
      GROUP BY td.detail_type
      ORDER BY total DESC
    `,
      values,
    });

    const totalExpense = result.rows.reduce((sum, r) => sum + Number(r.total), 0);

    return result.rows.map((r) => ({
      detailType: r.detail_type,
      total: Number(r.total),
      percent: totalExpense > 0
        ? Math.round((Number(r.total) / totalExpense) * 100)
        : 0,
    }));
  }


  async getHistory({ userID, startDate, endDate, search, type, page = 1, limit = 50 }) {
    const values = [userID];
    let dateFilter = '';
    let searchFilter = '';
    let typeFilter = '';

    if (startDate && endDate) {
      dateFilter = `AND t.transaction_date BETWEEN $${values.length + 1} AND $${values.length + 2}`;
      values.push(startDate, endDate);
    }

    if (type && ['income', 'expense'].includes(type)) {
      typeFilter = `AND t.type = $${values.length + 1}`;
      values.push(type);
    }

    if (search) {
      searchFilter = `
      AND (
        t.name_income ILIKE $${values.length + 1}
        OR t.description ILIKE $${values.length + 1}
        OR EXISTS (
          SELECT 1 FROM transaction_details td2
          WHERE td2.transaction_id = t.id
          AND td2.name ILIKE $${values.length + 1}
        )
      )
    `;
      values.push(`%${search}%`);
    }

    const limitIdx = values.length + 1;
    const offsetIdx = values.length + 2;
    const offset = (page - 1) * limit;
    values.push(limit, offset);

    const result = await this.pool.query({
      text: `
      SELECT
        t.id,
        t.total_amount,
        t.type,
        t.transaction_date,
        t.name_income,
        t.description,
        COALESCE(
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'detailType', td.detail_type,
              'name',       td.name,
              'quantity',   td.quantity,
              'unitPrice',  td.unit_price,
              'totalPrice', td.total_price
            )
          ) FILTER (WHERE td.id IS NOT NULL),
          '[]'
        ) AS items
      FROM transactions t
      LEFT JOIN transaction_details td ON td.transaction_id = t.id
      WHERE t.user_id = $1
        ${dateFilter}
        ${typeFilter}
        ${searchFilter}
      GROUP BY t.id, t.total_amount, t.type, t.transaction_date, t.name_income, t.description
      ORDER BY t.transaction_date DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
    `,
      values,
    });

    return result.rows.map((r) => ({
      id: r.id,
      description: r.description,
      nameIncome: r.name_income,
      totalAmount: Number(r.total_amount),
      type: r.type,
      transactionDate: r.transaction_date,
      items: r.items,
    }));
  }

  async getAvailableYears({ userID }) {
    const result = await this.pool.query({
      text: `
      SELECT DISTINCT EXTRACT(YEAR FROM transaction_date)::INT AS year
      FROM transactions
      WHERE user_id = $1
      ORDER BY year DESC
    `,
      values: [userID],
    });

    return result.rows.map((r) => r.year);
  }

}
export default TransactionsRepository;
