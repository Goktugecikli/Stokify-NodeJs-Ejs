import DatabaseManager from './DbManager.js';

class UserRepository {
    constructor(dbConfig) {
        this.db = new DatabaseManager(dbConfig);
    }

    async GetUserByNameAndPassword(username, password) {
        try {
            await this.db.connectDB(); // Veritabanına bağlan
            let params = { username: username, password: password };
            let query = "SELECT COUNT(*) AS count FROM Users WHERE username = @username AND password = @password";
            let result = await this.db.queryWithResult(query, params);
            return result[0].count;
        } catch (err) {
            console.error('Error repossitory connection. Err ', err);
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

    async Register(firstName, lastName, email, userName, password) {
        let params =
        {
            firstName: firstName,
            lastName: lastName,
            email: email,
            userName: userName,
            password: password
        }


        try {
            await this.db.connectDB();

            let query = "INSERT INTO Users (Username,Password,Firstname,LastName,Email) VALUES (@userName,@password,@firstName,@lastName,@email)";
            let result = await this.db.queryWithoutResult(query, params);
            return result;
        } catch (error) {
            console.log("register error : "+ error);
        }
        finally {
            await this.db.closeDB(); // Veritabanı bağlantısını kapat
        }
    }

}

export default UserRepository;