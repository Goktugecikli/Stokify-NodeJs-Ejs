import sql from 'mssql';

const dbConfig = {
    server: 'DESKTOP-NDQN894',
    database: 'StockTracking',
    options: {
        encrypt: true,
        enableArithAbort: true
    }
};

async function connectDB() {
    try {
        let pool = await sql.connect(dbConfig);
        console.log('Connected to database');
        return pool;
    } catch (err) {
        console.error('Database connection failed', err);
    }
}

async function queryWithResult(query) {
    try {
        let pool = await sql.connect(dbConfig);
        let result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('Query failed', err);
    }
}

async function queryWithoutResult(query) {
    try {
        let pool = await sql.connect(dbConfig);
        await pool.request().query(query);
    } catch (err) {
        console.error('Query failed', err);
    }
}

async function closeDB() {
    try {
        await sql.close();
        console.log('Connection closed');
    } catch (err) {
        console.error('Failed to close connection', err);
    }
}

// async function checkUserCredentials(username, password) {
//     // Basit kullanıcı kimlik doğrulama mantığı
//     const query = `SELECT * FROM Users WHERE username = '${username}' AND password = '${password}'`;
//     const result = await queryWithResult(query);
//     return result.length > 0;
// }

// async function LoginResult(username, password) {
//     const isAuthenticated = await checkUserCredentials(username, password);
//     return isAuthenticated;
// }
 