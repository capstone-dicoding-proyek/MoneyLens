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
    pgm.createTable('users', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        email: {
            type: 'VARCHAR(50)',
            notNull: true,
            unique: true,
        },
        password: {
            type: 'TEXT',
            notNull: false,
        },
        google_id: {
            type: 'TEXT',
            notNull: false,
            unique:true
        },
        verifiedEmail: {
            type: 'BOOLEAN',
            notNull: true,
            default: false,
        },
        fullname: {
            type: 'TEXT',
            notNull: false,

        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('users');

};
