import DatabaseManager from "./DbManager.js";

class UserRepository {
  constructor(dbConfig) {
    this.dbManager = new DatabaseManager(dbConfig);
  }
  async GetCompanyByUserName(userName) {
    try {
      await this.dbManager.connectDB();
      let params = { userName: userName };
      let query = "Select * from CompanyUsers where UserId = (select UserId from Users where Username=@userName)";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      console.error("Error retrieving user details:", err);
    } finally {
      await this.dbManager.closeDB();
    }
  }
  async GetUserDetailsByUserIs(userId) {
    try {
      await this.dbManager.connectDB();
      let params = { userName: userName };
      let query = "Select * from CompanyUsers where UserId = (select UserId from Users where Username=@userName)";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      console.error("Error retrieving user details:", err);
    } finally {
      await this.dbManager.closeDB();
    }
  }
  async GetUserDetailsByUserName(userName) {
    try {
      await this.dbManager.connectDB();
      let params = { userName: userName };
      let query = "SELECT * FROM Users WHERE UserName = @userName";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      console.error("Error retrieving user details:", err);
    } finally {
      await this.dbManager.closeDB();
    }
  }

  async JoinCompanyByUserIdAndCompanyId(userId, companyId) {
    try {
      await this.dbManager.connectDB();
      let params = { userId: userId, companyId: companyId };
      let query = "INSERT INTO CompanyUsers (UserId, CompanyId) VALUES (@userId, @companyId);SELECT SCOPE_IDENTITY() AS Id;";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      console.error("Error joining company:", err);
    } finally {
      await this.dbManager.closeDB();
    }
  }

  async GetUserByNameAndPassword(username, password) {
    try {
      await this.dbManager.connectDB();
      let params = { username: username, password: password };
      let query = "SELECT * FROM Users WHERE Username = @username AND Password = @password";
      let result = await this.dbManager.queryWithResult(query, params);
      return result;
    } catch (err) {
      console.error("Error retrieving user by name and password:", err);
    } finally {
      await this.dbManager.closeDB();
    }
  }

  async GetCompanyByUserId(userId) {
    try {
      await this.dbManager.connectDB();
      let params = { userId: userId };
      let query = "SELECT * FROM CompanyUsers WHERE UserId = CONVERT(uniqueidentifier, @userId)";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      console.error("Error retrieving company by user ID:", err);
    } finally {
      await this.dbManager.closeDB();
    }
  }

  async Register(firstName, lastName, email, userName, password) {
    let params = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      userName: userName,
      password: password,
    };
    try {
      await this.dbManager.connectDB();
      let query = "INSERT INTO Users (Username, Password, Firstname, LastName, Email) VALUES (@userName, @password, @firstName, @lastName, @email)";
      await this.dbManager.queryWithoutResult(query, params);
    } catch (err) {
      console.error("Error registering user:", err);
    } finally {
      await this.dbManager.closeDB();
    }
  }

  async getUserById(username) {
    try {
      await this.dbManager.connectDB();
      let params = { username: username };
      let query = "SELECT * FROM Users WHERE Username = @username";
      let result = await this.dbManager.queryWithResult(query, params);
      // console.log(result);
      // console.log(result[0].Password);
      // console.log(result[0].Email);
      // console.log(result[0].UserId);
      return result; // Tek bir kullanıcı döneceği varsayımıyla
    } catch (err) {
      console.error("Error repository connection. Err", err);
    } finally {
      await this.dbManager.closeDB();
    }
  }

}

export default UserRepository;
