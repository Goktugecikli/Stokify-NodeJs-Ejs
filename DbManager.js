import sql from "mssql/msnodesqlv8.js";

class Database {
    constructor(dbConfig) {
        this.dbConfig = dbConfig;
        this.pool = new sql.ConnectionPool(dbConfig);
        this.pool.connect();
    }

    async connectDB() {
        try {
            this.pool = await sql.connect(this.dbConfig);
            console.log('Connected to database');
            return this.pool;
        } catch (err) {
            console.error('Database connection failed', err);
        }
    }

    async queryWithResult(query, params = null) {
        console.log("[DEBUG] Db içinde");
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
            console.log("[DEBUG] Db bitti");

            return result.recordset;
        } catch (err) {
            console.log("[DEBUG] Db hata");

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
            console.log('Connection closed');
        } catch (err) {
            console.error('Failed to close connection', err);
        }
    }
}

export default Database;
