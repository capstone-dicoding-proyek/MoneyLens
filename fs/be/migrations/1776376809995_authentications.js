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
    pgm.createTable('authentications', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        token: {
            type: 'TEXT',
            notNull: true,
        },
        user_id: {
            type: 'varchar(250)', references: 'users',
            notNull: true
        },
        expired_at: {
            type: 'TIMESTAMP'
            , notNull: true,
            default: pgm.func("NOW() + INTERVAL '7 days'"),
        },
        created_at: {
            type: 'TIMESTAMP'
            , notNull: true,
            default: pgm.func("NOW()"),
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('authentications');
};
