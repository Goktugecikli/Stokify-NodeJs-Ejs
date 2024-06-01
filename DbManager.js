import sql  from "mssql/msnodesqlv8.js";


const dbConfig = {
    server: 'DESKTOP-NDQN894',
    database: 'StockTracking',
    user: 'sa',
    password: '12345678',
    port: 1433,
    driver:"msnodesqlv8",
    options: {
        // encrypt: true,
        // trustServerCertificate: true,
        trustedConnection: true,
        // enableArithAbort: true,
        // integratedSecurity: true,
        // Güvenilir bağlantı için yorum satırından çıkarılabilir
        // authentication: {
        //     type: 'default',
        //     options: {
        //         userName: 'DESKTOP-NDQN894\\ggeci', // Windows kullanıcı adı ve alanı
        //         // password: 'password' // Gerekirse şifre de buraya eklenebilir
        //     }
        // }
    }
};

class DatabaseManager {
    constructor() {
    
    }

    async connectDB() {
        try {
            this.pool = await sql.connect(dbConfig);
            // console.log('Connected to database');
            return this.pool;
        } catch (err) {
            console.error('Database connection failed', err);
        }
    }

    async queryWithResult(query, params = null) {
        // console.log("[DEBUG] Db içinde");
        try {        
             let request = this.pool.request();
            // Parametreleri eklemek için input metodu kullanılıyor
            if(params!=null)
            {
                for (let key in params) {
                    if (params.hasOwnProperty(key)) {
                        request.input(key, params[key]);
                    }
                }
            }
            let result = await request.query(query);
            // console.log("[DEBUG] Db bitti");

            return result.recordset;
        } catch (err) {
            // console.log("[DEBUG] Db hata");
            console.error('Query failed', err);
        }

    }

    async queryWithoutResult(query, params = null) {
        try {
            let request = this.pool.request();
            // Parametreleri eklemek için input metodu kullanılıyor
            if(params!=null)
            {
                for (let key in params) {
                    if (params.hasOwnProperty(key)) {
                        request.input(key, params[key]);
                    }
                }
            }
            let result = await request.query(query);
            return result.rowsAffected; 
        } catch (err) {
            console.error('Query failed', err);
        }
    }

    async closeDB() {
        try {
            await sql.close();
            // console.log('Connection closed');
        } catch (err) {
            console.error('Failed to close connection', err);
        }
    }
}

export default DatabaseManager;
