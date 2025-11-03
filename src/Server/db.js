const mySql2 = require('mySql2/promise');

const pool = mySql2.createPool({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "db_techstore",
});

// Testar conexão
pool.getConnection()
    .then(connection => {
        console.log("Conectado ao banco de dados MySQL");
        connection.release();
    })
    .catch(err => {
        console.error("Erro ao conectar ao banco:", err);
    });

    module.exports = pool;