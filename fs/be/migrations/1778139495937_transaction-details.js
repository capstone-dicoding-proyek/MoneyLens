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
    pgm.createType('transaction_detail_type', [
        'product',
        'service',
        'fee',
        'other',
    ]);
    pgm.createTable('transaction_details', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        transaction_id: {
            type: 'varchar(250)', references: 'transactions',
            notNull: true,
            onDelete: 'CASCADE',
        },
        detail_type: {
            type: 'transaction_detail_type',
            notNull: true,
        },
        name: {
            type: 'TEXT',
            notNull: true
        },
        quantity: {
            type: 'INTEGER',
            notNull: true
        },
        unit_price: {
            type: 'BIGINT',
            notNull: true
        },
        total_price: {
            type: 'BIGINT',
            notNull: true
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        }
    });
    pgm.addConstraint(
        'transaction_details',
        'check_quantity_positive',
        'CHECK (quantity > 0)'
    );
    pgm.addConstraint(
        'transaction_details',
        'check_price_positive',
        'CHECK (unit_price >= 0 AND total_price >= 0)'
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('transaction_details');
};
