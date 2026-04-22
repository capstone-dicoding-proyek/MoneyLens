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
    pgm.createTable('reset_password', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id: {
            type: 'varchar(250)', references: 'users',
            notNull: true,
            unique: true
        },
        token: {
            type: 'varchar(250)', unique: true
            , notNull: true
        },
        expired_at: {
            type: 'TIMESTAMP'
            , notNull: true,
            default: pgm.func("NOW() + INTERVAL '30 minutes'"),
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => { 
    pgm.dropTable('reset_password');
};
