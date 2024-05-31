import DatabaseManager from './DbManager.js';

class UserService {
    constructor(dbConfig) {
        this.db = new DatabaseManager(dbConfig);
    }

    async validateUser(username, password) {
        console.log("[DEBUG] User Service Çalıştı");
        const query = "SELECT COUNT(*) as count FROM Users WHERE username = @username AND password = @password";
        const params = { username, password };
        const result = await this.db.queryWithResult(query, params);
        console.log("[DEBUG] User Service Bitti")

        return result[0].count;
    }

    // Diğer metodları buraya ekleyin...
}

export default UserService;