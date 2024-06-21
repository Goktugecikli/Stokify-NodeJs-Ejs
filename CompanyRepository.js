import DbManager from "./DbManager.js";

class CompanyRepository {
  constructor(dbConfig) {
    this.dbManager = new DbManager(dbConfig);
  }
  async Register(companyName, userName, invateCode) {
    try {
      await this.dbManager.connectDB(); // Veritabanına bağlan
      let params = {
        companyName: companyName,
        userName: userName,
        invateCode: invateCode,
      };
      let query =
        " INSERT INTO Companies (Name, CompanyOwnerUserId, InvateCode, CreatedAt) VALUES (@companyName, (select UserId from users where Username=@userName), @invateCode, getDate());SELECT SCOPE_IDENTITY() AS Id;";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
  async GetCompanyBuUserId(companyId) {
    try {
      await this.dbManager.connectDB(); // Veritabanına bağlan
      let params = { companyId: companyId };
      let query =
        "SELECT * from Companies where CompanyId =  CONVERT(uniqueidentifier,@companyId)";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
  async IsCompanyHasProduct(productId, userCompanyId) {
    try {
      await this.dbManager.connectDB(); // Veritabanına bağlan
      let params = { productId: productId, companyId: userCompanyId };
      let query =
        " select * from CompanyProducts where ProductId= CONVERT(uniqueidentifier,@productId) and CompanyId = CONVERT(uniqueidentifier,@companyId)";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
  async AddProductToCompanyByUserNameAndProduct_id(productId, userName) {
    try {
      await this.dbManager.connectDB(); // Veritabanına bağlan
      let params = { id: productId, userName: userName };
      let query =
        "INSERT INTO CompanyProducts (ProductId, CompanyId) VALUES ((select ProductId from Products where Id=@id),(Select CompanyId from CompanyUsers where UserId = (Select UserId from Users where UserName=@userName)));SELECT SCOPE_IDENTITY() AS Id;";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
  async GetCompanyDetailsByInvateCode(invateCode) {
    try {
      await this.dbManager.connectDB(); // Veritaban1ına bağlan
      let params = { invateCode: invateCode };
      let query = "SELECT * from Companies where InvateCode = @invateCode";
      return await this.dbManager.queryWithResult(query, params);
    } catch (err) {
      // console.error("Error repossitory connection. Error ", err);
    } finally {
      await this.dbManager.closeDB(); // Veritabanı bağlantısını kapat
    }
  }
}

export default CompanyRepository;
