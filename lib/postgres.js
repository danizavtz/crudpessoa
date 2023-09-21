const { Pool } = require('pg');
const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'crudpessoa', //digite aqui o nome do banco de dados
    user: 'postgres', //digite aqui o nome do usuário
    password: 'admin', //digite aqui a senha do banco de dados
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    },
};