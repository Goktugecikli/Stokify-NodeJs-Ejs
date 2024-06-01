import DatabaseManager from './DbManager.js';

class UserRepository {
    constructor(dbConfig) {
        this.db = new DatabaseManager(dbConfig);
    }

     async GetUserByNameAndPassword(username, password) {
        try {
            await this.db.connectDB(); // Veritabanına bağlan
            let params = {username: username, password: password};
            let query = "SELECT COUNT(*) AS count FROM Users WHERE username = @username AND password = @password";
            let result = await this.db.queryWithResult(query, params);
            return result[0].count;
        } catch (err) {
            console.error('Error repossitory connection. Err ' , err);
        } finally {
            await this.db.closeDB(); // Veritabanı bağlantısını kapat
        }
    }
    
    async getUserById(username) {
        try {
            await this.db.connectDB();
            let params = { username: username };
            let query = "SELECT * FROM Users WHERE Username = @username";
            let result = await this.db.queryWithResult(query, params);
            // console.log(result);
            // console.log(result[0].Password);
            // console.log(result[0].Email);
            // console.log(result[0].UserId);
            return result; // Tek bir kullanıcı döneceği varsayımıyla
        } catch (err) {
            console.error('Error repository connection. Err', err);
        } finally {
            await this.db.closeDB();
        }
    }


}

export default UserRepository;