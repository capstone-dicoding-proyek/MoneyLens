/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createType('transaction_type', [
        'expense',
        'income'
    ]);
    pgm.createTable('transactions', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id: {
            type: 'varchar(250)', references: 'users',
            notNull: true,
        },
        total_amount: {
            type: 'BIGINT',
            notNull: true
        },
        type: {
            type: 'transaction_type',
            notNull: true
        },
        transaction_date: {
            type: 'TIMESTAMP',
            notNull: true
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        }
    });
    pgm.addConstraint(
        'transactions',
        'check_total_amount_positive',
        'CHECK (total_amount >= 0)'
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('transactions');
};
