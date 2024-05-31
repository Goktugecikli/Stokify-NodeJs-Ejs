import DatabaseManager from './DbManager.js';

class UserService {
    constructor(dbConfig) {
        this.db = new DatabaseManager(dbConfig);
    }

     async validateUser(username, password) {
        try {
            await this.db.connectDB(); // Veritabanına bağlan
            let params = {username: username, password: password};
            let query = "SELECT COUNT(*) AS count FROM Users WHERE username = @username AND password = @password";
            let result = await this.db.queryWithResult(query, params);
            return result[0].count;
        } catch (err) {
            console.error('Error validating user', err);
        } finally {
            await this.db.closeDB(); // Veritabanı bağlantısını kapat
        }
    }
 
    // Diğer metodları buraya ekleyin...
}

export default UserService;